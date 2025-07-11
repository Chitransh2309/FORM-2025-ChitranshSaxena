"use client";
import React, { useRef } from "react";
import { Trash2, Menu } from "lucide-react";
import {
  Question as QuestionInterface,
  QuestionType,
  fieldtypes,
} from "@/lib/interface";
import MCQ from "./FieldType/MCQ";
import Text from "./FieldType/TEXT";
import Dropdown from "./FieldType/DROPDOWN";
import DateField from "./FieldType/DATE";
import LinearScale from "./FieldType/linearscale";
import Email from "./FieldType/EMAIL";
import Url from "./FieldType/URL";

interface Props {
  id: string;
  data: QuestionInterface;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedFields: Partial<QuestionInterface>) => void;
  isSelected?: boolean;
  isDuplicate?: boolean;
  onEditQuestion: () => void;
}

export default function Question({
  id,
  data,
  onDelete,
  onUpdate,
  isSelected = false,
  isDuplicate = false,
  onEditQuestion,
}: Props) {
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
          return Array.isArray(optionsParam.value)
            ? optionsParam.value
            : optionsParam.value.split(", ");
        }
      }
    }
    return ["Option 1", "Option 2"];
  };

  // Get Dropdown options from config
  const getDropdownOptions = (): string[] => {
    if (data.type === QuestionType.DROPDOWN && data.config) {
      const config = data.config as any;
      if (config.params) {
        const optionsParam = config.params.find((p: any) => p.name === "options");
        if (optionsParam?.value) {
          return Array.isArray(optionsParam.value)
            ? optionsParam.value
            : optionsParam.value.split(", ");
        }
      }
    }
    return ["Option 1", "Option 2"];
  };

  // Get Date config
  const getDateConfig = () => {
    if (data.type === QuestionType.DATE && data.config) {
      const config = data.config as any;
      const includeTime = !!config.params?.find((p: any) => p.name === "includeTime")?.value;
      const dateRange = config.validations?.find((v: any) => v.name === "dateRange");
      let minDate, maxDate;
      if (dateRange?.params) {
        minDate = dateRange.params.find((p: any) => p.name === "minDate")?.value;
        maxDate = dateRange.params.find((p: any) => p.name === "maxDate")?.value;
      }
      return { includeTime, minDate, maxDate };
    }
    return { includeTime: false };
  };

  // Get Linear Scale config
  const getLinearScaleConfig = () => {
    if (data.type === QuestionType.LINEARSCALE && data.config) {
      const config = data.config as any;
      const min = Number(config.params?.find((p: any) => p.name === "min")?.value ?? 1);
      const max = Number(config.params?.find((p: any) => p.name === "max")?.value ?? 5);
      const minLabel = config.params?.find((p: any) => p.name === "minLabel")?.value ?? "";
      const maxLabel = config.params?.find((p: any) => p.name === "maxLabel")?.value ?? "";
      return { min, max, minLabel, maxLabel };
    }
    return { min: 1, max: 5, minLabel: "", maxLabel: "" };
  };

  // Get Text configuration from config
  const getTextConfig = () => {
    if (data.type === QuestionType.TEXT && data.config) {
      const config = data.config as any;
      const placeholder = config.params?.find((p: any) => p.name === "placeholder")?.value || "Enter your answer...";
      let charlimit: { min?: number; max?: number } | undefined;
      const charlimitValidation = config.validations?.find((v: any) => v.name === "charlimit");
      if (charlimitValidation?.params) {
        const minParam = charlimitValidation.params.find((p: any) => p.name === "min");
        const maxParam = charlimitValidation.params.find((p: any) => p.name === "max");
        charlimit = {
          min: minParam?.value ? Number(minParam.value) : undefined,
          max: maxParam?.value ? Number(maxParam.value) : undefined,
        };
      }
      let keywordChecker: { contains?: string[]; doesnotContain?: string[] } | undefined;
      const keywordValidation = config.validations?.find((v: any) => v.name === "keywordChecker");
      if (keywordValidation?.params) {
        const containsParam = keywordValidation.params.find((p: any) => p.name === "contains");
        const doesnotContainParam = keywordValidation.params.find((p: any) => p.name === "doesnotContain");
        keywordChecker = {
          contains: containsParam?.value
            ? Array.isArray(containsParam.value)
              ? containsParam.value
              : [containsParam.value]
            : undefined,
          doesnotContain: doesnotContainParam?.value
            ? Array.isArray(doesnotContainParam.value)
              ? doesnotContainParam.value
              : [doesnotContainParam.value]
            : undefined,
        };
      }
      return { placeholder, charlimit, keywordChecker };
    }
    return { placeholder: "Enter your answer..." };
  };

  // Handle MCQ options change
  const handleMcqOptionsChange = (options: string[]) => {
    if (data.config && data.config.params) {
      const updatedParams = data.config.params.map((param: any) => {
        if (param.name === "options") {
          return { ...param, value: options };
        }
        return param;
      });
      const newConfig = {
        ...data.config,
        params: updatedParams,
      };
      onUpdate(id, { config: newConfig });
    } else {
      const fieldType = fieldtypes.find((f) => f.name === "mcq");
      if (fieldType) {
        const updatedParams = fieldType.params.map((param) => {
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
    }
  };

  // Handle Dropdown options change
  const handleDropdownOptionsChange = (options: string[]) => {
    if (data.config && data.config.params) {
      const updatedParams = data.config.params.map((param: any) => {
        if (param.name === "options") {
          return { ...param, value: options };
        }
        return param;
      });
      const newConfig = {
        ...data.config,
        params: updatedParams,
      };
      onUpdate(id, { config: newConfig });
    } else {
      const fieldType = fieldtypes.find((f) => f.name === "dropdown");
      if (fieldType) {
        const updatedParams = fieldType.params.map((param) => {
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
    }
  };

  const toggleId = `title-toggle-${id}`;

  const renderAnswerSection = () => {
    switch (data.type) {
      case QuestionType.MCQ:
        return (
          <MCQ
            options={getMcqOptions()}
            onOptionsChange={handleMcqOptionsChange}
            disabled={!isSelected}
          />
        );
      case QuestionType.TEXT: {
        const textConfig = getTextConfig();
        return (
          <Text
            placeholder={textConfig.placeholder}
            charlimit={textConfig.charlimit}
            keywordChecker={textConfig.keywordChecker}
            disabled={!isSelected}
          />
        );
      }
      case QuestionType.DROPDOWN:
        return (
          <Dropdown
            options={getDropdownOptions()}
            onOptionsChange={handleDropdownOptionsChange}
            disabled={!isSelected}
          />
        );
      case QuestionType.DATE: {
        const { includeTime, minDate, maxDate } = getDateConfig();
        return (
          <DateField
            includeTime={includeTime}
            minDate={minDate}
            maxDate={maxDate}
            disabled={!isSelected}
          />
        );
      }
      case QuestionType.LINEARSCALE: {
        const { min, max, minLabel, maxLabel } = getLinearScaleConfig();
        return (
          <LinearScale
            min={min}
            max={max}
            minLabel={minLabel}
            maxLabel={maxLabel}
            disabled={!isSelected}
          />
        );
      }
      case QuestionType.EMAIL:
        return <Email disabled={!isSelected} />;
      case QuestionType.URL:
        return <Url disabled={!isSelected} />;
      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#FEFEFE] shadow-[0_0_10px_rgba(0,0,0,0.3)] p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 transition-all duration-200 
    ${isSelected ? "ring-4 ring-black dark:ring-[#64ad8b]" : ""}
    ${isDuplicate ? "border-2 border-red-500" : ""}
    dark:bg-[#5A5959] dark:text-white hover:shadow-lg`}
    >
      <div className="flex justify-between items-center dark:text-white">
        {/* Display the question title as a paragraph instead of an input */}
        <p
          className="font-bold text-xl text-black dark:text-white bg-transparent flex-1 mr-4"
          style={{ margin: 0, padding: 0 }}
        >
          Question
        </p>

        <button
          className="flex items-center gap-2 bg-[#8cc7aa] text-black py-1 px-3 rounded-md shadow dark:bg-[#353434] dark:text-white"
          onClick={onEditQuestion}
        >
          <Menu className="w-4 h-2 lg:h-4" />
          Edit Question
        </button>


        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-gray-700 text-sm dark:text-white">
              Required
            </label>
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

      {renderAnswerSection()}

      <div className="mt-4 flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
        <div className="bg-[#F6F6F6] rounded-md px-3 py-1 dark:bg-[#494949]">
          Type: {data.type || "MCQ"}
        </div>
        <div>Order: {data.order}</div>
      </div>
    </div>
  );
}
