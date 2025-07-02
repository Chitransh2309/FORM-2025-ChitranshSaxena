"use client";
import React from "react";

interface DateProps {
  includeTime?: boolean;
  minDate?: string; // Should be in "YYYY-MM-DD" or "YYYY-MM-DDTHH:MM" format
  maxDate?: string;
  disabled?: boolean;
}

export default function DateField({
  includeTime = false,
  minDate,
  maxDate,
  disabled = false,
}: DateProps) {
  return (
    <div className="space-y-2 mt-4">
      <input
        type={includeTime ? "datetime-local" : "date"}
        className="border px-2 py-1 rounded dark:bg-[#5A5959] dark:text-white"
        min={minDate}
        max={maxDate}
        disabled={disabled}
      />
      <div className="text-xs text-gray-500 dark:text-gray-400">
        {minDate && <span>Earliest selectable: {minDate} </span>}
        {maxDate && <span>Latest selectable: {maxDate}</span>}
        {includeTime && <span> (Includes Time)</span>}
      </div>
    </div>
  );
}
