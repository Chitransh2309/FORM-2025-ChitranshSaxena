'use client';
import React, { useRef, useState} from 'react';
import { Trash2, Menu } from 'lucide-react';
import {
  FieldType,
  Param,
  Question as QuestionInterface,
  QuestionType,
  Validation,
  fieldtypes,
} from '@/lib/interface';
import MCQ from './FieldType/MCQ';
import Text from './FieldType/TEXT';
import Dropdown from './FieldType/DROPDOWN';
import DateField from './FieldType/DATE';
import LinearScale from './FieldType/linearscale';
import Email from './FieldType/EMAIL';
import Url from './FieldType/URL';
import FileUpload from './FieldType/FILE_UPLOAD';

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
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const [showWarning, setShowWarning] = useState(false);
  const [hasBlurred, setHasBlurred] = useState(false);

  // Get MCQ options from config
  const getMcqOptions = (): string[] => {
    if (data.type === QuestionType.MCQ && data.config) {
      const config: FieldType = data.config;
      if (config.params) {
        const optionsParam = config.params.find(
          (p: Param) => p.name === 'options'
        );
        if (optionsParam?.value) {
          return Array.isArray(optionsParam.value)
            ? optionsParam.value
            : String(optionsParam.value).split(', ');
        }
      }
    }
    return ['Option 1', 'Option 2'];
  };

  // Get Dropdown options from config
  const getDropdownOptions = (): string[] => {
    if (data.type === QuestionType.DROPDOWN && data.config) {
      const config: FieldType = data.config;
      if (config.params) {
        const optionsParam = config.params.find(
          (p: Param) => p.name === 'options'
        );
        if (optionsParam?.value) {
          return Array.isArray(optionsParam.value)
            ? optionsParam.value
            : String(optionsParam.value).split(', ');
        }
      }
    }
    return ['Option 1', 'Option 2'];
  };

  // Get Date config
  const getDateConfig = () => {
    if (data.type === QuestionType.DATE && data.config) {
      const config: FieldType = data.config;
      const includeTime = !!config.params?.find(
        (p: Param) => p.name === 'includeTime'
      )?.value;
      const dateRange = config.validations?.find(
        (v: Validation) => v.name === 'dateRange'
      );
      let minDate, maxDate;
      if (dateRange?.params) {
        minDate = dateRange.params.find(
          (p: Param) => p.name === 'minDate'
        )?.value;
        maxDate = dateRange.params.find(
          (p: Param) => p.name === 'maxDate'
        )?.value;
      }
      return { includeTime, minDate, maxDate };
    }
    return { includeTime: false };
  };

  // Get Linear Scale config
  const getLinearScaleConfig = () => {
    if (data.type === QuestionType.LINEARSCALE && data.config) {
      const config: FieldType = data.config;
      const min = Number(
        config.params?.find((p: Param) => p.name === 'min')?.value ?? 1
      );
      const max = Number(
        config.params?.find((p: Param) => p.name === 'max')?.value ?? 5
      );
      const minLabel =
        config.params?.find((p: Param) => p.name === 'minLabel')?.value ?? '';
      const maxLabel =
        config.params?.find((p: Param) => p.name === 'maxLabel')?.value ?? '';
      return { min, max, minLabel, maxLabel };
    }
    return { min: 1, max: 5, minLabel: '', maxLabel: '' };
  };

  // Get Text configuration from config
  const getTextConfig = () => {
    if (data.type === QuestionType.TEXT && data.config) {
      const config: FieldType = data.config;
      const placeholder = String(
        config.params?.find((p: Param) => p.name === 'placeholder')?.value ||
          'Enter your answer...'
      );
      let charlimit: { min?: number; max?: number } | undefined;
      const charlimitValidation = config.validations?.find(
        (v: Validation) => v.name === 'charlimit'
      );
      if (charlimitValidation?.params) {
        const minParam = charlimitValidation.params.find(
          (p: Param) => p.name === 'min'
        );
        const maxParam = charlimitValidation.params.find(
          (p: Param) => p.name === 'max'
        );
        charlimit = {
          min: minParam?.value ? Number(minParam.value) : undefined,
          max: maxParam?.value ? Number(maxParam.value) : undefined,
        };
      }
      let keywordChecker:
        | { contains?: string[]; doesnotContain?: string[] }
        | undefined;
      const keywordValidation = config.validations?.find(
        (v: Validation) => v.name === 'keywordChecker'
      );
      if (keywordValidation?.params) {
        const containsParam = keywordValidation.params.find(
          (p: Param) => p.name === 'contains'
        );
        const doesnotContainParam = keywordValidation.params.find(
          (p: Param) => p.name === 'doesnotContain'
        );
        keywordChecker = {
          contains: containsParam?.value
            ? Array.isArray(containsParam.value)
              ? containsParam.value.map(String)
              : [String(containsParam.value)]
            : undefined,
          doesnotContain: doesnotContainParam?.value
            ? Array.isArray(doesnotContainParam.value)
              ? doesnotContainParam.value.map(String)
              : [String(doesnotContainParam.value)]
            : undefined,
        };
      }
      return { placeholder, charlimit, keywordChecker };
    }
    return { placeholder: 'Enter your answer...' };
  };

  // Handle MCQ options change
  const handleMcqOptionsChange = (options: string[]) => {
    if (data.config && data.config.params) {
      const updatedParams = data.config.params.map((param: Param) => {
        if (param.name === 'options') {
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
      const fieldType = fieldtypes.find((f) => f.name === 'mcq');
      if (fieldType) {
        const updatedParams = fieldType.params.map((param) => {
          if (param.name === 'options') {
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
      const updatedParams = data.config.params.map((param: Param) => {
        if (param.name === 'options') {
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
      const fieldType = fieldtypes.find((f) => f.name === 'dropdown');
      if (fieldType) {
        const updatedParams = fieldType.params.map((param) => {
          if (param.name === 'options') {
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
            minDate={minDate?.toString()}
            maxDate={maxDate?.toString()}
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
            minLabel={minLabel ? String(minLabel) : undefined}
            maxLabel={maxLabel ? String(maxLabel) : undefined}
            disabled={!isSelected}
          />
        );
      }
      case QuestionType.EMAIL:
        return <Email disabled={!isSelected} />;
      case QuestionType.URL:
        return <Url disabled={!isSelected} />;

      case QuestionType.FILE_UPLOAD:
        return <FileUpload />;

      default:
        return null;
    }
  };

  return (
    <div
      ref={containerRef}
      className={`bg-[#FEFEFE] shadow-[0_0_10px_rgba(0,0,0,0.3)] p-6 rounded-xl
              w-[90%] min-h-[20%] mx-auto mb-10 transition-all duration-200
              ${isSelected ? 'ring-4 ring-black dark:ring-[#64ad8b]' : ''}
              ${isDuplicate ? 'border-2 border-red-500' : ''}
              dark:bg-[#5A5959] dark:text-white hover:shadow-lg`}
    >
      {/* ─── Header row ──────────────────────────────────────── */}
      <div
        className="flex flex-col gap-2
               sm:flex-row sm:items-center sm:justify-between
               dark:text-white"
      >
        {/* Title */}
        <div className="flex items-center justify-between">
          <p className="font-bold text-xl break-words bg-transparent flex-1">
            Question
          </p>

          {/* Edit button – shown only on mobile already */}

          <button
            className="text-gray-700 hover:text-red-500 hover:bg-gray-100
                   p-2 rounded-full transition-colors cursor-pointer
                   dark:text-white dark:hover:bg-[#494949]"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
        {/* Required toggle + trash */}
        <div
          className="flex flex-wrap items-center gap-2 sm:gap-4
                 justify-end max-w-full sm:max-w-none"
        >
          <div className="flex items-center gap-2 w-full justify-between">
            <div>
              <button
                className="lg:hidden flex items-center gap-2 self-start
                 bg-[#8cc7aa] text-black py-0.5 px-2 rounded-md shadow
                 dark:bg-[#353434] dark:text-white"
                onClick={onEditQuestion}
              >
                <Menu className="w-4 h-4" />
                Edit
              </button>
            </div>
            <div className="flex justify-center items-center space-x-2">
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
                  onChange={(e) =>
                    onUpdate(id, { isRequired: e.target.checked })
                  }
                />
                <div
                  className="w-11 h-6 bg-gray-200 rounded-full peer
                          dark:bg-gray-700 peer-checked:after:translate-x-full
                          after:absolute after:top-[2px] after:left-[2px]
                          after:w-5 after:h-5 after:bg-white after:rounded-full
                          after:transition-all peer-checked:bg-blue-600"
                />
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Question text area ──────────────────────────────── */}
      <div className="mt-3 text-black text-lg dark:text-white">
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          placeholder="Write your question here *"
          className={`
  w-full min-h-[40px] resize-none bg-transparent px-3 py-2
  focus:outline-none break-words border-2
  dark:text-white dark:placeholder-white
  ${
    hasBlurred && !data.questionText.trim()
      ? 'border-red-500 rounded-md'
      : 'border-transparent'
  }
`}
          value={data.questionText || ''}
          onChange={(e) => {
            const value = e.target.value;
            onUpdate(id, { questionText: value });
            if (value.trim()) {
              setShowWarning(false);
            }
          }}
          onBlur={() => {
            setHasBlurred(true);
            if (!data.questionText.trim() && !showWarning) {
              alert('❗ Question cannot be empty.');
              setShowWarning(true);
            }
          }}
        />
      </div>

      {renderAnswerSection()}

      {/* ─── Footer row ──────────────────────────────────────── */}
      <div
        className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-between
                  text-sm text-gray-500 dark:text-gray-400"
      >
        <div className="bg-[#F6F6F6] rounded-md px-3 py-1 dark:bg-[#494949]">
          Type: {data.type || 'MCQ'}
        </div>
        <div>Order: {data.order}</div>
      </div>
    </div>
  );
}
