"use client";

import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  userName: string;
  submittedAt: Date;
  onUserChange: (index: number) => void;
  onViewModeChange: (mode: "Individual response" | "Grouped response") => void;
}

export default function HeaderSection({
  currentIndex,
  total,
  onPrev,
  onNext,
  userName,
  submittedAt,
  onUserChange,
  onViewModeChange,
}: HeaderProps) {
  const [activeTab, setActiveTab] = useState<"Individual" | "Analytics">("Individual");
  const [viewMode, setViewMode] = useState<"Individual response" | "Grouped response">("Individual response");
  const [showDropdown, setShowDropdown] = useState(false);

  return (
    <>
      {/* Toggle Switch */}
      <div className="flex justify-end pt-5 pr-8">
        <ToggleSwitch />
      </div>

      {/* Tab Switch */}
      <div className="flex justify-center mb-6">
        <div className="flex bg-[#e4f2ea] rounded-md p-1 space-x-1">
          {["Individual", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "Individual" | "Analytics")}
              className={`px-4 py-2 rounded font-semibold text-sm ${
                activeTab === tab
                  ? "bg-[#1C3C34] text-white"
                  : "text-[#1C3C34]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Form Info */}
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-xl font-semibold">Responses: {total}</h2>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Submitted by <strong>{userName ?? "Anonymous"}</strong> at{" "}
          {submittedAt ? new Date(submittedAt).toLocaleString() : "N/A"}
        </div>
      </div>

      {/* Navigation & View Dropdown */}
      <div className="flex justify-center items-center gap-4 mb-6 flex-wrap px-4">
        <div className="flex items-center gap-2">
          <button onClick={onPrev} disabled={currentIndex === 0} className="p-1">
            <ChevronLeft />
          </button>

          <div className="flex items-center gap-2">
            <span>User</span>
            <input
              type="number"
              min={1}
              max={total}
              value={currentIndex + 1}
              onChange={(e) => {
                const val = Math.max(1, Math.min(total, Number(e.target.value)));
                onUserChange(val - 1);
              }}
              className="w-12 text-center border rounded px-1 py-0.5 text-sm"
            />
            <span>of {total}</span>
          </div>

          <button onClick={onNext} disabled={currentIndex === total - 1} className="p-1">
            <ChevronRight />
          </button>
        </div>

        {/* View Mode Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-1 border border-gray-300 px-3 py-1 rounded-md text-sm bg-white shadow-sm dark:bg-[#444] dark:border-gray-600 dark:text-white"
          >
            {viewMode} <ChevronDown size={16} />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-white dark:bg-[#333] shadow-lg rounded-md border dark:border-gray-600 z-10">
              {["Individual response", "Grouped response"].map((mode) => (
                <button
                  key={mode}
                  onClick={() => {
                    setViewMode(mode as typeof viewMode);
                    onViewModeChange(mode as typeof viewMode);
                    setShowDropdown(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#444] ${
                    viewMode === mode ? "bg-[#1C3C34] text-white font-semibold" : ""
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
