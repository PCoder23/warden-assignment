import { getCache, setCache, weatherCache } from "../utils/custom-cache";

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
}
export async function fetchWeatherData(
  latitude: number | null | undefined,
  longitude: number | null | undefined
): Promise<WeatherData | null> {
  if (!latitude || !longitude) {
    return null;
  }

  const key = `${latitude.toFixed(4)},${longitude.toFixed(4)}`;

  // Check cache first
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
    const result: WeatherData = {
      temperature: data.current.temperature_2m,
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
    };

    // Cache for 10 minutes
    setCache(weatherCache, key, result, 10 * 60 * 1000);
    return result;
  } catch (error) {
    console.error("Weather fetch error:", error);
    return null;
  }
}

export async function batchFetchWeatherData(
  properties: Array<{ id: number; lat?: number; lng?: number }>
): Promise<Map<number, WeatherData | null>> {
  const weatherMap = new Map<number, WeatherData | null>();
  const coordinateMap = new Map<
    string,
    { ids: number[]; lat: number; lng: number }
  >();

  // Step 1: Group properties by coordinates and check cache
  for (const property of properties) {
    if (!property.lat || !property.lng) {
      weatherMap.set(property.id, null);
      continue;
    }

    const key = `${property.lat.toFixed(4)},${property.lng.toFixed(4)}`;
    const cached = getCache(weatherCache, key);

    if (cached) {
      weatherMap.set(property.id, cached);
    } else {
      if (!coordinateMap.has(key)) {
        coordinateMap.set(key, {
          ids: [],
          lat: property.lat,
          lng: property.lng,
        });
      }
      coordinateMap.get(key)!.ids.push(property.id);
    }
  }

  // Step 2: Fetch unique coordinates in parallel
  if (coordinateMap.size > 0) {
    const fetchPromises = Array.from(coordinateMap.values()).map(
      ({ lat, lng, ids }) =>
        fetchWeatherData(lat, lng).then((weather) => ({ weather, ids }))
    );

    const results = await Promise.all(fetchPromises);

    // Step 3: Populate results for all properties with same coordinates
    results.forEach(({ weather, ids }) => {
      ids.forEach((id) => {
        weatherMap.set(id, weather);
      });
    });
  }

  return weatherMap;
}

export function matchesWeatherFilters(
  weather: WeatherData | null | undefined,
  filters: {
    tempMin?: number;
    tempMax?: number;
    humidityMin?: number;
    humidityMax?: number;
    conditions?: number[];
  }
): boolean {
  if (!weather) return false;

  // Temperature check - allow partial filters
  if (filters.tempMin !== undefined && weather.temperature < filters.tempMin) {
    return false;
  }
  if (filters.tempMax !== undefined && weather.temperature > filters.tempMax) {
    return false;
  }

  // Humidity check - allow partial filters
  if (
    filters.humidityMin !== undefined &&
    weather.humidity < filters.humidityMin
  ) {
    return false;
  }
  if (
    filters.humidityMax !== undefined &&
    weather.humidity > filters.humidityMax
  ) {
    return false;
  }

  // Condition check
  if (filters.conditions && filters.conditions.length > 0) {
    if (!filters.conditions.includes(weather.weatherCode)) {
      return false;
    }
  }

  return true;
}
