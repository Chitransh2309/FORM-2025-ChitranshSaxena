"use client";

import { ChevronDown } from "lucide-react";
import { useState } from "react";

interface Props {
  viewMode: "Individual response" | "Grouped response";
  onViewModeChange: (mode: "Individual response" | "Grouped response") => void;
}

export default function ViewModeDropdown({
  viewMode,
  onViewModeChange,
}: Props) {
  const [showDropdown, setShowDropdown] = useState(false);

  const modes: ("Individual response" | "Grouped response")[] = [
    "Individual response",
    "Grouped response",
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md text-sm bg-white shadow-sm dark:bg-[#61A986] dark:border-gray-600 dark:text-white"
      >
        {viewMode} <ChevronDown size={16} />
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#333] shadow-lg rounded-md border dark:border-gray-600 z-10">
          {modes.map((mode) => (
            <button
              key={mode}
              onClick={() => {
                onViewModeChange(mode);
                setShowDropdown(false);
              }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#444] ${
                viewMode === mode
                  ? "bg-[#61A986] text-white rounded-md font-semibold"
                  : ""
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
