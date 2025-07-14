"use client";

import React, { useState } from "react";

interface TextProps {
  placeholder?: string;
  charlimit?: { min?: number; max?: number };
  keywordChecker?: { contains?: string[]; doesnotContain?: string[] };
  disabled?: boolean;
}

export default function Text({ 
  placeholder = "Enter your answer...", 
  charlimit,
  keywordChecker,
  disabled = false 
}: TextProps) {
  const [inputValue, setInputValue] = useState("");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate input based on constraints
  const validateInput = (value: string) => {
    const errors: string[] = [];

    // Character limit validation
    if (charlimit) {
      if (charlimit.min && value.length < charlimit.min) {
        errors.push(`Minimum ${charlimit.min} characters required`);
      }
      if (charlimit.max && value.length > charlimit.max) {
        errors.push(`Maximum ${charlimit.max} characters allowed`);
      }
    }

    // Keyword validation
    if (keywordChecker && value.trim()) {
      const lowerValue = value.toLowerCase();
      
      // Check required keywords (contains)
      if (keywordChecker.contains && keywordChecker.contains.length > 0) {
        const hasRequiredKeywords = keywordChecker.contains.some(keyword => 
          lowerValue.includes(keyword.toLowerCase())
        );
        if (!hasRequiredKeywords) {
          errors.push(`Must contain one of: ${keywordChecker.contains.join(", ")}`);
        }
      }

      // Check forbidden keywords (doesnotContain)
      if (keywordChecker.doesnotContain && keywordChecker.doesnotContain.length > 0) {
        const hasForbiddenKeywords = keywordChecker.doesnotContain.some(keyword => 
          lowerValue.includes(keyword.toLowerCase())
        );
        if (hasForbiddenKeywords) {
          const foundKeywords = keywordChecker.doesnotContain.filter(keyword =>
            lowerValue.includes(keyword.toLowerCase())
          );
          errors.push(`Cannot contain: ${foundKeywords.join(", ")}`);
        }
      }
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    
    // Enforce max character limit by preventing further input
    if (charlimit?.max && value.length > charlimit.max) {
      return;
    }
    
    setInputValue(value);
    validateInput(value);
  };

  // Auto-resize textarea
  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  if (disabled) {
    // Preview mode - show disabled textarea with placeholder
    return (
      <div className="space-y-2 mt-4">
        <textarea
          disabled
          placeholder={placeholder}
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-500 resize-none focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:placeholder-gray-500"
          rows={3}
          style={{ minHeight: "80px" }}
        />
        {(charlimit || keywordChecker) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {charlimit && (
              <div>
                Character limit: {charlimit.min && `min ${charlimit.min}`}
                {charlimit.min && charlimit.max && ", "}
                {charlimit.max && `max ${charlimit.max}`}
              </div>
            )}
            {keywordChecker?.contains && keywordChecker.contains.length > 0 && (
              <div>Must contain: {keywordChecker.contains.join(", ")}</div>
            )}
            {keywordChecker?.doesnotContain && keywordChecker.doesnotContain.length > 0 && (
              <div>Cannot contain: {keywordChecker.doesnotContain.join(", ")}</div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Edit mode - show editable configuration
  return (
    <div className="space-y-3 mt-4">
      <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Text Input Preview:
      </div>

      <div className="space-y-2">
        <textarea
          value={inputValue}
          onChange={handleInputChange}
          onInput={handleInput}
          placeholder={placeholder}
          className={`w-full px-3 py-2 text-sm border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-[#5A5959] dark:border-gray-600 dark:text-white dark:placeholder-gray-400 ${
            validationErrors.length > 0 
              ? "border-red-300 focus:ring-red-500" 
              : "border-gray-300"
          }`}
          rows={3}
          style={{ minHeight: "80px" }}
        />

        {/* Character counter */}
        {charlimit?.max && (
          <div className="text-xs text-right text-gray-500 dark:text-gray-400">
            {inputValue.length}/{charlimit.max} characters
          </div>
        )}

        {/* Validation errors */}
        {validationErrors.length > 0 && (
          <div className="text-xs text-red-600 dark:text-red-400 space-y-1">
            {validationErrors.map((error, index) => (
              <div key={index}>• {error}</div>
            ))}
          </div>
        )}

        {/* Validation info (when no errors) */}
        {validationErrors.length === 0 && (charlimit || keywordChecker) && (
          <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
            {charlimit && (
              <div>
                Character limit: {charlimit.min && `min ${charlimit.min}`}
                {charlimit.min && charlimit.max && ", "}
                {charlimit.max && `max ${charlimit.max}`}
              </div>
            )}
            {keywordChecker?.contains && keywordChecker.contains.length > 0 && (
              <div className="text-green-600 dark:text-green-400">
                Must contain: {keywordChecker.contains.join(", ")}
              </div>
            )}
            {keywordChecker?.doesnotContain && keywordChecker.doesnotContain.length > 0 && (
              <div className="text-red-600 dark:text-red-400">
                Cannot contain: {keywordChecker.doesnotContain.join(", ")}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}