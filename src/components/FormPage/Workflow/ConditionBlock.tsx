// components/FormPage/Workflow/ConditionBlock.tsx
import React from "react";
import { Question, Section } from "@/lib/interface";
import { BaseLogic } from "@/lib/interface";

type Props = {
  allSections: Section[];
  allQuestions: Question[];
  condition: BaseLogic;
  onChange: (newCond: BaseLogic) => void;
  onRemove: () => void;
};

export default function ConditionBlock({
  allSections,
  allQuestions,
  condition,
  onChange,
  onRemove,
}: Props) {
  const question = allQuestions.find(
    (q) => q.question_ID === condition.questionID
  );
  const options: string[] =
    question?.type === "DROPDOWN" || question?.type === "MCQ"
      ? (question.config?.params.find((p) => p.name === "options")
          ?.value as string[]) || []
      ? (question.config?.params.find((p) => p.name === "options")
          ?.value as string[]) || []
      : [];

  return (
    <div>
      <div className="overflow-x-auto flex items-center gap-2 border p-2 rounded mb-4">
        <select
          onChange={(e) =>
            onChange({ ...condition, questionID: e.target.value, value: "" })
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">Always Go To</option>
        </select>

        <select className="border px-2 py-1 rounded">
          <option value="">Select Sections</option>
          {allSections.map((s) => (
            <option key={s.section_ID} value={s.section_ID}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto flex items-center gap-2 border p-2 rounded">
        <select
          value={condition.questionID}
          onChange={(e) =>
            onChange({ ...condition, questionID: e.target.value, value: "" })
          }
          className="border px-2 py-1 rounded"
        >
          <option value="">Select question</option>
          {allQuestions.map((q) => (
            <option key={q.question_ID} value={q.question_ID}>
              {q.questionText}
            </option>
          ))}
        </select>

        <select
          value={condition.op}
          onChange={(e) =>
            onChange({ ...condition, op: e.target.value as "equal" })
          }
          className="border px-2 py-1 rounded"
        >
          <option value="equal">equals</option>
        </select>

        {options.length ? (
          <select
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
            className="border px-2 py-1 rounded"
          >
            <option value="">Select</option>
            {options.map((opt: string, idx: number) => (
              <option key={idx} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type="text"
            placeholder="Value"
            value={condition.value}
            onChange={(e) => onChange({ ...condition, value: e.target.value })}
            className="border px-2 py-1 rounded"
          />
        )}

        <button onClick={onRemove} className="text-red-500 text-sm">
          ❌
        </button>
      </div>
    </div>
  );
}
