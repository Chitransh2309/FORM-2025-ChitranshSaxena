"use client";

import React, { useState } from "react";
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
};

export default function QuestionParent({
  ques,
  onAdd,
  onDelete,
  onUpdate,
  selectedQuestion,
  setSelectedQuestion,
}: Props) {
  return (
    <div>
      {ques.map((q) => (
        <div 
          key={q.question_ID}
          onClick={() => setSelectedQuestion?.(q)} 
          className="cursor-pointer"
        >
          <Question
            id={q.question_ID}
            data={q}
            onUpdate={onUpdate}
            onDelete={onDelete}
            isSelected={selectedQuestion?.question_ID === q.question_ID}
          />
        </div>
      ))}
      <AddQues onClick={onAdd} />
    </div>
  );
}