"use client";

import React, { useState } from "react";
import { Section } from "../lib/interface";
import { Trash2, ChevronRight, ChevronDown } from "lucide-react";

interface Props {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
  onDeleteSection?: (sectionId: string) => void;
}

export default function SectionItem({
  section,
  isSelected,
  onClick,
  onDeleteSection,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1 w-full">
      <div
        className={`flex justify-between items-start sm:items-center px-3 py-3 rounded-lg cursor-pointer w-full transition-all
          ${isSelected ? "bg-[#8cc7aa] dark:bg-[#494949] text-black" : "hover:bg-gray-100 dark:hover:bg-[#6d6d6d] text-gray-700"} dark:text-white`}
        onClick={onClick}
      >
        {/* Section Info */}
        <div className="flex-1 pr-2">
          <div className="text-base sm:text-[15px] font-semibold truncate dark:text-white">
            {section.title || "Section Name"}
          </div>
          <div className="text-xs text-gray-500 dark:text-white">
            {section.questions.length} question{section.questions.length !== 1 ? "s" : ""}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2 ml-2 mt-[2px]">
          {onDeleteSection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSection(section.section_ID);
              }}
              className="text-red-500 hover:text-red-700 p-1"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            className="text-gray-600 p-1 dark:text-white"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
            title="Toggle Questions"
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Expandable Question List */}
      {isOpen && (
        <ul className="ml-4 mt-1 text-sm text-gray-600 space-y-1 dark:text-white">
          {section.questions.length > 0 ? (
            section.questions.map((q) => (
              <li
                key={`sec-${section.section_ID}-q-${q.question_ID}`}
                className="py-1 truncate text-xs sm:text-sm"
              >
                • {q.questionText || "Untitled"}
              </li>
            ))
          ) : (
            <li className="italic text-gray-400 py-1 dark:text-white">No questions</li>
          )}
        </ul>
      )}
    </div>
  );
}
