"use client";

import React, { useState } from "react";
import { Section, Question } from "../lib/interface";
import SectionItem from "./SectionItem";

export default function SectionSidebar() {
  const [sections, setSections] = useState<Section[]>([]);

  const addSection = () => {
    const newSection: Section = {
      section_ID: Date.now().toString(),
      title: "Untitled Section",
      description: "",
      questions: [],
    };

    setSections([...sections, newSection]);
  };

  const updateSection = (id: string, updated: Partial<Section>) => {
    setSections((prev) =>
      prev.map((section) =>
        section.section_ID === id ? { ...section, ...updated } : section
      )
    );
  };

  const deleteSection = (id: string) => {
    setSections((prev) => prev.filter((section) => section.section_ID !== id));
  };

  return (
    <aside className="w-64 border-r h-full p-4 bg-gray-50">
      <h3 className="text-lg font-semibold mb-4">Sections</h3>
      <div className="space-y-2">
        {sections.map((section) => (
          <SectionItem
            key={section.section_ID}
            section={section}
            onDelete={deleteSection}
            onUpdate={updateSection}
          />
        ))}
      </div>
      <button
        onClick={addSection}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
      >
        + Add Section
      </button>
    </aside>
  );
}
