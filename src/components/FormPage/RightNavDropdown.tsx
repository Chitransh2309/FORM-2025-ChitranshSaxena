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

/* ────────────────────────────────────────────────────────── */
/*  Options shown in the type-selector dropdown               */
/* ────────────────────────────────────────────────────────── */
const questionTypes = [
  { label: "MCQ",          value: QuestionType.MCQ,         field: "mcq" },
  { label: "Text",         value: QuestionType.TEXT,        field: "text" },
  { label: "Dropdown",     value: QuestionType.DROPDOWN,    field: "dropdown" },
  { label: "Date",         value: QuestionType.DATE,        field: "date" },
  { label: "Linear Scale", value: QuestionType.LINEARSCALE, field: "linear_scale" },
  { label: "Email",        value: QuestionType.EMAIL,       field: "email" },
  { label: "Url",          value: QuestionType.URL,         field: "url" },
];

interface Props {
  selectedQuestion?: Question;
  onChangeType?:    (t: QuestionType) => void;
  onUpdateConfig?:  (c: FieldType)     => void;
}

/* ────────────────────────────────────────────────────────── */
/*  Component                                                */
/* ────────────────────────────────────────────────────────── */
export default function QuestionTypeDropdown({
  selectedQuestion,
  onChangeType,
  onUpdateConfig,
}: Props) {
  const [selectedType, setSelectedType] = useState(questionTypes[0].label);
  const [isOpen, setIsOpen]             = useState(false);

  /* keep header text in sync when a different question is selected */
  useEffect(() => {
    if (selectedQuestion?.type) {
      const found = questionTypes.find((qt) => qt.value === selectedQuestion.type);
      setSelectedType(found?.label ?? questionTypes[0].label);
    } else {
      setSelectedType(questionTypes[0].label);
    }
    setIsOpen(false);
  }, [selectedQuestion?.question_ID]);

  /* ────────── helpers ────────── */
  const handleTypeChange = (typeLabel: string) => {
    setSelectedType(typeLabel);
    setIsOpen(false);

    const found = questionTypes.find((qt) => qt.label === typeLabel);
    if (!found) return;

    /* reset config when the type changes */
    if (onUpdateConfig) {
      const selectedField = fieldtypes.find((f) => f.name === found.field);
      if (selectedField) {
        const newConfig: FieldType = {
          ...selectedField,
          params:       selectedField.params.map((p) => ({ ...p })),
          validations:  selectedField.validations.map((v) => ({
            ...v,
            params: v.params?.map((p) => ({ ...p })) ?? [],
          })),
        };
        onUpdateConfig(newConfig);
      }
    }

    onChangeType?.(found.value);
  };

  /* update helpers for params & validations */
  const updateParams = (newParam: Param) => {
    if (!selectedQuestion || !onUpdateConfig) return;
    const oldCfg = selectedQuestion.config as FieldType | undefined;
    const params = oldCfg?.params ?? [];

    const idx = params.findIndex((p) => p.name === newParam.name);
    const updated =
      idx >= 0 ? params.map((p) => (p.name === newParam.name ? newParam : p)) : [...params, newParam];

    onUpdateConfig({ ...oldCfg, params: updated });
  };

  const updateValidation = (
    validationName: string,
    paramName: string,
    newValue: string | number | boolean | string[]
  ) => {
    if (!selectedQuestion || !onUpdateConfig) return;
    const oldCfg         = selectedQuestion.config ?? ({} as FieldType);
    const validationsArr = oldCfg.validations ?? [];

    const vIdx = validationsArr.findIndex((v) => v.name === validationName);
    let newValidations: Validation[];

    if (vIdx >= 0) {
      /* update existing validation */
      const validation   = validationsArr[vIdx];
      const vParams      = validation.params ?? [];
      const pIdx         = vParams.findIndex((p) => p.name === paramName);
      const newParamList =
        pIdx >= 0
          ? vParams.map((p) =>
              p.name === paramName ? { ...p, value: newValue } : p
            )
          : [...vParams, { name: paramName, type: "string", value: newValue }];

      newValidations = validationsArr.map((v) =>
        v.name === validationName ? { ...v, params: newParamList } : v
      );
    } else {
      /* push new validation */
      newValidations = [
        ...validationsArr,
        {
          name: validationName,
          params: [{ name: paramName, type: "string", value: newValue }],
        },
      ];
    }

    onUpdateConfig({ ...oldCfg, validations: newValidations });
  };

  /* render a single <input> (or equivalent) for a Param */
  const renderParamInput = (param: Param & { isValidation?: true; validationName?: string }, key: string) => {
    const cls =
      "w-full px-2 py-2 rounded bg-white outline-none dark:bg-[#5A5959] dark:text-white border-black-500";

    /* value coercion helper */
    const coerce = (type: string, raw: string) => {
      if (type === "number")   return parseInt(raw, 10) || 0;
      if (type === "boolean")  return undefined;           // unused (checkbox)
      return raw;
    };

    /* For validation params delegate to updateValidation */
    if (param.isValidation) {
      const { validationName } = param;
      const ph = param.placeholder ?? param.name;

      const commonProps = {
        key,
        placeholder: ph,
        className: cls,
      };

      switch (param.name) {
        case "contains":
        case "doesnotContain":
          return (
            <input
              {...commonProps}
              type="text"
              value={Array.isArray(param.value) ? param.value.join(", ") : ""}
              onChange={(e) =>
                updateValidation(
                  validationName!,
                  param.name,
                  e.target.value
                    .split(",")
                    .map((s) => s.trim())
                    .filter((s) => s)
                )
              }
            />
          );

        case "min":
        case "max":
          return (
            <input
              {...commonProps}
              type="number"
              value={param.value ?? ""}
              onChange={(e) =>
                updateValidation(validationName!, param.name, parseInt(e.target.value, 10) || 0)
              }
            />
          );

        default:
          if (param.type === "date") {
            return (
              <input
                {...commonProps}
                type="date"
                value={param.value as string | ""}
                onChange={(e) =>
                  updateValidation(validationName!, param.name, e.target.value)
                }
              />
            );
          }
          return (
            <input
              {...commonProps}
              type="text"
              value={param.value ?? ""}
              onChange={(e) =>
                updateValidation(validationName!, param.name, e.target.value)
              }
            />
          );
      }
    }

    /* Otherwise treat as normal Param input */
    switch (param.type) {
      case "string":
        return (
          <input
            key={key}
            type="text"
            placeholder={param.name}
            value={param.value ?? ""}
            className={cls}
            onChange={(e) => updateParams({ ...param, value: e.target.value })}
          />
        );

      case "number":
        return (
          <input
            key={key}
            type="number"
            placeholder={param.name}
            value={param.value ?? ""}
            className={cls}
            onChange={(e) =>
              updateParams({ ...param, value: coerce("number", e.target.value) })
            }
          />
        );

      case "boolean":
        return (
          <label key={key} className="flex items-center gap-2">
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
        return (
          <input
            key={key}
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
                  .filter((s) => s),
              })
            }
          />
        );

      case "date":
        return (
          <input
            key={key}
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

  /* ────────── render the right-side config panel ────────── */
  const typeSelector = () => {
    const found       = questionTypes.find((qt) => qt.label === selectedType);
    const fieldName   = found ? found.field : questionTypes[0].field;
    const fieldSchema = fieldtypes.find((f) => f.name === fieldName);

    if (!fieldSchema) {
      return (
        <div className="bg-white p-4 text-black text-sm dark:bg-[#494949] dark:text-white">
          <p className="italic">{selectedType} configuration not found.</p>
        </div>
      );
    }

    /* helpers returning current values */
    const getParamVal = (name: string) =>
      selectedQuestion?.config?.params?.find((p) => p.name === name)?.value;

    const getValidationVal = (vName: string, pName: string) =>
      selectedQuestion?.config?.validations
        ?.find((v) => v.name === vName)
        ?.params?.find((p) => p.name === pName)?.value;

    return (
      <div className="bg-white p-4 text-black space-y-4 text-sm dark:bg-[#494949] dark:text-white">
        {fieldSchema.params.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Parameters</h4>
            <div className="space-y-2">
              {fieldSchema.params
                .filter(
                  (p) => !(fieldSchema.name === "mcq" && p.name === "options")
                )
                .map((p, i) =>
                  renderParamInput(
                    { ...p, value: getParamVal(p.name) ?? p.value },
                    String(i)
                  )
                )}
            </div>
          </>
        )}

        {fieldSchema.validations.length > 0 && (
          <>
            <h4 className="font-semibold">{selectedType} Validations</h4>
            <div className="space-y-3">
              {fieldSchema.validations.map((v, vi) => (
                <div
                  key={vi}
                  className="border-l-2 border-gray-300 pl-3 dark:border-gray-600"
                >
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
                        },
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

  /* ────────── main render ────────── */
  return (
    <div className="w-full h-full max-w-sm sm:max-w-xs mx-auto relative rounded-xl bg-white dark:bg-[#363535]">
      {/* dropdown header */}
      <div
        className="bg-[#8CC7AA] dark:bg-[#5A5959] dark:text-white rounded-xl px-4 py-3 flex justify-between items-center cursor-pointer"
        onClick={() => setIsOpen((o) => !o)}
      >
        <span className="text-black dark:text-white font-medium text-base">
          {selectedType}
        </span>
        <span className="text-lg">{isOpen ? "▲" : "▼"}</span>
      </div>

      {/* dropdown options */}
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

      {/* config panel */}
      <div className="mt-5">{typeSelector()}</div>
    </div>
  );
}
