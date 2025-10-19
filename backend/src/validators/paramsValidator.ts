export class ParamsValidator {
  static validateTempRange(
    min?: string,
    max?: string
  ): {
    valid: boolean;
    error?: string;
    parsed?: { min: number; max: number };
  } {
    if (!min && !max) return { valid: true };

    const minTemp = min ? parseFloat(min) : -20;
    const maxTemp = max ? parseFloat(max) : 50;

    if (isNaN(minTemp) || isNaN(maxTemp)) {
      return { valid: false, error: "Temperature must be a number" };
    }

    if (minTemp < -20 || maxTemp > 50) {
      return {
        valid: false,
        error: "Temperature must be between -20°C and 50°C",
      };
    }

    if (minTemp > maxTemp) {
      return {
        valid: false,
        error: "Min temperature cannot exceed max",
      };
    }

    return { valid: true, parsed: { min: minTemp, max: maxTemp } };
  }

  static validateHumidityRange(
    min?: string,
    max?: string
  ): {
    valid: boolean;
    error?: string;
    parsed?: { min: number; max: number };
  } {
    if (!min && !max) return { valid: true };

    const minHum = min ? parseFloat(min) : 0;
    const maxHum = max ? parseFloat(max) : 100;

    if (isNaN(minHum) || isNaN(maxHum)) {
      return { valid: false, error: "Humidity must be a number" };
    }

    if (minHum < 0 || maxHum > 100) {
      return {
        valid: false,
        error: "Humidity must be between 0% and 100%",
      };
    }

    if (minHum > maxHum) {
      return {
        valid: false,
        error: "Min humidity cannot exceed max",
      };
    }

    return { valid: true, parsed: { min: minHum, max: maxHum } };
  }

  static validateWeatherConditions(conditions?: string | string[]): {
    valid: boolean;
    error?: string;
    parsed?: string[];
  } {
    if (!conditions) return { valid: true };

    const validConditions = ["clear", "cloudy", "drizzle", "rainy", "snow"];
    const condArray = Array.isArray(conditions) ? conditions : [conditions];

    const invalid = condArray.filter(
      (c) => !validConditions.includes(c.toLowerCase())
    );
    if (invalid.length > 0) {
      return {
        valid: false,
        error: `Invalid conditions: ${invalid.join(", ")}`,
      };
    }

    return { valid: true, parsed: condArray };
  }
}
