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
  const [pendingFilters, setPendingFilters] = useState<Filters>(filters);

  const handleTempMinChange = (value: number) => {
    const newMin = Math.min(value, pendingFilters.tempMax);
    setPendingFilters({ ...pendingFilters, tempMin: newMin });
  };

  const handleTempMaxChange = (value: number) => {
    const newMax = Math.max(value, pendingFilters.tempMin);
    setPendingFilters({ ...pendingFilters, tempMax: newMax });
  };

  const handleHumidityMinChange = (value: number) => {
    const newMin = Math.min(value, pendingFilters.humidityMax);
    setPendingFilters({ ...pendingFilters, humidityMin: newMin });
  };

  const handleHumidityMaxChange = (value: number) => {
    const newMax = Math.max(value, pendingFilters.humidityMin);
    setPendingFilters({ ...pendingFilters, humidityMax: newMax });
  };

  const handleWeatherConditionToggle = (condition: string) => {
    const updated = pendingFilters.weatherConditions.includes(condition)
      ? pendingFilters.weatherConditions.filter((c) => c !== condition)
      : [...pendingFilters.weatherConditions, condition];
    setPendingFilters({ ...pendingFilters, weatherConditions: updated });
  };

  const handleApplyFilters = () => {
    onFilterChange(pendingFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      tempMin: -20,
      tempMax: 50,
      humidityMin: 0,
      humidityMax: 100,
      weatherConditions: [],
    };
    setPendingFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="p-6 flex flex-col gap-6 rounded-xl border py-6 shadow-sm border-[#e5e5e5] h-max sticky top-4 bg-white">
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
              Temperature Range: {pendingFilters.tempMin}°C to{" "}
              {pendingFilters.tempMax}°C
            </label>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs ">Min</label>
                  <input
                    type="range"
                    min="-20"
                    max="50"
                    value={pendingFilters.tempMin}
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
                    value={pendingFilters.tempMax}
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
              Humidity Range: {pendingFilters.humidityMin}% to{" "}
              {pendingFilters.humidityMax}%
            </label>
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-xs ">Min</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={pendingFilters.humidityMin}
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
                    value={pendingFilters.humidityMax}
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
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {WEATHER_CONDITIONS.map((condition) => (
                <button
                  key={condition.id}
                  onClick={() => handleWeatherConditionToggle(condition.id)}
                  className={`p-3 rounded-lg border-2 transition-all text-center ${
                    pendingFilters.weatherConditions.includes(condition.id)
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

          <div className="flex gap-2 pt-4 border-t border-[#e5e5e5]">
            <button
              onClick={handleApplyFilters}
              className="flex-1 bg-black text-white hover:bg-gray-800 inline-flex items-center justify-center text-sm font-medium transition-all shrink-0 outline-none h-9 rounded-md gap-1.5 px-3"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
