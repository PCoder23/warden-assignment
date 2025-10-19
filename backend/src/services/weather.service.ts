import { getCache, setCache, weatherCache } from "../utils/custom-cache";

export async function fetchWeatherData(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): Promise<{
  temperature: number;
  humidity: number;
  weatherCode: number;
} | null> {
  if (!latitude || !longitude) {
    return null;
  }

  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Try cache first
  const cached = getCache(weatherCache, key);
  if (cached) return cached;

  try {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      current: "temperature_2m,relative_humidity_2m,weather_code",
    });

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params.toString()}`
    );

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    const result = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
    };
    setCache(weatherCache, key, result, 10 * 60 * 1000);
    return result;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
}

export async function matchesWeatherFilters(
  property: any,
  filters: {
    tempMin?: number;
    tempMax?: number;
    humidityMin?: number;
    humidityMax?: number;
    conditions?: number[];
  }
): Promise<{ matches: boolean; weather: any }> {
  const weather = await fetchWeatherData(property.lat, property.lng);

  if (!weather) {
    return { matches: false, weather: null };
  }

  // Check temperature
  if (filters.tempMin !== undefined && filters.tempMax !== undefined) {
    if (
      weather.temperature < filters.tempMin ||
      weather.temperature > filters.tempMax
    ) {
      return { matches: false, weather };
    }
  }

  // Check humidity
  if (filters.humidityMin !== undefined && filters.humidityMax !== undefined) {
    if (
      weather.humidity < filters.humidityMin ||
      weather.humidity > filters.humidityMax
    ) {
      return { matches: false, weather };
    }
  }

  // Check weather conditions
  if (filters.conditions && filters.conditions.length > 0) {
    if (!filters.conditions.includes(weather.weatherCode)) {
      return { matches: false, weather };
    }
  }

  return { matches: true, weather };
}
