import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";
import { WeatherService } from "../services/weather.service";
import { ParamsValidator } from "../validators/paramsValidator";
import { WeatherFilterService } from "../services/weather-filter.service";

export function buildPropertyWhere(
  req: Request
): Prisma.PropertyWhereInput | undefined {
  const { searchText } = req.query;

  console.log("Search text received:", searchText);

  if (typeof searchText !== "string") {
    return undefined;
  }

  if (!searchText || searchText.trim().length === 0) {
    return undefined;
  }

  const query = searchText.trim();

  return {
    OR: [
      { name: { contains: query } },
      { city: { contains: query } },
      { state: { contains: query } },
    ],
  };
}

export const getProperties = async (req: Request, res: Response) => {
  try {
    // Step 0 params validation
    const tempVal = ParamsValidator.validateTempRange(
      req.query.tempMin as string,
      req.query.tempMax as string
    );
    if (!tempVal.valid) {
      return res.status(400).json({ error: tempVal.error });
    }

    console.log("Temperature validation passed:", tempVal.parsed);

    const humVal = ParamsValidator.validateHumidityRange(
      req.query.humidityMin as string,
      req.query.humidityMax as string
    );
    if (!humVal.valid) {
      return res.status(400).json({ error: humVal.error });
    }

    console.log("Humidity validation passed:", humVal.parsed);

    const condVal = ParamsValidator.validateWeatherConditions(
      req.query.conditions as string | string[]
    );
    if (!condVal.valid) {
      return res.status(400).json({ error: condVal.error });
    }

    console.log("Weather conditions validation passed:", condVal.parsed);

    // Step 1: Fetch properties from database with text search
    const properties = await prisma.property.findMany({
      take: 20,
      where: buildPropertyWhere(req),
    });

    console.log("Properties fetched from database:", properties);

    if (!properties || properties.length === 0) {
      return res.json([]);
    }

    // Step 2: Prepare coordinates for batch weather fetch
    const coordinates = properties
      .filter((p) => p.lat !== null && p.lng !== null)
      .map((p) => ({
        id: p.id,
        lat: p.lat as number,
        lng: p.lng as number,
      }));

    // Step 3: Fetch weather data in batches
    let weatherMap = new Map();
    if (coordinates.length > 0) {
      weatherMap = await WeatherService.fetchWeatherBatch(coordinates);
    }

    // Step 4: Parse weather filters from query
    const weatherFilters = WeatherFilterService.parseFiltersFromQuery(
      req.query
    );

    // Step 5: Combine properties with weather and filter
    const enrichedProperties = properties
      .map((property) => ({
        ...property,
        weather: weatherMap.get(property.id) || null,
      }))
      .filter((item) => {
        if (!item.weather || item.weather.weatherCode === -1) {
          return true; // Include properties where weather fetch failed
        }
        return WeatherFilterService.matchesFilter(item.weather, weatherFilters);
      });

    return res.json(enrichedProperties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
