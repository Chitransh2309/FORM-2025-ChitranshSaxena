'use client';

import React from 'react';
import { Section, Question } from '../lib/interface';

interface Props {
  section: Section | null;
  onUpdateQuestion: (sectionId: string, questionId: string, updated: Partial<Question>) => void;
  onDeleteQuestion: (sectionId: string, questionId: string) => void;
  onAddQuestion: (sectionId: string) => void;
}

export default function SectionEditor({
  section,
  onUpdateQuestion,
  onDeleteQuestion,
  onAddQuestion
}: Props) {
  if (!section) {
    return (
      <div className="p-6 text-center text-gray-500">
        Select a section to start editing.
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col space-y-4 bg-[#FAFAFA] w-full min-h-screen">
      {/* Section Title */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">{section.title}</h2>
        <button className="bg-gray-200 hover:bg-gray-300 text-sm px-3 py-1 rounded">
          Save As Draft
        </button>
      </div>

      {/* Questions */}
      {section.questions.map((q) => (
        <div
          key={q.question_ID}
          className="bg-white border rounded-2xl shadow-sm p-5 space-y-3"
        >
          {/* Top row: label and required toggle */}
          <div className="flex justify-between">
            <label className="font-medium text-sm">
              {q.questionText.trim() === '' ? 'Ques Label' : q.questionText}{' '}
              {q.isRequired && <span className="text-red-500">*</span>}
            </label>
            <div className="flex gap-4 items-center">
              <label className="text-sm text-gray-600 flex items-center gap-2">
                required
                <input
                  type="checkbox"
                  className="accent-green-600"
                  checked={q.isRequired}
                  onChange={(e) =>
                    onUpdateQuestion(section.section_ID, q.question_ID, {
                      isRequired: e.target.checked
                    })
                  }
                />
              </label>
              <button
                onClick={() => onDeleteQuestion(section.section_ID, q.question_ID)}
                className="text-gray-500 hover:text-red-500 text-lg"
              >
                🗑
              </button>
            </div>
          </div>

          {/* Question Text Input */}
          <input
            type="text"
            value={q.questionText}
            placeholder="Write your question here"
            onChange={(e) =>
              onUpdateQuestion(section.section_ID, q.question_ID, {
                questionText: e.target.value
              })
            }
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          {/* Type and Config */}
          <div className="text-sm text-gray-600">
            <div>answer type: {q.type.toLowerCase()}</div>
            {q.config?.validations?.length > 0 && (
              <div className="text-xs text-gray-500">
                {q.config.validations
                  .map((v) => {
                    if (v.name === 'charlimit' && v.params) {
                      const min = v.params.find((p) => p.name === 'min')?.value ?? 0;
                      const max = v.params.find((p) => p.name === 'max')?.value ?? 0;
                      return `minimum ${min} characters, maximum ${max} characters`;
                    }
                    return '';
                  })
                  .filter(Boolean)
                  .join(' | ')}
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Add Question */}
      <div>
        <button
          onClick={() => onAddQuestion(section.section_ID)}
          className="w-full py-2 border-2 border-dashed border-gray-400 rounded-xl text-gray-600 hover:bg-gray-100 transition"
        >
          + Add Question
        </button>
      </div>

      {/* Add Section (if needed at bottom) */}
      {/* 
      <button
        className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 mt-4"
      >
        + Add New Section
      </button>
      */}
    </div>
  );
}
