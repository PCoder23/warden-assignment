"use client";

import { useState, useEffect, useCallback } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import SearchBar from "@/components/SearchBar";
import Filter from "@/components/Filter";
import PropertyCard from "@/components/PropertyCard";
import { WEATHER_CODE_MAP } from "@/lib/constants";

interface Property {
  id: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isActive: boolean;
  weather?: WeatherData | null;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
}

interface Filters {
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  weatherConditions: string[];
}

export default function Home() {
  const [searchText, setSearchText] = useState("");
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>({
    tempMin: -20,
    tempMax: 50,
    humidityMin: 0,
    humidityMax: 100,
    weatherConditions: [],
  });

  const fetchProperties = useCallback(
    async (search = "", activeFilters: Filters) => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (search) params.append("searchText", search);
        params.append("tempMin", activeFilters.tempMin.toString());
        params.append("tempMax", activeFilters.tempMax.toString());
        params.append("humidityMin", activeFilters.humidityMin.toString());
        params.append("humidityMax", activeFilters.humidityMax.toString());
        const numericCodes = activeFilters.weatherConditions.flatMap(
          (cond) => WEATHER_CODE_MAP[cond] || []
        );
        numericCodes.forEach((code) =>
          params.append("conditions", code.toString())
        );

        const response = await fetch(
          `http://localhost:5000/get-properties?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        setProperties(data || []);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to fetch properties";
        setError(errorMessage);
        console.error("Error fetching properties:", error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const handleSearch = useCallback(
    (text: string) => {
      setSearchText(text);
      fetchProperties(text, filters);
    },
    [filters, fetchProperties]
  );

  const handleFilterChange = useCallback(
    (newFilters: Filters) => {
      setFilters(newFilters);
      fetchProperties(searchText, newFilters);
    },
    [searchText, fetchProperties]
  );

  // Initial load
  useEffect(() => {
    fetchProperties("", filters);
  }, []);

  return (
    <main className="max-h-screen relative bg-background">
      <div className="container mx-auto px-4 py-8 max-w-[1400px]">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-8 bg-white z-[9999]">
          <div>
            <h1 className="text-4xl font-bold  mb-2">
              🏠 Weather to Stay or Not
            </h1>
            <p className="">
              Find your perfect property based on weather conditions
            </p>
          </div>
          {/* Search Bar */}
          <div>
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Column - Filters */}
          <div className="lg:col-span-1">
            <Filter filters={filters} onFilterChange={handleFilterChange} />
          </div>

          {/* Right Column - Properties */}
          <div className="lg:col-span-3">
            <div className="mb-4">
              <p className="text-sm ">
                Found{" "}
                <span className="font-semibold ">{properties.length}</span>{" "}
                properties
              </p>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-lg border border-red-200 bg-red-50 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-red-900">
                    Unable to load properties
                  </p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            )}

            {loading && (
              <div className="p-8 text-center border-[#e5e5e5] text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <p>Loading properties...</p>
                </div>
              </div>
            )}

            {!loading && properties.length === 0 && !error && (
              <div className="p-8 text-center border-[#e5e5e5] text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
                <p className="">No properties found matching your criteria.</p>
              </div>
            )}

            {!loading && properties.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {properties.map((property) => (
                  <PropertyCard
                    key={property.id}
                    property={property}
                    weather={property.weather ?? undefined}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
