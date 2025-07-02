"use client";
import React from "react";

interface Props {
  value?: string;
  onChange: (val: string) => void;
  disabled?: boolean;
}

export default function EmailField({ value = "", onChange, disabled = false }: Props) {
  return (
    <input
      type="email"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder="example@email.com"
      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
    />
  );
}
