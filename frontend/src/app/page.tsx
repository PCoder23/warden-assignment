"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import Filter from "@/components/Filter";
import { PropertyCard } from "@/components/PropertyCard";

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
  const [filters, setFilters] = useState<Filters>({
    tempMin: -20,
    tempMax: 50,
    humidityMin: 0,
    humidityMax: 100,
    weatherConditions: [],
  });

  const fetchProperties = async (
    search: string = "",
    activeFilters: Filters = filters
  ) => {
    try {
      const params = new URLSearchParams();
      if (search) params.append("searchText", search);
      params.append("tempMin", activeFilters.tempMin.toString());
      params.append("tempMax", activeFilters.tempMax.toString());
      params.append("humidityMin", activeFilters.humidityMin.toString());
      params.append("humidityMax", activeFilters.humidityMax.toString());
      activeFilters.weatherConditions.forEach((cond) =>
        params.append("conditions", cond)
      );
      const response = await fetch(
        `http://localhost:5000/get-properties?${params.toString()}`
      );
      const data = await response.json();
      setProperties(data || []);
    } catch (error) {
      console.error("Error fetching properties:", error);
    }
  };
  // Handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
    fetchProperties(text, filters);
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    fetchProperties(searchText, newFilters);
  };

  // Initial load
  useEffect(() => {
    fetchProperties("", filters);
  }, []);

  return (
    <main className="min-h-screen max-w-[1200px] bg-background mx-auto ">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold  mb-2">
            🏠 Weather to Stay or Not
          </h1>
          <p className="">
            Find your perfect property based on weather conditions
          </p>
        </div>

        {/* Search and Filters */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <SearchBar onSearch={handleSearch} />
          </div>
          <div className="lg:col-span-1 flex items-center">
            <div className="text-sm ">
              Found <span className="font-semibold ">{properties.length}</span>{" "}
              properties
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <Filter filters={filters} onFilterChange={handleFilterChange} />
        </div>

        {/* Results */}
        <div>
          {properties.length === 0 ? (
            <div className="p-8 text-center border-[#e5e5e5] text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm">
              <p className="">No properties found matching your criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
    </main>
  );
}
