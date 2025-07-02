"use client";
import React, { useState, useEffect } from "react";

interface TextFieldProps {
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export default function TextField({ 
  value = "", 
  placeholder = "Your answer", 
  multiline = false,
  onChange,
  disabled = false 
}: TextFieldProps) {
  const [textValue, setTextValue] = useState(value);

  useEffect(() => {
    setTextValue(value);
  }, [value]);

  const handleChange = (newValue: string) => {
    setTextValue(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  if (disabled) {
    // Preview mode - show the field as it would appear to form respondents
    if (multiline) {
      return (
        <div className="mt-4">
          <textarea
            value={textValue}
            placeholder={placeholder}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 resize-none min-h-[100px] focus:outline-none dark:bg-[#494949] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            readOnly
          />
        </div>
      );
    }

    return (
      <div className="mt-4">
        <input
          type="text"
          value={textValue}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 focus:outline-none dark:bg-[#494949] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
          readOnly
        />
      </div>
    );
  }

  // Edit mode - show editable field for form builder
  return (
    <div className="mt-4 space-y-3">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
        Text Field Preview:
      </div>
      
      {multiline ? (
        <textarea
          value={textValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      ) : (
        <input
          type="text"
          value={textValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
        />
      )}
    </div>
  );
}