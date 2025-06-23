"use client";

import React from "react";
import Question from "./questions";
import AddQues from "./add-question";

type Props = {
  ques: QuestionType[];
  onAdd: () => void;
  onDelete: (id: number) => void;
  onUpdate: (id: number, updates: Partial<QuestionType>) => void;
};

export type QuestionType = {
  id: number;
  label: string;
  content: string;
  required: boolean;
};

export default function QuestionSet({ ques, onAdd, onDelete, onUpdate }: Props) {

   return (
    <div>
      {ques.map((q) => (
        <Question
          key={q.id}
          id={q.id}
          data={q}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      <AddQues onClick={onAdd} />
    </div>
  );
}