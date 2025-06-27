"use client";

<<<<<<< HEAD:src/components/Form_Page/question-parent.tsx
import React from "react";
import Question from "./questions";
import AddQues from "./add-question";
=======
import React, { useState } from "react";
import Question from "./Questions";
import AddQues from "./AddQuestion";
// import { v4 as uuidv4 } from "uuid";
import { Question as QuestionInterface } from "@/lib/interface"; // Import your actual interface
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard):src/components/FormPage/QuestionParent.tsx

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

export default function QuestionSet({
  ques,
  onAdd,
  onDelete,
  onUpdate,
}: Props) {
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
