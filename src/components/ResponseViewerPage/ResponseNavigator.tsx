"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Props {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  userName: string;
  submittedAt: Date;
  onUserChange: (index: number) => void;
}

export default function ResponseNavigator({
  currentIndex,
  total,
  onPrev,
  onNext,
  userName,
  submittedAt,
  onUserChange,
}: Props) {
  const [inputValue, setInputValue] = useState(String(currentIndex + 1));

  useEffect(() => {
    setInputValue(String(currentIndex + 1));
  }, [currentIndex]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const commitChange = () => {
    const parsed = parseInt(inputValue, 10);
    if (!isNaN(parsed)) {
      const clamped = Math.max(1, Math.min(parsed, total));
      onUserChange(clamped - 1); // update parent state
    } else {
      setInputValue(String(currentIndex + 1)); // reset if invalid
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      commitChange();
    }
  };

  const handleBlur = () => {
    commitChange();
  };

  return (
    <div className="flex justify-left items-center gap-4 mb-6 flex-wrap px-4">
      <div className="flex items-center gap-2">
        <button onClick={onPrev} disabled={currentIndex === 0} className="p-1">
          <ChevronLeft />
        </button>

        <div className="flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="w-12 text-center border rounded px-1 py-0.5 text-sm appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            inputMode="numeric"
            pattern="[0-9]*"
          />
          <span>of {total}</span>
        </div>

        <button
          onClick={onNext}
          disabled={currentIndex === total - 1}
          className="p-1"
        >
          <ChevronRight />
        </button>
      </div>

      <div className="ml-auto text-sm text-gray-600 dark:text-gray-300">
        Submitted by <strong>{userName}</strong> at{" "}
        {submittedAt
          ? new Date(submittedAt).toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
              timeZone: "UTC",
            })
          : "N/A"}
      </div>
    </div>
  );
}
