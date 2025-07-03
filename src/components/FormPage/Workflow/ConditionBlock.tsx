// components/FormPage/Workflow/ConditionBlock.tsx
import React from "react";
import { Question } from "@/lib/interface";

export type BaseCondition = {
  fieldId: string;
  op: "equal";
  value: string;
};

type Props = {
  allQuestions: Question[];
  condition: BaseCondition;
  onChange: (newCond: BaseCondition) => void;
  onRemove: () => void;
};

export default function ConditionBlock({
  allQuestions,
  condition,
  onChange,
  onRemove,
}: Props) {
  const question = allQuestions.find(
    (q) => q.question_ID === condition.fieldId
  );
  const options =
    question?.type === "DROPDOWN" || question?.type === "MCQ"
      ? question.config?.params.find((p) => p.name === "options")?.value || []
      : [];

  return (
    <div className="overflow-x-auto flex items-center gap-2 border p-2 rounded">
      <select
        value={condition.fieldId}
        onChange={(e) =>
          onChange({ ...condition, fieldId: e.target.value, value: "" })
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
  );
}
