"use client";

import React from "react";

interface LinearScaleProps {
  min: number;
  max: number;
  minLabel: string;
  maxLabel: string;
  selected?: number;
  onSelect: (value: number) => void;
  disabled?: boolean;
}

export default function LinearScale({
  min,
  max,
  minLabel,
  maxLabel,
  selected,
  onSelect,
  disabled = false,
}: LinearScaleProps) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  return (
    <div className="mt-4 space-y-2">
      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
      <div className="flex gap-2">
        {range.map((num) => (
          <button
            key={num}
            onClick={() => !disabled && onSelect(num)}
            className={`w-8 h-8 text-sm rounded-full border 
              ${
                selected === num
                  ? "bg-blue-600 text-white"
                  : "border-gray-300 dark:border-gray-600 dark:text-white"
              } 
              ${disabled ? "cursor-not-allowed" : "hover:bg-blue-100 dark:hover:bg-[#3a3a3a]"}`}
            disabled={disabled}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}