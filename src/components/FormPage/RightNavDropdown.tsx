"use client";

import React, { useState } from "react";

const questionTypes = [
  "Text",
  "MCQ",
  "Dropdown",
  "Date",
  "Linear Scale",
  "File Upload",
  "Email",
  "Url",
];

export default function QuestionTypeDropdown() {
  const [selectedType, setSelectedType] = useState("Text");
  const [isOpen, setIsOpen] = useState(false);
  const [minChar, setMinChar] = useState(15);
  const [maxChar, setMaxChar] = useState(30);

  const typeSelector = () => {
    switch (selectedType) {
      case "Text":
        return (
          <div className="bg-white p-4 text-black space-y-4 text-sm">
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <label className="flex items-center gap-2">
                <span>Min char:</span>
                <input
                  type="number"
                  value={minChar}
                  onChange={(e) => setMinChar(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded bg-[#8CC7AA] text-center outline-none"
                />
              </label>

              <label className="flex items-center gap-2">
                <span>Max char:</span>
                <input
                  type="number"
                  value={maxChar}
                  onChange={(e) => setMaxChar(Number(e.target.value))}
                  className="w-16 px-2 py-1 rounded bg-[#8CC7AA] text-center outline-none"
                />
              </label>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span>Photo/File/Video</span>
              <button className="w-6 h-6 border border-black rounded-full flex items-center justify-center">
                {/* Add icon if needed */}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-4 text-black text-sm">
            <p className="italic">
              Config UI for <strong>{selectedType}</strong> coming soon.
            </p>
          </div>
        );
    }
  };

  return (
<<<<<<< HEAD
    <div className="w-65 relative rounded-xl bg-white">
      {/* Dropdown header */}
=======
    <div className="w-full max-w-sm sm:max-w-xs mx-auto relative rounded-xl bg-white shadow">
      {/* Dropdown Header */}
>>>>>>> 1da22d4 (Added responsiveness for form builder)
      <div
        className="bg-[#8CC7AA] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-black font-medium text-base">
          {selectedType}
        </span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
<<<<<<< HEAD
        <div className="absolute z-10 bg-[#8CC7AA] text-black rounded-b-xl shadow-lg">
          <hr className="border-gray-400" />
          <ul className="py-2 px-4 space-y-2">
=======
        <div className="absolute z-10 w-full bg-[#8CC7AA] text-black rounded-b-xl shadow-lg mt-1">
          <ul className="py-2 px-4 space-y-2 max-h-[200px] overflow-y-auto text-sm">
>>>>>>> 1da22d4 (Added responsiveness for form builder)
            {questionTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition ${
                  selectedType === type ? "font-semibold" : ""
                } hover:bg-[#6fb899] px-2 py-1 rounded`}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Config */}
      <div className="mt-5">{typeSelector()}</div>
    </div>
  );
}
