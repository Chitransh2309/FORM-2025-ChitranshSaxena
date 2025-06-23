"use client";

import React, { useState } from "react";
import { Section } from "../lib/interface";

interface Props {
  section: Section;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updated: Partial<Section>) => void;
}

const SectionItem: React.FC<Props> = ({ section, onDelete, onUpdate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(section.title);

  const handleBlur = () => {
    if (title !== section.title) {
      onUpdate(section.section_ID, { title });
    }
  };

  return (
    <div className="bg-white border rounded p-2">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center">
          <button onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? "▼" : "▶"}
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleBlur}
            className="border-b outline-none"
          />
        </div>
        <button
          onClick={() => onDelete(section.section_ID)}
          className="text-red-500"
        >
          🗑
        </button>
      </div>
      {isOpen && (
        <ul className="mt-2 ml-6 text-sm text-gray-600">
          {section.questions.length > 0 ? (
            section.questions.map((q) => (
              <li key={q.question_ID}>• {q.questionText}</li>
            ))
          ) : (
            <>
              <li>No questions</li>
            </>
          )}
        </ul>
      )}
    </div>
  );
};

export default SectionItem;
