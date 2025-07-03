"use client";
import React from "react";

interface DropdownProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  disabled?: boolean;
}

export default function Dropdown({ options, onOptionsChange, disabled = false }: DropdownProps) {
  return (
    <div className="space-y-2 mt-4">
      <div className="flex flex-col gap-2">
        {options.map((option, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              type="text"
              value={option}
              disabled={disabled}
              className="border px-2 py-1 rounded dark:bg-[#5A5959] dark:text-white"
              onChange={e => {
                const newOptions = [...options];
                newOptions[idx] = e.target.value;
                onOptionsChange(newOptions);
              }}
            />
            {!disabled && (
              <button
                className="text-red-500"
                onClick={() => onOptionsChange(options.filter((_, i) => i !== idx))}
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>
      {!disabled && (
        <button
          className="bg-[#8CC7AA] px-2 py-1 rounded text-white"
          onClick={() => onOptionsChange([...options, `Option ${options.length + 1}`])}
        >
          Add Option
        </button>
      )}
      <div className="mt-2">
        <select className="border px-2 py-1 rounded dark:bg-[#5A5959] dark:text-white" disabled>
          {options.map((option, idx) => (
            <option key={idx}>{option}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
