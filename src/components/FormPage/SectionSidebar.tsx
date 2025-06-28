"use client";
import React, { useState } from "react";
import { Section } from "../lib/interface";
import SectionItem from "./SectionItem";
import { CircleUser, Menu } from "lucide-react";

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
  const [openMobile, setOpenMobile] = useState(false);

  const SidebarContent = (
    <>
      {/* Sections */}
      <div className="flex-1">
        <h2 className="mb-2 mt-8 text-base font-semibold">SECTIONS</h2>
        <div className="border-t-2 border-black mb-4"></div>

<<<<<<< HEAD
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
=======
        <div className="max-h-[300px] overflow-y-auto text-sm pr-1 scrollbar-thin scrollbar-thumb-gray-300">
          {sections.map((section, index) => (
            <SectionItem
              key={`${section.section_ID}-${index}`}
>>>>>>> 1da22d4 (Added responsiveness for form builder)
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

      {/* Endings */}
      <div className="mt-6">
        <h2 className="mb-2 text-base font-semibold">ENDINGS</h2>
        <div className="border-t-2 border-black mb-2"></div>
        <div className="py-2 rounded text-black bg-[#8cc7aa] text-sm pl-2">
          Thank You Page
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6">
        <div className="flex items-center gap-2">
          <CircleUser className="w-5 h-5" />
          <span className="text-sm">UserName</span>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:flex flex-col bg-[#FEFEFE] text-black w-[260px] h-[90vh] p-4 box-border border-r border-gray-300 font-[Outfit]">
        {SidebarContent}
      </div>

      {/* Mobile Toggle Button */}
      <div className="flex md:hidden px-4 py-2 justify-between items-center bg-white border-b">
        <button onClick={() => setOpenMobile(true)}>
          <Menu className="w-6 h-6 text-gray-800" />
        </button>
        <div className="text-sm font-semibold">Sections</div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex md:hidden">
          <div className="w-4/5 max-w-xs bg-[#FEFEFE] text-black h-full p-4 overflow-auto">
            <button
              className="text-sm text-gray-600 mb-4 underline"
              onClick={() => setOpenMobile(false)}
            >
              Close
            </button>
            {SidebarContent}
          </div>
          <div className="flex-1" onClick={() => setOpenMobile(false)} />
        </div>
      )}
    </>
  );
}
