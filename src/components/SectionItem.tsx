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
    <div className="mb-1">
      <div
        className={`flex justify-between items-center px-3 py-3 rounded cursor-pointer ${
          isSelected
            ? "bg-[#8cc7aa] text-black"
            : "hover:bg-gray-200 text-gray-700"
        }`}
        onClick={onClick}
      >
        <div>
          <div className="text-base font-medium">
            {section.title || "Section Name"}
          </div>
          <div className="text-xs text-gray-500">
            {section.questions.length} question
            {section.questions.length !== 1 ? "s" : ""}
          </div>
        </div>

        <div className="flex gap-2 items-center">
          {onDeleteSection && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSection(section.section_ID);
              }}
              className="text-red-500 hover:text-red-700 ml-1"
              title="Delete section"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}

          <button
            className="text-gray-600 text-xs"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            {isOpen ? (
              <ChevronDown className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <ul className="ml-4 mt-1 text-xs text-gray-600">
          {section.questions.length > 0 ? (
            section.questions.map((q) => (
              <li key={`sec-${section.section_ID}-q-${q.question_ID}`} className="py-1 truncate">
                • {q.questionText || "Untitled"}
              </li>
            ))
          ) : (
            <li className="italic text-gray-400 py-1">No questions</li>
          )}
        </ul>
      )}
    </div>
  );
}