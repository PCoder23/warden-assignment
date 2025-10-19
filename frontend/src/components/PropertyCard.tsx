"use client";
import { MapPin, Thermometer, Droplets } from "lucide-react";

interface Property {
  id: number;
  name: string;
  city?: string;
  state?: string;
  country?: string;
  lat?: number;
  lng?: number;
  isActive: boolean;
}

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
}

interface PropertyCardProps {
  property: Property;
  weather?: WeatherData;
}

function getWeatherDescription(code: number): string {
  if (code === 0) return "Clear Sky";
  if ([1, 2, 3].includes(code)) return "Cloudy";
  if ([51, 52, 53, 54, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 62, 63, 64, 65, 66, 67, 80, 81, 82].includes(code)) return "Rainy";
  if ([71, 72, 73, 74, 75, 76, 77, 85, 86].includes(code)) return "Snow";
  return "Unknown";
}

function getWeatherEmoji(code: number): string {
  if (code === 0) return "☀️";
  if ([1, 2, 3].includes(code)) return "☁️";
  if ([51, 52, 53, 54, 55, 56, 57].includes(code)) return "🌦️";
  if ([61, 62, 63, 64, 65, 66, 67, 80, 81, 82].includes(code)) return "🌧️";
  if ([71, 72, 73, 74, 75, 76, 77, 85, 86].includes(code)) return "❄️";
  return "🌍";
}

export function PropertyCard({ property, weather }: PropertyCardProps) {
  return (
    <div className="p-6 hover:shadow-lg transition-shadow flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-[#e5e5e5]">
      <div className="space-y-4">
        {/* Property Name */}
        <div>
          <h3 className="text-lg font-semibold line-clamp-2">
            {property.name}
          </h3>
        </div>

        {/* Location */}
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <div>
            {property.city && <div>{property.city}</div>}
            {property.state && <div>{property.state}</div>}
            {property.country && <div>{property.country}</div>}
          </div>
        </div>

        {/* Weather Info */}
        {weather ? (
          <div className="space-y-3 pt-4 border-t border-[#e5e5e5]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {getWeatherEmoji(weather.weatherCode)}
                </span>
                <div>
                  <div className="text-sm font-medium">
                    {getWeatherDescription(weather.weatherCode)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2p-2 rounded">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-xs">Temperature</div>
                  <div className="font-semibold">{weather.temperature}°C</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded">
                <Droplets className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs">Humidity</div>
                  <div className="font-semibold ">{weather.humidity}%</div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-sm italic">Weather data unavailable</div>
        )}

        {/* Status */}
        <div className="pt-2">
          <span
            className={`inline-block px-2 py-1 rounded text-xs font-medium ${
              property.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
                : "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
            }`}
          >
            {property.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>
    </div>
  );
}
