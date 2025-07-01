"use client";

import React, { useState, useEffect } from "react";
import { QuestionType, fieldtypes, FieldType, ParamType, Question } from "@/lib/interface";

const questionTypes = [
  "Text",
  "MCQ",
  "Dropdown",
  "Date",
  "Linear Scale",
  "File Upload",
  "Email",
  "Url",
];

interface Props {
  selectedQuestion?: Question;
  onChangeType?: (newType: QuestionType) => void;
  onUpdateConfig?: (config: any) => void;
}

export default function QuestionTypeDropdown({ 
  selectedQuestion, 
  onChangeType, 
  onUpdateConfig 
}: Props) {
  const [selectedType, setSelectedType] = useState("Text");
  const [isOpen, setIsOpen] = useState(false);

  // Update selected type when selectedQuestion changes
  useEffect(() => {
    if (selectedQuestion?.type) {
      const typeMap: { [key in QuestionType]: string } = {
        [QuestionType.TEXT]: "Text",
        [QuestionType.MCQ]: "MCQ",
        [QuestionType.DROPDOWN]: "Dropdown",
        [QuestionType.DATE]: "Date",
        [QuestionType.RATING]: "Linear Scale",
        [QuestionType.FILE_UPLOAD]: "File Upload",
        [QuestionType.EMAIL]: "Email",
        [QuestionType.URL]: "Url",
      };
      setSelectedType(typeMap[selectedQuestion.type] || "Text");
    }
  }, [selectedQuestion]);

  const handleTypeChange = (type: string) => {
    console.log("Changing type to:", type); // Debug log
    setSelectedType(type);
    setIsOpen(false);
    
    // Map display name to QuestionType enum
    const typeMap: { [key: string]: QuestionType } = {
      "Text": QuestionType.TEXT,
      "MCQ": QuestionType.MCQ,
      "Dropdown": QuestionType.DROPDOWN,
      "Date": QuestionType.DATE,
      "Linear Scale": QuestionType.RATING,
      "File Upload": QuestionType.FILE_UPLOAD,
      "Email": QuestionType.EMAIL,
      "Url": QuestionType.URL,
    };
    
    const questionType = typeMap[type];
    console.log("Mapped question type:", questionType); // Debug log
    
    if (questionType && onChangeType) {
      onChangeType(questionType);
    }
  };

  const paramInputType = (param: any, key: number) => {
    const cls = "w-full px-2 py-2 rounded bg-white outline-none dark:bg-[#5A5959] dark:text-white border-black";

    const input = (type: string) => (
      <input
        key={key}
        type={type}
        placeholder={param.name}
        defaultValue={param.value ?? ""}
        className={cls}
        onChange={e => {
          let value: any = e.target.value;
          if (type === "number") value = parseInt(value) || 0;
          if (type === "boolean") value = e.target.checked;
          // Handle parameter updates for non-MCQ types
          if (onUpdateConfig && selectedQuestion) {
            const fieldType = fieldtypes.find(f => f.name.toLowerCase() === selectedType.toLowerCase());
            if (fieldType) {
              const updatedParams = fieldType.params.map(p => 
                p.name === param.name ? { ...p, value } : p
              );
              onUpdateConfig({
                ...fieldType,
                params: updatedParams,
              });
            }
          }
        }}
      />
    );

    switch (param.type) {
      case "string":
      case "number":
        return input(param.type);

      case "boolean":
        return (
          <label key={key} className="flex items-center gap-2">
            <input
              type="checkbox"
              defaultChecked={!!param.value}
              className="accent-[#8CC7AA]"
              onChange={e => {
                if (onUpdateConfig && selectedQuestion) {
                  const fieldType = fieldtypes.find(f => f.name.toLowerCase() === selectedType.toLowerCase());
                  if (fieldType) {
                    const updatedParams = fieldType.params.map(p => 
                      p.name === param.name ? { ...p, value: e.target.checked } : p
                    );
                    onUpdateConfig({
                      ...fieldType,
                      params: updatedParams,
                    });
                  }
                }
              }}
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
            defaultValue={Array.isArray(param.value) ? param.value.join(", ") : ""}
            className={cls}
            onChange={e => {
              const value = e.target.value.split(",").map((s: string) => s.trim());
              if (onUpdateConfig && selectedQuestion) {
                const fieldType = fieldtypes.find(f => f.name.toLowerCase() === selectedType.toLowerCase());
                if (fieldType) {
                  const updatedParams = fieldType.params.map(p => 
                    p.name === param.name ? { ...p, value } : p
                  );
                  onUpdateConfig({
                    ...fieldType,
                    params: updatedParams,
                  });
                }
              }
            }}
          />
        );

      case "file":
        return (
          <label key={key} className="flex flex-col gap-1">
            <span>{param.name}</span>
            <input type="file" multiple className={cls} />
          </label>
        );

      case "date":
        return (
          <label key={key} className="flex items-center gap-2">
            <span>{param.name}</span>
            <input
              type="date"
              defaultValue={param.value ?? ""}
              className={cls}
              onChange={e => {
                if (onUpdateConfig && selectedQuestion) {
                  const fieldType = fieldtypes.find(f => f.name.toLowerCase() === selectedType.toLowerCase());
                  if (fieldType) {
                    const updatedParams = fieldType.params.map(p => 
                      p.name === param.name ? { ...p, value: e.target.value } : p
                    );
                    onUpdateConfig({
                      ...fieldType,
                      params: updatedParams,
                    });
                  }
                }
              }}
            />
          </label>
        );

      default:
        return <div key={key}>Unsupported type: {param.type}</div>;
    }
  };

  const typeSelector = () => {

    const selectedField = fieldtypes.find(
      (f) => f.name.toLowerCase() === selectedType.toLowerCase()
    );

    if (!selectedField)
      return (
        <div className="bg-white p-4 text-black text-sm dark:bg-[#494949] dark:text-white">
          <p className="italic">
            Config UI for <strong>{selectedType}</strong> coming soon.
          </p>
        </div>
      );

    return (
      <div className="bg-white p-4 text-black space-y-4 text-sm dark:bg-[#494949] dark:text-white">
        {selectedField.params.length > 0 && (
          <>
            <h4 className="font-semibold">Params</h4>
            <div className="space-y-2">
              {selectedField.params.map((p, i) => paramInputType(p, i))}
            </div>
          </>
        )}

        {selectedField.validations.length > 0 && (
          <>
            <h4 className="font-semibold pt-4 border-t">Validations</h4>
            <div className="space-y-2">
              {selectedField.validations.map((v, i) => (
                <div key={i} className="pt-2 border-t">
                  <p className="font-semibold text-sm">{v.name}</p>
                  {v.params?.map((p, j) => paramInputType(p, j))}
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
            {questionTypes.map((type) => (
              <li
                key={type}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleTypeChange(type);
                }}
                className={`cursor-pointer transition select-none ${
                  selectedType === type ? "font-semibold" : ""
                } hover:bg-[#6fb899] px-2 py-1 rounded dark:hover:bg-[#5A5959]`}
              >
                {type}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Config */}
      <div className="mt-5">{typeSelector()}</div>
    </div>
  );
}