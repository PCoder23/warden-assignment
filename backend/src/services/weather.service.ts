import axios from "axios";

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
}

interface WeatherCacheEntry {
  data: WeatherData;
  timestamp: number;
}

const WEATHER_CACHE = new Map<string, WeatherCacheEntry>();
const CACHE_TTL_MS = 3600000; // 1 hour
const OPEN_METEO_URL = "https://api.open-meteo.com/v1/forecast";

export class WeatherService {
  private static getCacheKey(lat: number, lng: number): string {
    return `${lat.toFixed(4)},${lng.toFixed(4)}`;
  }

  private static isCacheValid(entry: WeatherCacheEntry): boolean {
    return Date.now() - entry.timestamp < CACHE_TTL_MS;
  }

  static async fetchWeather(lat: number, lng: number): Promise<WeatherData> {
    const cacheKey = this.getCacheKey(lat, lng);

    // Check cache first
    const cached = WEATHER_CACHE.get(cacheKey);
    if (cached && this.isCacheValid(cached)) {
      return cached.data;
    }

    try {
      const response = await axios.get(OPEN_METEO_URL, {
        params: {
          latitude: lat,
          longitude: lng,
          current: "temperature_2m,relative_humidity_2m,weather_code",
          timezone: "auto",
        },
        timeout: 5000,
      });

      const current = response.data.current;
      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        humidity: current.relative_humidity_2m,
        weatherCode: current.weather_code,
      };

      // Cache the result
      WEATHER_CACHE.set(cacheKey, {
        data: weatherData,
        timestamp: Date.now(),
      });

      return weatherData;
    } catch (error) {
      console.error(`Failed to fetch weather for (${lat}, ${lng}):`, error);
      throw error;
    }
  }

  static async fetchWeatherBatch(
    coordinates: Array<{ lat: number; lng: number; id: number }>
  ): Promise<Map<number, WeatherData>> {
    const results = new Map<number, WeatherData>();

    // Fetch in parallel with concurrency limit (5 concurrent requests)
    const concurrency = 5;
    for (let i = 0; i < coordinates.length; i += concurrency) {
      const batch = coordinates.slice(i, i + concurrency);
      const promises = batch.map(async (coord) => {
        try {
          const weather = await this.fetchWeather(coord.lat, coord.lng);
          results.set(coord.id, weather);
        } catch {
          // Return null weather on failure
          results.set(coord.id, {
            temperature: 0,
            humidity: 0,
            weatherCode: -1,
          });
        }
      });
      await Promise.all(promises);
    }

    return results;
  }
}
