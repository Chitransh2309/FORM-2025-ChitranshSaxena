"use client";

import React, { useState, useEffect } from "react";
import {
  QuestionType,
  fieldtypes,
  Question,
  FieldType,
  Param,
  Validation,
} from "@/lib/interface";

const questionTypes = [
  { label: "MCQ", value: QuestionType.MCQ, field: "mcq" },
  { label: "Text", value: QuestionType.TEXT, field: "text" },
  { label: "Dropdown", value: QuestionType.DROPDOWN, field: "dropdown" },
  { label: "Date", value: QuestionType.DATE, field: "date" },
  {
    label: "Linear Scale",
    value: QuestionType.LINEARSCALE,
    field: "linear_scale",
  },
  {
    label: "Linear Scale",
    value: QuestionType.LINEARSCALE,
    field: "linear_scale",
  },
  { label: "Email", value: QuestionType.EMAIL, field: "email" },
  { label: "Url", value: QuestionType.URL, field: "url" },
  {
    label: "File Upload",
    value: QuestionType.FILE_UPLOAD,
    field: "file_upload",
  },
];

type UIParam = Param & {
  placeholder?: string;
  isValidation?: true;
  validationName?: string;
};

interface Props {
  selectedQuestion?: Question;
  onChangeType?: (t: QuestionType, c: FieldType) => void;
  onUpdateConfig?: (c: FieldType) => void;
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
      const found = questionTypes.find(
        (q) => q.value === selectedQuestion.type
      );
      setSelectedType(found?.label ?? questionTypes[0].label);
    } else {
      setSelectedType(questionTypes[0].label);
    }
    setIsOpen(false);
  }, [selectedQuestion?.question_ID]);

  const handleTypeChange = (label: string) => {
    setSelectedType(label);
    setIsOpen(false);

    const found = questionTypes.find((q) => q.label === label);
    if (!found) {
      return;
    }

    console.log("found: ", found.value);
    // onChangeType?.(found.value);

    if (onChangeType) {
      const schema = fieldtypes.find((f) => f.name === found.field);
      if (schema) {
        const fresh: FieldType = {
          ...schema,
          params: schema.params.map((p) => ({ ...p })),
          validations: schema.validations.map((v) => ({
            ...v,
            params: v.params?.map((p) => ({ ...p })) ?? [],
          })),
        };

        onChangeType(found.value, fresh);
      }
    }
  };

  const updateParams = (newParam: Param) => {
    if (!selectedQuestion || !onUpdateConfig) return;
    const cfg = selectedQuestion.config as FieldType | undefined;
    if (!cfg) return;

    const idx = cfg.params.findIndex((p) => p.name === newParam.name);
    const newParams =
      idx >= 0
        ? cfg.params.map((p) => (p.name === newParam.name ? newParam : p))
        : [...cfg.params, newParam];

    onUpdateConfig({ ...cfg, params: newParams });
  };

  const updateValidation = (
    validationName: string,
    paramName: string,
    value: string | number | boolean | string[]
  ) => {
    if (!selectedQuestion || !onUpdateConfig) return;
    const cfg: FieldType = selectedQuestion.config ?? {
      name: "",
      type: "string",
      params: [],
      validations: [],
    };

    const vIdx = cfg.validations.findIndex((v) => v.name === validationName);
    let newValidations: Validation[];

    if (vIdx >= 0) {
      const validation = cfg.validations[vIdx];
      const params = validation.params ?? [];
      const pIdx = params.findIndex((p) => p.name === paramName);

      const newParams =
        pIdx >= 0
          ? params.map((p) => (p.name === paramName ? { ...p, value } : p))
          : [...params, { name: paramName, type: "string", value }];

      newValidations = cfg.validations.map((v) =>
        v.name === validationName ? { ...v, params: newParams as Param[] } : v
      );
    } else {
      newValidations = [
        ...cfg.validations,
        {
          name: validationName,
          params: [{ name: paramName, type: "string", value }],
        },
      ];
    }

    onUpdateConfig({ ...cfg, validations: newValidations });
  };

  const renderParamInput = (param: UIParam, key: string) => {
    const cls =
      "w-full px-2 py-2 rounded bg-white outline-none dark:bg-[#5A5959] dark:text-white";

    const label = (
      <div className="text-xs font-semibold text-gray-600 dark:text-gray-300 capitalize">
        {param.name}
      </div>
    );

    const wrap = (input: React.ReactNode) => (
      <div key={key} className="space-y-1">
        {label}
        {input}
      </div>
    );

    const placeholder = param.placeholder ?? param.name;

    if (param.type === "file") {
      return wrap(
        <>
          <input
            type="file"
            className={cls}
            disabled
            placeholder="Upload disabled in preview"
          />

          {param.value && typeof param.value === "string" && (
            <div className="mt-2">
              {param.value.match(/\.(jpeg|jpg|gif|png|webp)$/i) ? (
                <img
                  src={param.value}
                  alt="Uploaded file preview"
                  className="max-h-40 rounded border mt-2"
                />
              ) : (
                <a
                  href={param.value}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline mt-2 inline-block"
                >
                  View uploaded file
                </a>
              )}
            </div>
          )}
        </>
      );
    }

    if (param.isValidation) {
      const vn = param.validationName!;

      if (["contains", "doesnotContain"].includes(param.name)) {
        const asText = Array.isArray(param.value) ? param.value.join(", ") : "";
        return wrap(
          <input
            type="text"
            placeholder={placeholder}
            value={asText}
            className={cls}
            onChange={(e) =>
              updateValidation(
                vn,
                param.name,
                e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean)
              )
            }
          />
        );
      }

      if (["min", "max"].includes(param.name)) {
        return wrap(
          <input
            type="number"
            placeholder={placeholder}
            value={String(param.value ?? "")}
            className={cls}
            onChange={(e) =>
              updateValidation(
                vn,
                param.name,
                parseInt(e.target.value, 10) || 0
              )
            }
          />
        );
      }

      if (param.type === "date") {
        return wrap(
          <input
            type="date"
            placeholder={placeholder}
            value={(param.value as string) ?? ""}
            className={cls}
            onChange={(e) => updateValidation(vn, param.name, e.target.value)}
          />
        );
      }

      return wrap(
        <input
          type="text"
          placeholder={placeholder}
          value={String(param.value ?? "")}
          className={cls}
          onChange={(e) => updateValidation(vn, param.name, e.target.value)}
        />
      );
    }

    switch (param.type) {
      case "string":
        return wrap(
          <input
            type="text"
            placeholder={param.name}
            value={String(param.value ?? "")}
            className={cls}
            onChange={(e) => updateParams({ ...param, value: e.target.value })}
          />
        );
      case "number":
        return wrap(
          <input
            type="number"
            placeholder={param.name}
            value={String(param.value ?? "")}
            className={cls}
            onChange={(e) =>
              updateParams({
                ...param,
                value: parseInt(e.target.value, 10) || 0,
              })
            }
          />
        );
      case "boolean":
        return wrap(
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={!!param.value}
              className="accent-[#8CC7AA]"
              onChange={(e) =>
                updateParams({ ...param, value: e.target.checked })
              }
            />
            <span>{param.name}</span>
          </label>
        );
      case "array[string]":
        return wrap(
          <input
            type="text"
            placeholder={`${param.name} (comma-separated)`}
            value={Array.isArray(param.value) ? param.value.join(", ") : ""}
            className={cls}
            onChange={(e) =>
              updateParams({
                ...param,
                value: e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean),
              })
            }
          />
        );
      case "date":
        return wrap(
          <input
            type="date"
            placeholder={param.name}
            value={(param.value as string) ?? ""}
            className={cls}
            onChange={(e) => updateParams({ ...param, value: e.target.value })}
          />
        );
      default:
        return (
          <div key={key} className="italic text-red-600">
            Unsupported type: {param.type}
          </div>
        );
    }
  };

  const typeSelector = () => {
    const fieldName =
      questionTypes.find((q) => q.label === selectedType)?.field ??
      questionTypes[0].field;
    const schema = fieldtypes.find((f) => f.name === fieldName);

    if (!schema) {
      return (
        <div className="bg-white p-4 text-black text-sm dark:bg-[#494949] dark:text-white">
          <p className="italic">{selectedType} configuration not found.</p>
        </div>
      );
    }

    const getParamVal = (n: string) =>
      selectedQuestion?.config?.params?.find((p) => p.name === n)?.value;
    const getValidationVal = (v: string, n: string) =>
      selectedQuestion?.config?.validations
        ?.find((val) => val.name === v)
        ?.params?.find((p) => p.name === n)?.value;

    return (
      <div className="bg-white py-4 px-2 text-black space-y-4 text-sm dark:bg-[#494949] dark:text-white">
        {schema.params.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Parameters</h4>
            <div className="space-y-3">
              {schema.params
                .filter((p) => !(schema.name === "mcq" && p.name === "options"))
                .map((p, i) =>
                  renderParamInput(
                    {
                      ...p,
                      value: getParamVal(p.name) ?? p.value,
                    } as UIParam,
                    String(i)
                  )
                )}
            </div>
          </>
        )}

        {schema.validations.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Validations</h4>
            <div className="space-y-3">
              {schema.validations.map((v, vi) => (
                <div key={vi} className="">
                  <h5 className="font-medium text-sm mb-2 capitalize">
                    {v.name}
                  </h5>
                  <div className="space-y-2">
                    {v.params?.map((p, pi) =>
                      renderParamInput(
                        {
                          ...p,
                          value: getValidationVal(v.name, p.name) ?? p.value,
                          isValidation: true,
                          validationName: v.name,
                          placeholder:
                            p.name === "contains"
                              ? "keyword1, keyword2"
                              : p.name === "doesnotContain"
                              ? "word1, word2"
                              : p.name === "min"
                              ? "Minimum"
                              : p.name === "max"
                              ? "Maximum"
                              : p.name,
                        } as UIParam,
                        `${vi}-${pi}`
                      )
                    )}
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
    <div className="w-full h-full max-w-sm sm:max-w-xs mx-auto relative rounded-xl bg-white dark:bg-[#494949]">
      <div
        className="bg-[#8CC7AA] dark:bg-[#5A5959] dark:text-white rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="text-black dark:text-white font-medium text-base">
          {selectedType}
        </span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full bg-[#8CC7AA] text-black rounded-b-xl shadow-lg mt-1 dark:text-white dark:bg-[#494949]">
          <ul className="py-2 px-4 space-y-2 max-h-52 overflow-y-auto text-sm">
            {questionTypes.map((qt) => (
              <li
                key={qt.label}
                onClick={(e) => {
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

      {/* right-side panel */}
      <div className="">{typeSelector()}</div>
    </div>
  );
}
