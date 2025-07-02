"use client";
import React, { useState, useEffect } from "react";
import { Question, QuestionType, fieldtypes } from "@/lib/interface";

interface RightNavProps {
  selectedQuestion: Question | null;
  onQuestionUpdate: (questionId: string, updates: Partial<Question>) => void;
  onSaveToDatabase: (question: Question) => Promise<void>; // Function to save to DB
}

export default function RightNav({ 
  selectedQuestion, 
  onQuestionUpdate, 
  onSaveToDatabase 
}: RightNavProps) {
  const [placeholder, setPlaceholder] = useState("");
  const [multiline, setMultiline] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load current parameters when question changes
  useEffect(() => {
    if (selectedQuestion && selectedQuestion.type === QuestionType.TEXT) {
      const config = selectedQuestion.config;
      const params = config?.params || [];
      
      const placeholderParam = params.find(p => p.name === "placeholder");
      const multilineParam = params.find(p => p.name === "multiline");
      
      setPlaceholder(placeholderParam?.value as string || "Your answer");
      setMultiline(Boolean(multilineParam?.value) || false);
    }
  }, [selectedQuestion]);

  // Update question config and save to database
  const updateTextConfig = async (newPlaceholder?: string, newMultiline?: boolean) => {
    if (!selectedQuestion) return;

    const fieldType = fieldtypes.find(f => f.name === "text");
    if (!fieldType) return;

    const updatedParams = fieldType.params.map(param => {
      if (param.name === "placeholder") {
        return { ...param, value: newPlaceholder ?? placeholder };
      }
      if (param.name === "multiline") {
        return { ...param, value: newMultiline ?? multiline };
      }
      return param;
    });

    const newConfig = {
      ...fieldType,
      params: updatedParams,
    };

    const updatedQuestion = {
      ...selectedQuestion,
      config: newConfig
    };

    // Update in local state
    onQuestionUpdate(selectedQuestion.question_ID, { config: newConfig });

    // Save to database
    try {
      setIsSaving(true);
      await onSaveToDatabase(updatedQuestion);
    } catch (error) {
      console.error("Failed to save question to database:", error);
      // Handle error (show toast, revert changes, etc.)
    } finally {
      setIsSaving(false);
    }
  };

  const handlePlaceholderChange = (value: string) => {
    setPlaceholder(value);
    updateTextConfig(value, undefined);
  };

  const handleMultilineChange = (value: boolean) => {
    setMultiline(value);
    updateTextConfig(undefined, value);
  };

  // Don't render if no question is selected or if it's not a TEXT question
  if (!selectedQuestion || selectedQuestion.type !== QuestionType.TEXT) {
    return (
      <div className="w-80 bg-white dark:bg-[#5A5959] border-l border-gray-200 dark:border-gray-600 p-6">
        <div className="text-gray-500 dark:text-gray-400">
          Select a text question to edit its properties
        </div>
      </div>
    );
  }

  return (
    <div className="w-80 bg-white dark:bg-[#5A5959] border-l border-gray-200 dark:border-gray-600 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Text Field Settings
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Configure your text input field
          </p>
        </div>

        {/* Placeholder Setting */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Placeholder Text
          </label>
          <input
            type="text"
            value={placeholder}
            onChange={(e) => handlePlaceholderChange(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#494949] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            placeholder="Enter placeholder text..."
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            This text will appear as a hint in the input field
          </p>
        </div>

        {/* Multiline Setting */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Multiline Text Area
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={multiline}
                onChange={(e) => handleMultilineChange(e.target.checked)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Enable for longer text responses (textarea instead of input)
          </p>
        </div>

        {/* Save Status */}
        {isSaving && (
          <div className="flex items-center space-x-2 text-sm text-blue-600 dark:text-blue-400">
            <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span>Saving changes...</span>
          </div>
        )}

        {/* Preview Section */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Preview
          </label>
          <div className="p-3 border border-gray-200 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-[#494949]">
            {multiline ? (
              <textarea
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md resize-none min-h-[80px] focus:outline-none dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                readOnly
              />
            ) : (
              <input
                type="text"
                placeholder={placeholder}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                readOnly
              />
            )}
          </div>
        </div>

        {/* Additional Settings */}
        <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
            Question Details
          </h4>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div>Type: {selectedQuestion.type}</div>
            <div>Required: {selectedQuestion.isRequired ? "Yes" : "No"}</div>
            <div>Order: {selectedQuestion.order}</div>
          </div>
        </div>
      </div>
    </div>
  );
}