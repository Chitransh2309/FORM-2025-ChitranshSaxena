'use client';

import React, { useState } from "react";
import CenterNav from "../../components/center-nav";
import QuestionParent from "../../components/question-parent";
import RightNav from "../../components/right-nav";
import SectionButton from "../../components/sectionbutton";
import Save from "../../components/savebutton";
import { saveQuestionsToDB } from "@/app/action/savequestions";

import "./page.module.css";

export type QuestionType = {
  id: number;
  label: string;
  content: string;
  required: boolean;
};

export default function BuildPage() {
  const [ques, setQues] = useState<QuestionType[]>([{
    id: 1,
    label: "",
    content: "",
    required: false,
  }]);
  const [nextId, setNextId] = useState(2);

  const addQuestion = () => {
    setQues(prev => [
      ...prev,
      {
        id: nextId,
        label: "",
        content: "",
        required: false,
      }
    ]);
    setNextId(prev => prev + 1);
  };

  const deleteQuestion = (id: number) => {
    setQues(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id: number, updates: Partial<QuestionType>) => {
    setQues(prev =>
      prev.map(q => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  const handleSave = async () => {
    const payload = ques.map((q, index) => ({
      question_ID: String(q.id),
      order: index + 1,
      section_ID: "section-1", // or get dynamically
      type: "short-text", // for now hardcoding
      questionText: q.content,
      isRequired: q.required,
    }));

    const result = await saveQuestionsToDB(payload);
    if (result.success) {
      alert(`Saved ${result.insertedCount} questions successfully!`);
    } else {
      alert("Failed to save");
    }
  };

  return (
    <div className="flex bg-[#e8ede8] h-screen overflow-hidden">
      {/* Left Nav */}
      <div className="w-[24vw] h-[92vh] bg-white border-r-2 border-black-200" />

      {/* Middle Part */}
      <div className="w-full h-full overflow-auto">
        <CenterNav />

        {/* Top Row: Section Name + Save Button */}
        <div className="flex flex-row justify-between items-center">
          <div className="text-2xl font-bold ml-[5%] mb-3 mt-9 p-4">
            Section Name
          </div>
          <div className="mr-5 mt-9 mb-3 p-4">
            <Save onClick={handleSave} />
          </div>
        </div>

        {/* Questions */}
        <QuestionParent
          ques={ques}
          onUpdate={updateQuestion}
          onDelete={deleteQuestion}
          onAdd={addQuestion}
        />
        <SectionButton />
      </div>

      {/* Right Nav */}
      <div className="w-[34vw] h-[92vh] bg-white border-l-2 border-black-200">
        <RightNav />
      </div>
    </div>
  );
}
