"use client";

import React, { useEffect, useState } from "react";
import { Plus, X } from "lucide-react";

interface DropdownProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  disabled?: boolean;
}

export default function Dropdown({
  options,
  onOptionsChange,
  disabled = false,
}: DropdownProps) {
  const [localOptions, setLocalOptions] = useState<string[]>(
    options.length > 0 ? options : ["Option 1", "Option 2"]
  );

  useEffect(() => {
    if (!options || options.length === 0) {
      const defaultOptions = ["Option 1", "Option 2"];
      setLocalOptions(defaultOptions);
      onOptionsChange(defaultOptions);
    }
  }, [onOptionsChange]); // Added missing dependency

  useEffect(() => {
    if (options.length > 0) {
      setLocalOptions(options);
    }
  }, [options]);

  const handleChange = (index: number, value: string) => {
    const newOpts = [...localOptions];
    newOpts[index] = value;
    setLocalOptions(newOpts);
    onOptionsChange(newOpts);
  };

  const addOption = () => {
    const newOpts = [...localOptions, `Option ${localOptions.length + 1}`];
    setLocalOptions(newOpts);
    onOptionsChange(newOpts);
  };

  const removeOption = (index: number) => {
    if (localOptions.length > 1) {
      const newOpts = localOptions.filter((_, i) => i !== index);
      setLocalOptions(newOpts);
      onOptionsChange(newOpts);
    }
  };

  if (disabled) {
    return (
      <div className="mt-4">
        <select
          disabled
          className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
        >
          {localOptions.map((option, i) => (
            <option key={i}>{option}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className="space-y-3 mt-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Dropdown Options:
      </div>

      {localOptions.map((option, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <input
            type="text"
            value={option}
            onChange={(e) => handleChange(index, e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder={`Option ${index + 1}`}
          />
          {localOptions.length > 1 && (
            <button
              onClick={() => removeOption(index)}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded dark:hover:bg-red-900/20"
              title="Remove option"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ))}

      <button
        onClick={addOption}
        className="flex items-center gap-2 px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20"
      >
        <Plus size={16} />
        Add Option
      </button>
    </div>
  );
}