'use client';
import React, { useState } from 'react';
import { Section } from '../lib/interface';

interface Props {
  section: Section;
  isSelected: boolean;
  onClick: () => void;
}

export default function SectionItem({ section, isSelected, onClick }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-1">
      <div
        className={`flex justify-between items-center px-3 py-2 rounded cursor-pointer ${
          isSelected ? 'bg-green-200 text-black' : 'hover:bg-gray-200 text-gray-700'
        }`}
        onClick={onClick}
      >
        <div>
          <div className="text-sm font-medium">{section.title || 'Section Name'}</div>
          <div className="text-xs text-gray-500">
            {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
          </div>
        </div>
        <button
          className="text-gray-600 text-xs"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen((prev) => !prev);
          }}
        >
          {isOpen ? '▼' : '▶'}
        </button>
      </div>

      {isOpen && (
        <ul className="ml-4 mt-1 text-xs text-gray-600">
          {section.questions.length > 0 ? (
            section.questions.map((q) => (
              <li key={q.question_ID} className="py-1 truncate">
                • {q.questionText || 'Untitled'}
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
