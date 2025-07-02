"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Question as QuestionInterface, QuestionType, fieldtypes } from "@/lib/interface";
import MCQ from "./FieldType/MCQ"; // Import the MCQ component
import Dropdown from "./FieldType/DROPDOWN";
import LinearScale from "./FieldType/linearscale";

interface Props {
  id: string;
  data: QuestionInterface;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedFields: Partial<QuestionInterface>) => void;
  isSelected?: boolean; // Add this prop to know if question is selected
}

export default function Question({ id, data, onDelete, onUpdate, isSelected = false }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  // Get MCQ options from config
  const getMcqOptions = (): string[] => {
    if (data.type === QuestionType.MCQ && data.config) {
      const config = data.config as any;
      if (config.params) {
        const optionsParam = config.params.find((p: any) => p.name === "options");
        if (optionsParam?.value) {
          return Array.isArray(optionsParam.value) ? optionsParam.value : optionsParam.value.split(", ");
        }
      }
    }
    return ["Option 1", "Option 2"];
  };

  // Handle MCQ options change
  const handleMcqOptionsChange = (options: string[]) => {
    const fieldType = fieldtypes.find(f => f.name === "mcq");
    if (fieldType) {
      const updatedParams = fieldType.params.map(param => {
        if (param.name === "options") {
          return { ...param, value: options };
        }
        return param;
      });
      
      const newConfig = {
        ...fieldType,
        params: updatedParams,
      };
      
      onUpdate(id, { config: newConfig });
    }
  };
  const getDropdownOptions = (): string[] => {
  const config = data.config as any;
  if (config?.params) {
    const optionsParam = config.params.find((p: any) => p.name === "options");
    if (optionsParam?.value) {
      return Array.isArray(optionsParam.value)
        ? optionsParam.value
        : optionsParam.value.split(", ");
    }
  }
  return ["Option 1"];
};

const handleDropdownOptionsChange = (options: string[]) => {
  const fieldType = fieldtypes.find((f) => f.name === "dropdown");
  if (fieldType) {
    const updatedParams = fieldType.params.map((param) =>
      param.name === "options" ? { ...param, value: options } : param
    );

    const newConfig = {
      ...fieldType,
      params: updatedParams,
    };

    onUpdate(id, { config: newConfig });
  }
};
const getLinearScaleParams = () => {
  const config = data.config;
  const params = config?.params ?? [];
  const get = (name: string) =>
    params.find((p) => p.name === name)?.value;

  return {
    min: Number(get("min")) || 1,
    max: Number(get("max")) || 5,
    minLabel: get("minLabel") || "Low",
    maxLabel: get("maxLabel") || "High",
  };
};


const handleLinearScaleChange = (value: number) => {
  onUpdate(id, {
    config: {
      ...data.config,
      selected: value, // You can store this value separately
      params: data.config?.params || [],
    },
  });
};



  const toggleId = `title-toggle-${id}`;

  const renderAnswerSection = () => {
    switch (data.type) {
      case QuestionType.MCQ:
        return (
          <MCQ
            options={getMcqOptions()}
            onOptionsChange={handleMcqOptionsChange}
            disabled={!isSelected} // Only allow editing when selected
          />
        );
      
      case QuestionType.DROPDOWN:
  return (
    <Dropdown
      options={getDropdownOptions()}
      onOptionsChange={handleDropdownOptionsChange}
      disabled={!isSelected}
    />
  );

      
      case QuestionType.DATE:
        return (
          <div className="mt-4">
            <input
              type="date"
              disabled
              className="px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      
      case QuestionType.FILE_UPLOAD:
        return (
          <div className="mt-4">
            <div className="border-2 border-dashed border-gray-300 rounded-md px-4 py-6 text-center dark:border-gray-600">
              <span className="text-gray-500 dark:text-gray-400">Click to upload or drag and drop</span>
            </div>
          </div>
        );
      
      case QuestionType.RATING:
  const scale = getLinearScaleParams();
  return (
    <LinearScale
      min={scale.min}
      max={scale.max}
      minLabel={scale.minLabel}
      maxLabel={scale.maxLabel}
      
      onSelect={handleLinearScaleChange}
      disabled={!isSelected}
    />
  );

      
      case QuestionType.EMAIL:
        return (
          <div className="mt-4">
            <input
              type="email"
              disabled
              placeholder="example@email.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      
      case QuestionType.URL:
        return (
          <div className="mt-4">
            <input
              type="url"
              disabled
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 dark:bg-[#494949] dark:border-gray-600 dark:text-white"
            />
          </div>
        );
      
      case QuestionType.TEXT:
      default:
        return (
          <div className="mt-4 bg-[#F6F6F6] rounded-md px-4 py-2 text-black/50 dark:bg-[#494949] dark:text-white">
            Short answer text
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#FEFEFE] shadow-[0_0_10px_rgba(0,0,0,0.3)] p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 transition-all duration-200 ${
        isSelected ? "ring-4 ring-black dark:ring-[#64ad8b]" : ""
      } dark:bg-[#5A5959] dark:text-white hover:shadow-lg`}
    >
      <div className="flex justify-between items-center dark:text-white">
        <input
          placeholder="Question Title *"
          className="focus:outline-none font-bold text-xl text-black dark:text-white dark:placeholder-white bg-transparent flex-1 mr-4"
          value={data.questionText || ""}
          onChange={(e) => onUpdate(id, { questionText: e.target.value })}
        />
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm dark:text-white">Required</label>
            <label
              htmlFor={toggleId}
              className="relative inline-flex items-center cursor-pointer"
            >
              <input
                type="checkbox"
                id={toggleId}
                className="sr-only peer"
                checked={data.isRequired || false}
                onChange={(e) => onUpdate(id, { isRequired: e.target.checked })}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
            </label>
          </div>
          
          <button
            className="text-gray-700 hover:text-red-500 hover:bg-gray-100 p-2 rounded-full transition-colors cursor-pointer dark:text-white dark:hover:bg-[#494949]"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-3 text-black text-lg dark:text-white">
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          placeholder="Write your question here *"
          className="resize-none focus:outline-none w-full min-h-[40px] overflow-hidden p-0 bg-transparent dark:text-white dark:placeholder-white"
          value={data.questionText || ""}
          onChange={(e) => onUpdate(id, { questionText: e.target.value })}
        />
      </div>

      {/* Answer Section */}
      {renderAnswerSection()}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="bg-[#F6F6F6] rounded-md px-3 py-1 dark:bg-[#494949]">
          Type: {data.type || "TEXT"}
        </div>
        <div>
          Order: {data.order}
        </div>
      </div>
    </div>
  );
}