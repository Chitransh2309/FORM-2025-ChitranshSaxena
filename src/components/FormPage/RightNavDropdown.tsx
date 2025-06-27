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

  // Function to render based on type
  const typeSelector = () => {
    switch (selectedType) {
      case "Text":
        return (
          <div className="bg-white p-4 text-black space-y-4">
            {/* Character Limits */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-1">
                <span>min char:</span>
                <input
                  type="number"
                  value={minChar}
                  onChange={(e) => setMinChar(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 rounded bg-[#8CC7AA] text-center outline-none"
                />
              </label>

              <label className="flex items-center space-x-1">
                <span>max char:</span>
                <input
                  type="number"
                  value={maxChar}
                  onChange={(e) => setMaxChar(Number(e.target.value))}
                  className="w-12 px-1 py-0.5 rounded bg-[#8CC7AA] text-center outline-none"
                />
              </label>
            </div>

            {/* Media section */}
            <div className="flex justify-between items-center text-sm">
              <span>Photo/File/Video</span>
              <button className="w-6 h-6 border border-black rounded-full flex items-center justify-center">
                {/*Image*/}
              </button>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white p-4 text-black">
            <p className="text-sm italic">
              Config UI for <strong>{selectedType}</strong> coming soon.
            </p>
          </div>
        );
    }
  };

  return (
    <div className="w-65 relative rounded-xl bg-white">
      {/* Dropdown header */}
      <div
        className="bg-[#8CC7AA] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-black font-medium">{selectedType}</span>
        {/* image */}
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-10 bg-[#8CC7AA] text-black rounded-b-xl shadow-lg">
          <hr className="border-gray-400" />
          <ul className="py-2 px-4 space-y-2">
            {questionTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition ${
                  selectedType === type ? "font-semibold" : "font-normal"
                }`}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-5">
        {/* Custom Config */}
        {typeSelector()}
      </div>
    </div>
  );
}
