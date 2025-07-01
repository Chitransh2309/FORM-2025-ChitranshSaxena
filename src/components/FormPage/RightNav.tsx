"use client";

import React from "react";
import Dropdown from "./RightNavDropdown";
import { Question, QuestionType } from "@/lib/interface";

type Props = {
  selectedQuestion: Question | null;
  onUpdate: (id: string, updates: Partial<Question>) => void;
};

export default function RightNav({ selectedQuestion, onUpdate }: Props) {
  const handleChangeType = (newType: QuestionType) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { type: newType });
    }
  };

  const handleUpdateConfig = (config: any) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { config });
    }
  };

  if (!selectedQuestion) {
    return (
      <div className="p-6 w-full h-full overflow-y-auto flex items-center justify-center">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <p className="text-lg font-medium">No Question Selected</p>
          <p className="text-sm mt-2">Select a question to edit its properties</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full h-full overflow-y-auto">
      <div className="mb-4">
        <p className="font-semibold text-lg dark:text-white mb-2">
          Question Settings
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          ID: {selectedQuestion.question_ID}
        </p>
      </div>

      <div className="space-y-4">
        {/* Question Type Dropdown */}
        <div>
          <label className="block text-sm font-medium mb-2 dark:text-white">
            Question Type
          </label>
          <Dropdown
            selectedQuestion={selectedQuestion}
            onChangeType={handleChangeType}
            onUpdateConfig={handleUpdateConfig}
          />
        </div>

        {/* Additional Settings */}
        <div className="mt-6">
          <h4 className="font-medium mb-3 dark:text-white">Additional Settings</h4>

          {/* Order */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Question Order
            </label>
            <input
              type="number"
              min="1"
              value={selectedQuestion.order}
              onChange={(e) => onUpdate(selectedQuestion.question_ID, { order: parseInt(e.target.value) || 1 })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#5A5959] dark:border-gray-600 dark:text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}