'use client';
import React from 'react';
import { Section } from '../lib/interface';
import SectionItem from './SectionItem';

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
  onAddSection
}: Props) {
  return (
    <div className="w-64 min-h-screen bg-[#F7F7F7] border-r flex flex-col justify-between">
      <div className="p-4">
        <h2 className="text-xs font-semibold text-gray-600 mb-2">SECTIONS</h2>

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

      <div className="p-4 border-t text-sm space-y-2">
        <div>
          <h2 className="text-xs font-semibold text-gray-600">ENDINGS</h2>
          <div className="mt-1 px-3 py-2 rounded bg-green-200 text-sm">Thank You Page</div>
        </div>
        <div className="pt-2 border-t text-gray-500">UserName</div>
      </div>
    </div>
  );
}
