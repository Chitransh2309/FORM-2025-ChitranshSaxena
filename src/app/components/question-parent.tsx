"use client";

import React, { useState } from "react";
import Question from "./questions";
import AddQues from "./add-question";
import { saveQuestionsToDB } from "../action/savequestions";

export type QuestionType = {
  id: number;
  label: string;
  content: string;
  required: boolean;
};

export default function QuestionSet() {
  const [ques, setQues] = useState<QuestionType[]>([
    { id: 1, label: "", content: "", required: false },
  ]);
  const [nextId, setNextId] = useState(2);

  function AddingQues() {
    setQues(prev => [
      ...prev,
      { id: nextId, label: "", content: "", required: false },
    ]);
    setNextId(prev => prev + 1);
  }

  function deleteQuestion(id: number) {
    setQues(prev => prev.filter(q => q.id !== id));
  }

  function updateQuestion(id: number, updates: Partial<QuestionType>) {
    setQues(prev => prev.map(q => (q.id === id ? { ...q, ...updates } : q)));
  }

  async function handleSave() {
    const dataToSend = ques.map((q, idx) => ({
      question_ID: `q-${q.id}`,
      order: idx + 1,
      section_ID: "section-1", // you can make this dynamic later
      type: "short_text", // or "mcq", "checkbox", etc.
      questionText: q.content,
      isRequired: q.required,
    }));

    const result = await saveQuestionsToDB(dataToSend);
    if (result.success) {
      alert(`Saved ${result.insertedCount} questions successfully!`);
    } else {
      alert("Failed to save questions. Check console.");
      console.error(result.error);
    }
  }

  return (
    <div>
      {ques.map((q) => (
        <div key={q.id}>
          <Question
            id={q.id}
            data={q}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
          />
        </div>
      ))}
      <AddQues onClick={AddingQues} />

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="bg-green-500 text-white hover:bg-green-400 mt-4 p-3 rounded"
      >
        Save All
      </button>
    </div>
  );
}
