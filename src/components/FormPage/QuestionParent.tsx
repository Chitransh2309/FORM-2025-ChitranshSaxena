"use client";

import React, { useState } from "react";
import Question from "./Questions";
import AddQues from "./AddQuestion";
// import { v4 as uuidv4 } from "uuid";
import { Question as QuestionInterface } from "@/lib/interface"; // Import your actual interface

type Props = {
  ques: QuestionInterface[]; // Use your actual Question interface
  onAdd: () => void; // Changed to match your usage
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: Partial<QuestionInterface>) => void;
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
          key={q.question_ID} // Use the correct property name
          id={q.question_ID} // Use the correct property name
          data={q} // Pass the whole question object
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
      <AddQues onClick={onAdd} />
    </div>
  );
}
