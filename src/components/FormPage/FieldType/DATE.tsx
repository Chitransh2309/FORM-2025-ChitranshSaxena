"use client";

import React, { useState, useEffect } from "react";

interface Props {
  selectedDate?: string; // ISO string
  includeTime?: boolean;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export default function DateField({
  selectedDate,
  includeTime = false,
  onChange,
  disabled = false,
}: Props) {
  const [value, setValue] = useState<string>("");

  useEffect(() => {
    if (selectedDate) {
      const formatted = includeTime
        ? selectedDate.slice(0, 16) // yyyy-MM-ddTHH:mm
        : selectedDate.slice(0, 10); // yyyy-MM-dd
      setValue(formatted);
    }
  }, [selectedDate, includeTime]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    const iso = includeTime
      ? new Date(e.target.value).toISOString()
      : new Date(`${e.target.value}T00:00:00`).toISOString();
    onChange(iso);
  };

  return (
    <div className="mt-4">
      <input
        type={includeTime ? "datetime-local" : "date"}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
      />
    </div>
  );
}
