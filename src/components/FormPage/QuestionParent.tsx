"use client";

import React, { useEffect, useMemo, useState } from "react";
import Question from "./Questions";
import AddQues from "./AddQuestion";
import { Question as QuestionInterface } from "@/lib/interface";

type Props = {
  ques: QuestionInterface[];
  onAdd: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<QuestionInterface>) => void;
  selectedQuestion?: QuestionInterface | null;
  setSelectedQuestion?: (question: QuestionInterface) => void;
  onEditQuestion: () => void;
};

export default function QuestionParent({
  ques,
  onAdd,
  onDelete,
  onUpdate,
  selectedQuestion,
  setSelectedQuestion,
  onEditQuestion,
}: Props) {
  const [alertShown, setAlertShown] = useState(false);

  const { sortedQuestions, duplicateIDs } = useMemo(() => {
    const orderMap = new Map<number, string[]>();
    const duplicates = new Set<string>();

    for (const q of ques) {
      const list = orderMap.get(q.order) || [];
      list.push(q.question_ID);
      orderMap.set(q.order, list);
    }

    orderMap.forEach((ids) => {
      if (ids.length > 1) {
        ids.forEach((id) => duplicates.add(id));
      }
    });

    const sorted = [...ques].sort((a, b) => a.order - b.order);

    return {
      sortedQuestions: sorted,
      duplicateIDs: duplicates,
    };
  }, [ques]);

  useEffect(() => {
    if (duplicateIDs.size > 0 && !alertShown) {
      alert("⚠ Multiple questions have the same order value! Highlighted in red.");
      setAlertShown(true);
    }
  }, [duplicateIDs, alertShown]);

  return (
    <div>
      {sortedQuestions.map((q) => (
        <div
          key={q.question_ID}
          onClick={() => setSelectedQuestion?.(q)}
          className={`cursor-pointer ${
            duplicateIDs.has(q.question_ID) ? "border-md border-red-500 rounded-xl" : ""
          }`}
        >
          <Question
            id={q.question_ID}
            data={q}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isSelected={selectedQuestion?.question_ID === q.question_ID}
            isDuplicate={duplicateIDs.has(q.question_ID)}
            onEditQuestion = {onEditQuestion}
          />
        </div>
      ))}
      <AddQues onClick={onAdd} />
    </div>
  );
}
