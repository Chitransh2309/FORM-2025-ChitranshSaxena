"use client";

import React, { useEffect, useState } from "react";
import QuestionTypeDropdown from "./RightNavDropdown";
import { Question, QuestionType } from "@/lib/interface";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import FAQs from "../NewUserPage/FAQs";

type Props = {
  selectedQuestion: Question | null;
  onUpdate: (id: string, updates: Partial<Question>) => void;
};

export default function RightNav({ selectedQuestion, onUpdate }: Props) {
  const [currentQuestionId, setCurrentQuestionId] = useState<string | null>(
    null
  );
  const [showFaq, setShowFaq] = useState(false);
  useEffect(() => {
    if (selectedQuestion?.question_ID !== currentQuestionId) {
      setCurrentQuestionId(selectedQuestion?.question_ID || null);
      // Any additional state reset logic can go here
    }
  }, [selectedQuestion?.question_ID, currentQuestionId]);

  // When type changes, config should be reset (not merged)
  const handleChangeType = (newType: QuestionType) => {
    if (selectedQuestion) {
      // Clear config when type changes
      onUpdate(selectedQuestion.question_ID, {
        type: newType,
        config: undefined,
      });
    }
  };

  // When config changes, replace it
  const handleUpdateConfig = (config: any) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { config });
    }
  };

  const handleOrderChange = (newOrder: number) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { order: newOrder });
    }
  };

  const handleQuestionTextChange = (questionText: string) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { questionText });
    }
  };

  const handleRequiredChange = (isRequired: boolean) => {
    if (selectedQuestion) {
      onUpdate(selectedQuestion.question_ID, { isRequired });
    }
  };

  // Get display type for the UI
  const getDisplayType = () => {
    if (!selectedQuestion) return "Unknown";
    switch (selectedQuestion.type) {
      case QuestionType.MCQ:
        return "Multiple Choice";
      case QuestionType.TEXT:
        return "Text Input";
      case QuestionType.DROPDOWN:
        return "Dropdown";
      case QuestionType.DATE:
        return "Date";
      case QuestionType.LINEARSCALE:
        return "Linear Scale";
      case QuestionType.FILE_UPLOAD:
        return "File Upload";
      case QuestionType.EMAIL:
        return "Email";
      case QuestionType.URL:
        return "URL";
      default:
        return "Multiple Choice";
    }
  };

  if (!selectedQuestion) {
    return (
      <div className="relative p-4 md:p-6 w-full h-full overflow-y-auto flex items-center justify-center bg-gray-50 dark:bg-[#363535]">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <p className="text-lg font-medium">No Question Selected</p>
          <p className="text-sm mt-2">
            Select a question to edit its properties
          </p>
        </div>

        {/* Bottom Right FAQ Icon */}
        <div className="fixed bottom-6 right-6 z-40">
          <button
            className="flex items-center justify-center w-12 h-12 text-black rounded-full dark:text-white hover:shadow-xl transition-shadow"
            onClick={() => setShowFaq(true)}
          >
            <HiOutlineQuestionMarkCircle className="w-6 h-6" />
          </button>
        </div>

        {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
      </div>
    );
  }



  return (
    <div className="relative p-4 md:p-6 w-full h-full overflow-y-auto bg-gray-50 dark:bg-[#363535]">
      {/* Header */}
      <div className="mb-4 md:mb-6">
        <h2 className="font-semibold text-lg md:text-xl dark:text-white mb-2">
          Question Settings
        </h2>
        <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <p>
            ID:{" "}
            <span className="font-mono text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
              {selectedQuestion.question_ID}
            </span>
          </p>
        </div>
      </div>

      <div className=" space-y-4 md:space-y-6 pb-20 md:pb-24">
        {" "}
        {/* Responsive padding bottom */}
        {/* Question Type Configuration */}
        <div className="bg-white dark:bg-[#494949] rounded-lg p-3 md:p-4 shadow-sm">
          <h3 className="font-medium mb-3 md:mb-4 dark:text-white text-sm uppercase tracking-wide text-gray-700">
            Question Type & Configuration
          </h3>
          <QuestionTypeDropdown
            key={selectedQuestion.question_ID} // Force remount on question change
            selectedQuestion={selectedQuestion}
            onChangeType={handleChangeType}
            onUpdateConfig={handleUpdateConfig}
          />
        </div>
        {/* Advanced Settings */}
        <div className="bg-white dark:bg-[#494949] rounded-lg p-3 md:p-4 shadow-sm">
          <h3 className="font-medium mb-3 md:mb-4 dark:text-white text-sm uppercase tracking-wide text-gray-700">
            Advanced Settings
          </h3>
          {/* Question Order */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 dark:text-white">
              Question Order
            </label>
            <input
              type="number"
              min="1"
              value={selectedQuestion.order}
              onChange={(e) => handleOrderChange(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-[#5A5959] dark:border-gray-600 dark:text-white"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Determines the order in which questions appear
            </p>
          </div>
        </div>
        {/* Question Summary */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 md:p-4 border border-blue-200 dark:border-blue-800">
          <h3 className="font-medium mb-2 dark:text-white text-blue-800">
            Question Summary
          </h3>
          <div className="text-sm space-y-1 text-blue-700 dark:text-blue-300">
            <p>
              <span className="font-medium">Type:</span> {getDisplayType()}
            </p>
            <p>
              <span className="font-medium">Required:</span>{" "}
              {selectedQuestion.isRequired ? "Yes" : "No"}
            </p>
            <p>
              <span className="font-medium">Order:</span>{" "}
              {selectedQuestion.order}
            </p>
            {selectedQuestion.config && (
              <p>
                <span className="font-medium">Has Configuration:</span> Yes
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Right FAQ Icon - Fixed Position */}
      <div className="fixed bottom-4 right-4 md:absolute md:bottom-6 md:right-6 z-50">
        <button
          onClick={() => setShowFaq(true)}
          className="p-3 md:p-2 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-200 dark:border-gray-600"
        >
          <HiOutlineQuestionMarkCircle
            size={24}
            className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white"
          />
        </button>
      </div>

      {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}
