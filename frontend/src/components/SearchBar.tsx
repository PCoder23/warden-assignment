"use client";

import type React from "react";
import { useState, useRef, useCallback } from "react";

interface SearchBarProps {
  onSearch: (text: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState("");
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);

      // Clear previous timer
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // Start a new debounce timer
      debounceRef.current = setTimeout(() => {
        onSearch(newValue.trim());
      }, 500); // 500ms debounce delay
    },
    [onSearch]
  );

  return (
    <div className="flex gap-2">
      <input
        className="selection:bg-primary border-[#e5e5e5] flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm flex-1"
        type="text"
        placeholder="Search by property name, city, or state..."
        value={value}
        onChange={
          // (e: React.ChangeEvent<HTMLInputElement>) =>
          // setValue(e.target.value)
          handleChange
        }
      />
    </div>
  );
}
