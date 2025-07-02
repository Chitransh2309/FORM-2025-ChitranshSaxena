"use client";
import React from "react";

export default function Url({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="space-y-2 mt-4">
      <input
        type="url"
        placeholder="https://example.com"
        className="border px-2 py-1 rounded w-full dark:bg-[#5A5959] dark:text-white"
        disabled={disabled}
      />
    </div>
  );
}
