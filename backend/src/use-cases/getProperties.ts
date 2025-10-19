import { Request, Response } from "express";
import { prisma } from "../database/prisma";
import { Prisma } from "@prisma/client";
import { ParamsValidator } from "../validators/paramsValidator";
import { matchesWeatherFilters } from "../services/weather.service";

const DESIRED_RESULTS = 20;
const FETCH_BATCH_SIZE = 50;
const MAX_ATTEMPTS = 3;

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
    // Step 0: params validation
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
    const condVal = ParamsValidator.validateWeatherConditions(
      req.query.conditions as string | string[]
    );
    if (!condVal.valid) {
      return res.status(400).json({ error: condVal.error });
    }

    console.log("Weather conditions validation passed:", condVal.parsed);

    // Build filter object
    const weatherFilters = {
      tempMin: tempVal.parsed?.min,
      tempMax: tempVal.parsed?.max,
      humidityMin: humVal.parsed?.min,
      humidityMax: humVal.parsed?.max,
      conditions: condVal.parsed,
    };

    // Step 1: Fetch in batches until we get 20 matching properties
    const whereClause = buildPropertyWhere(req);
    const matched: any[] = [];
    let skip = 0;
    let attempt = 0;

    while (matched.length < DESIRED_RESULTS && attempt < MAX_ATTEMPTS) {
      // Fetch batch from database
      const properties = await prisma.property.findMany({
        skip,
        take: FETCH_BATCH_SIZE,
        where: whereClause,
        orderBy: { id: "asc" },
      });

      console.log(
        `Attempt ${attempt + 1}: fetched ${properties.length} properties`
      );

      if (properties.length === 0) {
        break; // No more properties in database
      }

      // Check weather filters for this batch
      for (const property of properties) {
        // Check if we already have 20 matches
        if (matched.length >= DESIRED_RESULTS) {
          break;
        }

        const { matches, weather } = await matchesWeatherFilters(
          property,
          weatherFilters
        );

        if (matches) {
          // Attach weather data to property
          matched.push({
            ...property,
            weather,
          });
          console.log(`Property ${property.id} matched all filters`);
        }
      }

      skip += FETCH_BATCH_SIZE;
      attempt += 1;
    }

    console.log(`Final result: ${matched.length} properties matched`);

    // Return up to 20 matching properties
    return res.json(matched.slice(0, DESIRED_RESULTS));
  } catch (error) {
    console.error("Error fetching properties:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};
