"use client";

import React from "react";
import { Plus } from "lucide-react";

export default function AddQuestion({ onClick }: { onClick: () => void }) {
  return (
    <div className="flex justify-center mb-6">
      <button
        onClick={onClick}
        className="dark:text-white w-full max-w-[360px] px-4 py-3 flex items-center justify-center gap-2 text-sm font-medium border-2 border-dashed border-gray-400 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200 active:scale-[0.98]"
        aria-label="Add Question"
      >
        <Plus size={18} />
        Add Question
      </button>
    </div>
  );
}
