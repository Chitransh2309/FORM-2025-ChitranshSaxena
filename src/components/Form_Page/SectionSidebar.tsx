"use client";
import React from "react";
import { Section } from "../lib/interface";
import SectionItem from "./SectionItem";
import { CircleUser } from "lucide-react";

interface Props {
  sections: Section[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string) => void;
  onAddSection: () => void;
}

export default function LeftSidebar({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  onAddSection,
  onDeleteSection,
}: SectionSidebarProps) {
  // Debug logging - remove in production
  console.log("Sections:", sections);
  console.log(
    "Section IDs:",
    sections.map((s) => s.section_ID)
  );

  // Check for duplicates and warn
  const duplicates = sections.filter(
    (s, i, arr) =>
      arr.findIndex((item) => item.section_ID === s.section_ID) !== i
  );

  if (duplicates.length > 0) {
    console.warn(
      "Duplicate section IDs found:",
      duplicates.map((d) => d.section_ID)
    );
  }

  return (
    <div className="flex flex-col bg-[#FEFEFE] text-black w-1/5 h-[90vh] p-4 box-border border-2 border-gray-300 font-[Outfit]">
      <div>
        <h2 className="mb-2 mt-8 text-base">SECTIONS</h2>
        <div className="border-t-2 border-black mb-6"></div>

        <div className="h-80 overflow-y-auto scrollbar-hidden text-sm">
          {sections.map((section) => (
            <SectionItem
              key={section.section_ID}
              section={section}
              isSelected={section.section_ID === selectedSectionId}
              onClick={() => setSelectedSectionId(section.section_ID)}
            />
          ))}

          <button
            onClick={onAddSection}
            className="mt-4 w-full py-3 text-base text-gray-600 bg-gray-200 hover:bg-gray-300 rounded"
          >
            + Add New Section
          </button>
        </div>
      </div>

      <div className="my-5">
        <div>
          <h2 className="mb-2 text-base">ENDINGS</h2>
          <div className="border-t-2 border-black mb-6"></div>
          <div className="h-20 overflow-y-auto scrollbar-hidden">
            <div className="py-3 rounded text-black bg-[#8cc7aa] text-base pl-2">
              Thank You Page
            </div>
          </div>
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center gap-2">
          <span>
            <CircleUser className="w-5 h-5" />
          </span>
          <span>UserName</span>
        </div>
      </div>
    </div>
  );
}
