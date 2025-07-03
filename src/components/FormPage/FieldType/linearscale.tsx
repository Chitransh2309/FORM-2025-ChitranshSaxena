"use client";
import React, { useState } from "react";

interface LinearScaleProps {
  min: number;
  max: number;
  minLabel?: string;
  maxLabel?: string;
  disabled?: boolean;
}

export default function LinearScale({
  min,
  max,
  minLabel,
  maxLabel,
  disabled = false,
}: LinearScaleProps) {
  const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="space-y-2 mt-4">
      <div className="flex items-center gap-4">
        {minLabel && <span className="text-xs">{minLabel}</span>}
        {range.map((val) => (
          <label
            key={val}
            className="flex flex-col items-center cursor-pointer"
            style={{ userSelect: "none" }}
          >
            <input
              type="radio"
              name="linear-scale"
              value={val}
              checked={selected === val}
              disabled={disabled}
              onChange={() => setSelected(val)}
              className="hidden"
            />
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${selected === val ? "bg-[#8CC7AA] border-[#64ad8b]" : "bg-white border-gray-400"}
                ${disabled ? "opacity-50" : "hover:border-[#8CC7AA]"}
                transition-all`}
              style={{ fontSize: "1.1rem" }}
            >
              {selected === val ? (
                <span className="w-4 h-4 bg-white rounded-full block" />
              ) : null}
            </span>
            <span className="text-xs mt-1">{val}</span>
          </label>
        ))}
        {maxLabel && <span className="text-xs">{maxLabel}</span>}
      </div>
      <div className="text-xs text-gray-500 dark:text-gray-400">
        Scale: {min} to {max} {selected !== null && `| Selected: ${selected}`}
      </div>
    </div>
  );
}
