"use client";

import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

interface MCQProps {
  options: string[];
  onOptionsChange: (options: string[]) => void;
  disabled?: boolean;
}

export default function MCQ({ options, onOptionsChange, disabled = false }: MCQProps) {
  const [mcqOptions, setMcqOptions] = useState<string[]>(options.length > 0 ? options : ["Option 1", "Option 2"]);


  useEffect(() => {
  if (!options || options.length === 0) {
    const defaultOptions = ["Option 1", "Option 2"];
    setMcqOptions(defaultOptions);
    onOptionsChange(defaultOptions);
  }
}, []);

  useEffect(() => {
    if (options.length > 0) {
      setMcqOptions(options);
    }
  }, [options]);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...mcqOptions];
    newOptions[index] = value;
    setMcqOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const addOption = () => {
    const newOptions = [...mcqOptions, `Option ${mcqOptions.length + 1}`];
    setMcqOptions(newOptions);
    onOptionsChange(newOptions);
  };

  const removeOption = (index: number) => {
    if (mcqOptions.length > 2) {
      const newOptions = mcqOptions.filter((_, i) => i !== index);
      setMcqOptions(newOptions);
      onOptionsChange(newOptions);
    }
  };

  if (disabled) {
    // Preview mode - show checkboxes for display only
    return (
      <div className="space-y-2 mt-4">
        {mcqOptions.map((option, index) => (
          <div key={index} className="flex items-center gap-3">
            <input
              type="checkbox"
              disabled
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <span className="text-gray-700 dark:text-gray-300">{option}</span>
          </div>
        ))}
      </div>
    );
  }

  // Edit mode - show editable options
  return (
    <div className="space-y-3 mt-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        MCQ Options:
      </div>
      
      {mcqOptions.map((option, index) => (
        <div key={index} className="flex items-center gap-2 group">
          <input
            type="checkbox"
            disabled
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
          />
          <input
            type="text"
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder={`Option ${index + 1}`}
          />
          {mcqOptions.length > 2 && (
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