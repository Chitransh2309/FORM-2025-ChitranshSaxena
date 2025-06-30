"use client";

import React, { useState } from "react";
import { fieldtypes, FieldType, ParamType } from "@/lib/interface";

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

export default function QuestionTypeDropdown() {
  const [selectedType, setSelectedType] = useState("Text");
  const [isOpen, setIsOpen] = useState(false);
  
  const paramInputType = (param: any, key: number) => {
  const cls = "w-full px-2 py-2 rounded bg-yellow-500 outline-none";

  const input = (type: string) => (
    <input
      key={key}
      type={type}
      placeholder={param.name}
      defaultValue={param.value ?? ""}
      className={cls}
    />
  );

  switch (param.type) {
    case "string":
    case "number":
      return input(param.type);

    case "boolean":
      return (
        <label key={key} className="flex items-center gap-2">
          <input type="checkbox" defaultChecked={!!param.value} className="accent-[#8CC7AA]" />
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
          <input type="date" defaultValue={param.value ?? ""} className={cls} />
        </label>
      );

    case "checkBox":
      return (
        <div key={key} className="flex flex-col gap-1">
          <span>{param.name}</span>
          {[1, 2, 3].map((n) => (
            <label key={n} className="flex items-center gap-2">
              <input type="checkbox" />
              <span>Option {n}</span>
            </label>
          ))}
        </div>
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
        <div className="bg-white p-4 text-black text-sm">
          <p className="italic">
            Config UI for <strong>{selectedType}</strong> coming soon.
          </p>
        </div>
      );

    return (
      <div className="bg-white p-4 text-black space-y-4 text-sm">
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
    <div className="w-full max-w-sm sm:max-w-xs mx-auto relative rounded-xl bg-white shadow dark:bg-[#5A5959] dark:text-white">
      {/* Dropdown Header */}
      <div
        className="bg-[#8CC7AA] rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer dark:bg-[#5A5959] dark:text-white"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="text-black font-medium text-base dark:text-white">
          {selectedType}
        </span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute z-10 w-full bg-[#8CC7AA] text-black rounded-b-xl shadow-lg mt-1 dark:text-white dark:bg-[#494949]">
          <ul className="py-2 px-4 space-y-2 max-h-[200px] overflow-y-auto text-sm">
            {questionTypes.map((type) => (
              <li
                key={type}
                onClick={() => {
                  setSelectedType(type);
                  setIsOpen(false);
                }}
                className={`cursor-pointer transition ${
                  selectedType === type ? "font-semibold" : ""
                } hover:bg-[#6fb899] px-2 py-1 rounded`}
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
