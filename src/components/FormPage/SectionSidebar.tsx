"use client";
import React, { useState } from "react";
import { Section } from "@/lib/interface";
import SectionItem from "./SectionItem";
import { Menu } from "lucide-react";

interface SectionSidebarProps {
  sections: Section[];
  selectedSectionId: string | null;
  setSelectedSectionId: (id: string) => void;
  onAddSection: () => void;
  onDeleteSection: (sectionId: string) => void;
}

export default function SectionSidebar({
  sections,
  selectedSectionId,
  setSelectedSectionId,
  onAddSection,
  onDeleteSection,
}: SectionSidebarProps) {
  const [openMobile, setOpenMobile] = useState(false);

  const SidebarContent = (
    <div className="flex flex-col h-[calc(100%-80px)] overflow-y-auto dark:bg-[#363535] dark:text-white">
      {/* Sections */}
      <div className="flex-1 flex flex-col h-full ">
        <h2 className="mb-2 mt-5 text-base font-semibold px-4">SECTIONS</h2>
        <div className="border-t-2 border-black mb-4 dark:border-white mx-4"></div>

        <div className="flex-1 pr-1 text-sm overflow-y-auto h-full scrollbar-thin scrollbar-thumb-gray-300 px-4">
          {sections.map((section, index) => (
            <SectionItem
              key={`${section.section_ID}-${index}`}
              section={section}
              isSelected={section.section_ID === selectedSectionId}
              onClick={() => setSelectedSectionId(section.section_ID)}
              onDeleteSection={onDeleteSection}
            />
          ))}

          <button
            onClick={onAddSection}
            className="mt-4 w-full py-2 text-sm text-gray-700 bg-gray-200 hover:bg-gray-300 rounded dark:bg-[#494949] dark:text-white dark:hover:bg-[#6d6d6d]"
          >
            + Add New Section
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full w-full overflow-y-auto">
      {/* Desktop Sidebar */}
      <div className="hidden overflow-y-auto h-full lg:flex flex-col w-full box-border font-[Outfit] bg-[#FEFEFE] text-black overflow-hidden dark:bg-[#363535] dark:text-white">
        {SidebarContent}
      </div>

      {/* Mobile Toggle Button */}
      <div
        className="flex lg:hidden h-full px-4 py-2 justify-between items-center max-w-[150px] z-50 bg-white dark:bg-[#353434] dark:text-white"
        onClick={() => setOpenMobile(true)}
      >
        <button>
          <Menu className="w-6 h-6 text-gray-800 dark:text-white" />
        </button>
        <div className="text-sm font-semibold">Sections</div>
      </div>

      {/* Mobile Slide-over Drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 bg-black/50 flex lg:hidden">
          <div className="w-4/5 max-w-xs h-full p-4 overflow-y-auto bg-[#FEFEFE] text-black dark:bg-[#363535] dark:text-white">
            <button
              className="text-sm text-gray-600 mb-4 underline dark:text-white"
              onClick={() => setOpenMobile(false)}
            >
              Close
            </button>
            {SidebarContent}
          </div>
          <div className="flex-1" onClick={() => setOpenMobile(false)} />
        </div>
      )}
    </div>
  );
}