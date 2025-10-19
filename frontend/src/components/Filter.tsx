"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Filters {
  tempMin: number;
  tempMax: number;
  humidityMin: number;
  humidityMax: number;
  weatherConditions: string[];
}

interface FilterPanelProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
}

const WEATHER_CONDITIONS = [
  { id: "clear", label: "Clear", icon: "☀️" },
  { id: "cloudy", label: "Cloudy", icon: "☁️" },
  { id: "drizzle", label: "Drizzle", icon: "🌦️" },
  { id: "rainy", label: "Rainy", icon: "🌧️" },
  { id: "snow", label: "Snow", icon: "❄️" },
];

export default function Filter({ filters, onFilterChange }: FilterPanelProps) {
  const [expanded, setExpanded] = useState(true);

  const handleTempMinChange = (value: number) => {
    const newMin = Math.min(value, filters.tempMax);
    onFilterChange({ ...filters, tempMin: newMin });
  };

  const handleTempMaxChange = (value: number) => {
    const newMax = Math.max(value, filters.tempMin);
    onFilterChange({ ...filters, tempMax: newMax });
  };

  const handleHumidityMinChange = (value: number) => {
    const newMin = Math.min(value, filters.humidityMax);
    onFilterChange({ ...filters, humidityMin: newMin });
  };

  const handleHumidityMaxChange = (value: number) => {
    const newMax = Math.max(value, filters.humidityMin);
    onFilterChange({ ...filters, humidityMax: newMax });
  };

  const handleWeatherConditionToggle = (condition: string) => {
    const updated = filters.weatherConditions.includes(condition)
      ? filters.weatherConditions.filter((c) => c !== condition)
      : [...filters.weatherConditions, condition];
    onFilterChange({ ...filters, weatherConditions: updated });
  };

  const handleReset = () => {
    onFilterChange({
      tempMin: -20,
      tempMax: 50,
      humidityMin: 0,
      humidityMax: 100,
      weatherConditions: [],
    });
  };

  return (
    <div className="p-6 flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-[#e5e5e5]">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-2 font-semibold  hover:text-primary transition-colors"
        >
          Filters
          {expanded ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
        <button
          className="border shadow-xs hover:bg-gray-100 inline-flex items-center justify-center text-sm font-medium transition-all shrink-0 outline-none h-8 rounded-md gap-1.5 px-3 "
          onClick={handleReset}
        >
          Reset
        </button>
      </div>

      {expanded && (
        <div className="space-y-6">
          {/* Temperature Range */}
          <div>
            <label className="block text-sm font-medium  mb-3">
              Temperature Range: {filters.tempMin}°C to {filters.tempMax}°C
            </label>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs ">Min</label>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={filters.tempMin}
                    onChange={(e) =>
                      handleTempMinChange(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs ">Max</label>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={filters.tempMax}
                    onChange={(e) =>
                      handleTempMaxChange(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Humidity Range */}
          <div>
            <label className="block text-sm font-medium  mb-3">
              Humidity Range: {filters.humidityMin}% to {filters.humidityMax}%
            </label>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs ">Min</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.humidityMin}
                    onChange={(e) =>
                      handleHumidityMinChange(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs ">Max</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={filters.humidityMax}
                    onChange={(e) =>
                      handleHumidityMaxChange(Number(e.target.value))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Weather Conditions */}
          <div>
            <label className="block text-sm font-medium  mb-3">
              Weather Conditions
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {WEATHER_CONDITIONS.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleWeatherConditionToggle(condition.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    filters.weatherConditions.includes(condition.id)
                      ? "bg-[#1717171a] border-black"
                      : "border-[#e5e5e5] hover:border-[#a3a3a3] "
                  }`}
                >
                  <div className="text-2xl mb-1">{condition.icon}</div>
                  <div className="text-xs font-medium">{condition.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
