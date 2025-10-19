interface WeatherFilterInput {
  tempMin?: number;
  tempMax?: number;
  humidityMin?: number;
  humidityMax?: number;
  conditions?: number[];
}

export class WeatherFilterService {
  private static getConditionCodes(condition: string): number[] {
    const mapping: Record<string, number[]> = {
      clear: [0],
      cloudy: [1, 2, 3],
      drizzle: [51, 52, 53, 54, 55, 56, 57],
      rainy: [61, 62, 63, 64, 65, 66, 67, 80, 81, 82],
      snow: [71, 72, 73, 74, 75, 77, 80, 85, 86],
    };
    return mapping[condition.toLowerCase()] || [];
  }

  static matchesFilter(
    weather: {
      temperature: number;
      humidity: number;
      weatherCode: number;
    },
    filter: WeatherFilterInput
  ): boolean {
    if (filter.tempMin !== undefined && weather.temperature < filter.tempMin) {
      return false;
    }
    if (filter.tempMax !== undefined && weather.temperature > filter.tempMax) {
      return false;
    }
    if (
      filter.humidityMin !== undefined &&
      weather.humidity < filter.humidityMin
    ) {
      return false;
    }
    if (
      filter.humidityMax !== undefined &&
      weather.humidity > filter.humidityMax
    ) {
      return false;
    }
    if (filter.conditions && filter.conditions.length > 0) {
      if (!filter.conditions.includes(weather.weatherCode)) {
        return false;
      }
    }
    return true;
  }

  static parseFiltersFromQuery(query: Record<string, any>): WeatherFilterInput {
    return {
      tempMin: query.tempMin ? parseFloat(query.tempMin) : undefined,
      tempMax: query.tempMax ? parseFloat(query.tempMax) : undefined,
      humidityMin: query.humidityMin
        ? parseFloat(query.humidityMin)
        : undefined,
      humidityMax: query.humidityMax
        ? parseFloat(query.humidityMax)
        : undefined,
      conditions: query.conditions
        ? (Array.isArray(query.conditions)
            ? query.conditions
            : [query.conditions]
          ).flatMap((c: string) => this.getConditionCodes(c))
        : undefined,
    };
  }
}
