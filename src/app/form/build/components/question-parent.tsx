'use client';

import React, { useState } from "react";
import Question from "./questions";
import AddQues from "./add-question";

export default function QuestionSet() {
  const [ques, setQues] = useState<number[]>([1]);
  const [nextId, setNextId] = useState(2); 

  function SettingQues() {
    setQues((prev) => [...prev, nextId]);
    setNextId((prevId) => prevId + 1);
  }

  function deleteQuestion(id: number) {
    setQues((prev) => prev.filter((q) => q !== id));
  }

  return (
    <div>
      {ques.map((q) => (
        <div key={q}>
          <Question id={q} onDelete={deleteQuestion} />
        </div>
      ))}
      <AddQues onClick={SettingQues} />
    </div>
  );
}
