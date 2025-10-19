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

const mockProperties: Property[] = [
  {
    id: 1,
    name: "Palm Residency",
    city: "Goa",
    state: "Goa",
    country: "India",
    lat: 15.2993,
    lng: 74.124,
    isActive: true,
    weather: { temperature: 32, humidity: 70, weatherCode: 1 },
  },
  {
    id: 2,
    name: "Hill View Apartments",
    city: "Shimla",
    state: "Himachal Pradesh",
    country: "India",
    lat: 31.1048,
    lng: 77.1734,
    isActive: true,
    weather: { temperature: 12, humidity: 40, weatherCode: 3 },
  },
  {
    id: 3,
    name: "Riverfront Villa",
    city: "Rishikesh",
    state: "Uttarakhand",
    country: "India",
    lat: 30.0869,
    lng: 78.2676,
    isActive: true,
    weather: { temperature: 25, humidity: 60, weatherCode: 61 },
  },
  {
    id: 4,
    name: "Snow Crest Chalet",
    city: "Manali",
    state: "Himachal Pradesh",
    country: "India",
    lat: 32.2396,
    lng: 77.1887,
    isActive: true,
    weather: { temperature: -3, humidity: 50, weatherCode: 75 },
  },
];

export default function Home() {
  const [searchText, setSearchText] = useState("");
  // TODO: Remove mock data when backend is ready
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    tempMin: -20,
    tempMax: 50,
    humidityMin: 0,
    humidityMax: 100,
    weatherConditions: [],
  });

  //TODO: Fetch properties from the backend after backend is ready
  const fetchProperties = async () => {};

  // Handle search
  const handleSearch = (text: string) => {
    setSearchText(text);
    // TODO: Fetch properties based on search text after fetching is implemented
    // fetchProperties();
  };

  // Handle filter changes
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // TODO: Fetch properties based on filters after fetching is implemented
    // fetchProperties();
  };

  // Initial load
  useEffect(() => {
    // TODO: Fetch properties from the backend after backend is ready
    // fetchProperties();
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
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : properties.length === 0 ? (
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
