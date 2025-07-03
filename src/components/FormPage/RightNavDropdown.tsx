"use client";

import React, { useState, useEffect } from "react";
import { QuestionType, fieldtypes, Question } from "@/lib/interface";

// All supported question types for dropdown
const questionTypes = [
  { label: "MCQ", value: QuestionType.MCQ, field: "mcq" },
  { label: "Text", value: QuestionType.TEXT, field: "text" },
  { label: "Dropdown", value: QuestionType.DROPDOWN, field: "dropdown" },
  { label: "Date", value: QuestionType.DATE, field: "date" },
  { label: "Linear Scale", value: QuestionType.LINEARSCALE, field: "linear_scale" },
  { label: "Email", value: QuestionType.EMAIL, field: "email" },
  { label: "Url", value: QuestionType.URL, field: "url" },
];

interface Props {
  selectedQuestion?: Question;
  onChangeType?: (newType: QuestionType) => void;
  onUpdateConfig?: (config: any) => void;
}

export default function QuestionTypeDropdown({
  selectedQuestion,
  onChangeType,
  onUpdateConfig,
}: Props) {
  const [selectedType, setSelectedType] = useState(questionTypes[0].label);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (selectedQuestion?.type) {
      const found = questionTypes.find(qt => qt.value === selectedQuestion.type);
      setSelectedType(found?.label || questionTypes[0].label);
    } else {
      setSelectedType(questionTypes[0].label);
    }
    setIsOpen(false);
  }, [selectedQuestion?.question_ID]);

  const handleTypeChange = (typeLabel: string) => {
    setSelectedType(typeLabel);
    setIsOpen(false);

    const found = questionTypes.find(qt => qt.label === typeLabel);
    if (!found) return;

    if (onChangeType) {
      // Reset config on type change
      if (onUpdateConfig) {
        const selectedField = fieldtypes.find(f => f.name === found.field);
        if (selectedField) {
          let newConfig = {
            ...selectedField,
            params: selectedField.params.map(param => {
              if (param.name === "options") {
                // Always initialize with at least two options
                return { ...param, value: ["Option 1", "Option 2"] };
              }
              return { ...param };
            }),
            validations: selectedField.validations.map(validation => ({
              ...validation,
              params: validation.params?.map(param => ({ ...param })) || [],
            })),
          };
          onUpdateConfig(newConfig);
        }
      }
      onChangeType(found.value);
    }
  };

  const paramInputType = (param: any, key: number) => {
    const cls = "w-full px-2 py-2 rounded bg-white outline-none dark:bg-[#5A5959] dark:text-white border-black-500";

    const handleParamChange = (value: any) => {
      if (!selectedQuestion || !onUpdateConfig) return;
      const oldConfig = selectedQuestion.config || {};
      const existingParams = oldConfig.params || [];
      const paramIndex = existingParams.findIndex((p: any) => p.name === param.name);

      let updatedParams;
      if (paramIndex >= 0) {
        updatedParams = existingParams.map((p: any) =>
          p.name === param.name ? { ...p, value } : p
        );
      } else {
        updatedParams = [...existingParams, { ...param, value }];
      }
      onUpdateConfig({
        ...oldConfig,
        params: updatedParams,
      });
    };

    const handleValidationChange = (value: any, validationName: string, validationParamName: string) => {
      if (!selectedQuestion || !onUpdateConfig) return;
      const oldConfig = selectedQuestion.config || {};
      const existingValidations = oldConfig.validations || [];
      const validationIndex = existingValidations.findIndex((v: any) => v.name === validationName);

      let updatedValidations;
      if (validationIndex >= 0) {
        const existingValidation = existingValidations[validationIndex];
        const existingParams = existingValidation.params || [];
        const paramIndex = existingParams.findIndex((p: any) => p.name === validationParamName);
        let updatedParams;
        if (paramIndex >= 0) {
          updatedParams = existingParams.map((p: any) =>
            p.name === validationParamName ? { ...p, value } : p
          );
        } else {
          updatedParams = [...existingParams, { name: validationParamName, type: "string", value }];
        }
        updatedValidations = existingValidations.map((v: any) =>
          v.name === validationName ? { ...v, params: updatedParams } : v
        );
      } else {
        updatedValidations = [
          ...existingValidations,
          {
            name: validationName,
            params: [{ name: validationParamName, type: "string", value }],
          },
        ];
      }
      onUpdateConfig({
        ...oldConfig,
        validations: updatedValidations,
      });
    };

    const input = (type: string) => (
      <input
        key={key}
        type={type}
        placeholder={param.name}
        value={param.value ?? ""}
        className={cls}
        onChange={(e) => {
          let value: any = e.target.value;
          if (type === "number") value = parseInt(value) || 0;
          if (type === "boolean") value = e.target.checked;
          handleParamChange(value);
        }}
      />
    );

    if (param.isValidation) {
      if (param.name === "contains" || param.name === "doesnotContain") {
        const displayValue = Array.isArray(param.value) ? param.value.join(", ") : param.value || "";
        return (
          <input
            key={key}
            type="text"
            placeholder={param.placeholder || param.name}
            value={displayValue}
            className={cls}
            onChange={e => {
              const inputText = e.target.value;
              const value = inputText.split(",").map(s => s.trim()).filter(s => s.length > 0);
              handleValidationChange(value, param.validationName, param.name);
            }}
          />
        );
      }
      if (param.name === "min" || param.name === "max") {
        return (
          <input
            key={key}
            type="number"
            placeholder={param.placeholder || param.name}
            value={param.value ?? ""}
            className={cls}
            onChange={e => {
              const value = parseInt(e.target.value) || 0;
              handleValidationChange(value, param.validationName, param.name);
            }}
          />
        );
      }
      return (
        <input
          key={key}
          type="text"
          placeholder={param.placeholder || param.name}
          value={param.value ?? ""}
          className={cls}
          onChange={e => {
            const value = e.target.value;
            handleValidationChange(value, param.validationName, param.name);
          }}
        />
      );
    }

    switch (param.type) {
      case "string":
        return input("text");
      case "number":
        return input("number");
      case "boolean":
        return (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!param.value}
              className="accent-[#8CC7AA]"
              onChange={e => handleParamChange(e.target.checked)}
            />
            <span>{param.name}</span>
          </label>
        );
      case "array[string]":
        return (
          <input
            key={key}
            type="text"
            placeholder={`${param.name} (comma-separated)`}
            value={Array.isArray(param.value) ? param.value.join(", ") : ""}
            className={cls}
            onChange={e => {
              const value = e.target.value.split(",").map((s) => s.trim()).filter(s => s.length > 0);
              handleParamChange(value);
            }}
          />
        );
      default:
        return <div key={key}>Unsupported type: {param.type}</div>;
    }
  };

  const typeSelector = () => {
    const found = questionTypes.find(qt => qt.label === selectedType);
    const fieldTypeName = found ? found.field : questionTypes[0].field;
    const selectedField = fieldtypes.find(f => f.name === fieldTypeName);

    if (!selectedField) {
      return (
        <div className="bg-white p-4 text-black text-sm dark:bg-[#494949] dark:text-white">
          <p className="italic">{selectedType} configuration not found.</p>
        </div>
      );
    }

    // Get current values from selectedQuestion config
    const getCurrentParamValue = (paramName: string) => {
      return selectedQuestion?.config?.params?.find((p: any) => p.name === paramName)?.value;
    };
    const getCurrentValidationValue = (validationName: string, paramName: string) => {
      const validation = selectedQuestion?.config?.validations?.find((v: any) => v.name === validationName);
      const param = validation?.params?.find((p: any) => p.name === paramName);
      return param?.value;
    };

    return (
      <div className="bg-white p-4 text-black space-y-4 text-sm dark:bg-[#494949] dark:text-white">
        {selectedField.params.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Parameters</h4>
            <div className="space-y-2">
              {selectedField.params
                // Hide MCQ options param in right nav
                .filter(p => !(selectedField.name === "mcq" && p.name === "options"))
                .map((p, i) => {
                  const paramWithValue = {
                    ...p,
                    value: getCurrentParamValue(p.name) ?? p.value,
                  };
                  return paramInputType(paramWithValue, i);
                })}
            </div>
          </>
        )}
        {selectedField.validations.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Validations</h4>
            <div className="space-y-3">
              {selectedField.validations.map((validation, validationIndex) => (
                <div key={validationIndex} className="border-l-2 border-gray-300 pl-3 dark:border-gray-600">
                  <h5 className="font-medium text-sm mb-2 capitalize">{validation.name}</h5>
                  <div className="space-y-2">
                    {validation.params?.map((param, paramIndex) => {
                      const currentValue = getCurrentValidationValue(validation.name, param.name);
                      const paramWithValue = {
                        ...param,
                        value: currentValue ?? param.value,
                        isValidation: true,
                        validationName: validation.name,
                        placeholder:
                          param.name === "contains"
                            ? "keyword1, keyword2, keyword3"
                            : param.name === "doesnotContain"
                            ? "word1, word2, word3"
                            : param.name === "min"
                            ? "Minimum"
                            : param.name === "max"
                            ? "Maximum"
                            : param.name,
                      };
                      return paramInputType(paramWithValue, `${validationIndex}-${paramIndex}`);
                    })}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-full max-w-sm sm:max-w-xs mx-auto relative rounded-xl bg-white dark:bg-[#363535]">
      {/* Dropdown Header */}
      <div
        className="bg-[#8CC7AA] dark:bg-[#5A5959] dark:text-white rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-black dark:text-white font-medium text-base">
          {selectedType}
        </span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </div>
      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-[#8CC7AA] text-black rounded-b-xl shadow-lg mt-1 dark:text-white dark:bg-[#494949]">
          <ul className="py-2 px-4 space-y-2 max-h-52 overflow-y-auto text-sm">
            {questionTypes.map((qt) => (
              <li
                key={qt.label}
                onClick={e => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange(qt.label);
                }}
                className={`cursor-pointer transition select-none ${
                  selectedType === qt.label ? "font-semibold" : ""
                } hover:bg-[#6fb899] px-2 py-1 rounded dark:hover:bg-[#5A5959]`}
              >
                {qt.label}
              </li>
            ))}
          </ul>
        </div>
      )}
      {/* Config Panel */}
      <div className="mt-5">{typeSelector()}</div>
    </div>
  );
}
