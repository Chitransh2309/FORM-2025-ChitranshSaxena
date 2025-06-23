"use client";
import React from "react";
import { Section } from "../lib/interface";
import SectionItem from "./SectionItem";

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
}: Props) {
  return (
    <div className="flex flex-col bg-[#fefefe] text-black w-1/5 h-screen p-4 box-border font-[Outfit]">
      <div className="text-sm">
        <h2 className="mb-2">SECTIONS</h2>
        <div className="border-t-2 border-black mb-2"></div>

        <div className="h-80 overflow-y-auto scrollbar-hidden">
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
            className="mt-4 w-full py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded"
          >
            + Add New Section
          </button>
        </div>
      </div>

      <div className="text-sm my-5">
        <div>
          <h2 className="mb-2">ENDINGS</h2>
          <div className="border-t-2 border-black mb-2"></div>
          <div className="h-20 overflow-y-auto scrollbar-hidden">
            <div className="py-2 rounded text-black bg-green-200 text-sm pl-2">
              Thank You Page
            </div>
          </div>
        </div>
        <footer className="fixed-bottom text-xs text-black mt-5">
          UserName
        </footer>
      </div>
    </div>
  );
}
