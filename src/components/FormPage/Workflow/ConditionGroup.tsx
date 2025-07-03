import { useState } from "react";
import type { Section, ConditionGroup, BaseCondition } from "@/lib/interface";



interface Props {
  group: ConditionGroup;
  onUpdate: (group: ConditionGroup) => void;
  allQuestions: Section["questions"];
}

export default function ConditionGroup({
  group,
  onUpdate,
  allQuestions,
}: Props) {
  const updateCondition = (
    index: number,
    updated: BaseCondition | ConditionGroup
  ) => {
    const newConditions = [...group.conditions];
    newConditions[index] = updated;
    onUpdate({ ...group, conditions: newConditions });
  };

  const removeCondition = (index: number) => {
    const newConditions = group.conditions.filter((_, i) => i !== index);
    onUpdate({ ...group, conditions: newConditions });
  };

  const addBaseCondition = () => {
    const firstQ = allQuestions[0];
    if (!firstQ) return;
    const newCond: BaseCondition = {
      fieldId: firstQ.question_ID,
      op: "equal",
      value: "",
    };
    onUpdate({ ...group, conditions: [...group.conditions, newCond] });
  };

  const addGroup = () => {
    const newGroup: ConditionGroup = { op: "AND", conditions: [] };
    onUpdate({ ...group, conditions: [...group.conditions, newGroup] });
  };

  return (
    <div className="border rounded p-4 space-y-3 bg-gray-50">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-sm font-medium">Group Operator:</span>
        <select
          value={group.op}
          onChange={(e) =>
            onUpdate({ ...group, op: e.target.value as "AND" | "OR" })
          }
          className="border px-2 py-1 rounded"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>
        <button
          onClick={addBaseCondition}
          className="ml-auto text-sm px-2 py-1 bg-blue-500 text-white rounded"
        >
          + Condition
        </button>
        <button
          onClick={addGroup}
          className="text-sm px-2 py-1 bg-green-500 text-white rounded"
        >
          + Group
        </button>
      </div>

      {group.conditions.map((cond, idx) => (
        <div key={idx} className="pl-4 border-l-2 border-gray-300">
          {"fieldId" in cond ? (
            <div className="flex gap-2 items-center">
              <select
                value={cond.fieldId}
                onChange={(e) =>
                  updateCondition(idx, {
                    ...cond,
                    fieldId: e.target.value,
                  })
                }
                className="border rounded px-2 py-1"
              >
                {allQuestions.map((q) => (
                  <option key={q.question_ID} value={q.question_ID}>
                    {q.questionText}
                  </option>
                ))}
              </select>

              <select
                value={cond.op}
                onChange={(e) =>
                  updateCondition(idx, {
                    ...cond,
                    op: e.target.value as BaseCondition["op"],
                  })
                }
                className="border rounded px-2 py-1"
              >
                <option value="equal">equals</option>
              </select>

              <input
                value={cond.value}
                onChange={(e) =>
                  updateCondition(idx, {
                    ...cond,
                    value: e.target.value,
                  })
                }
                className="border rounded px-2 py-1"
                placeholder="Value"
              />
              <button
                onClick={() => removeCondition(idx)}
                className="ml-auto text-sm text-red-600"
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="ml-2">
              <ConditionGroup
                group={cond}
                onUpdate={(newGroup:any) => updateCondition(idx, newGroup)}
                allQuestions={allQuestions}
              />
              <button
                onClick={() => removeCondition(idx)}
                className="ml-auto text-sm text-red-600"
              >
                Remove Group
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
