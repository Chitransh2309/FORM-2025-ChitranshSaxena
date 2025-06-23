'use client';

import React, { useState } from "react";
import CenterNav from "../components/center-nav";
import QuestionParent from "../components/question-parent";
import RightNav from "../components/right-nav";
import SectionButton from "../components/sectionbutton";
import Save from "../components/savebutton";

import { saveQuestionsToDB } from "@/app/action/savequestions";
import { deleteQuestionFromDB } from "@/app/action/deletequestion"; // ✅ import Mongo delete

export type QuestionType = {
  id: number;
  label: string;
  content: string;
  required: boolean;
};

export default function BuildPage() {
  const [ques, setQues] = useState<QuestionType[]>([
    {
      id: 1,
      label: "",
      content: "",
      required: false,
    },
  ]);
  const [nextId, setNextId] = useState(2);

  // Add a new blank question
  const addQuestion = () => {
    setQues((prev) => [
      ...prev,
      {
        id: nextId,
        label: "",
        content: "",
        required: false,
      },
    ]);
    setNextId((prev) => prev + 1);
  };

  // Update a field of an existing question
  const updateQuestion = (id: number, updates: Partial<QuestionType>) => {
    setQues((prev) =>
      prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
    );
  };

  // Delete a question from both UI and DB
  const deleteQuestion = async (id: number) => {
    const question = ques.find((q) => q.id === id);
    if (!question) return;

    const isUnsaved = !question.label && !question.content;
    if (isUnsaved) {
      // Just remove from UI
      setQues((prev) => prev.filter((q) => q.id !== id));
      return;
    }

    const question_ID = `q-${id}`;
    const result = await deleteQuestionFromDB(question_ID);
    if (result.success) {
      setQues((prev) => prev.filter((q) => q.id !== id));
    } else {
      alert("❌ Failed to delete from DB: " + result.error);
    }
  };

  // Save all questions to DB (insert or update)
  async function handleSave() {
    const dataToSend = ques.map((q, idx) => ({
      question_ID: `q-${q.id}`,
      order: idx + 1,
      section_ID: "section-1", // Change later for dynamic sections
      type: "text", // You can support "mcq", "checkbox", etc.
      questionText: q.content,
      isRequired: q.required,
    }));

    const result = await saveQuestionsToDB(dataToSend);
    if (result.success) {
      alert(`✅ Saved questions successfully!`);
    } else {
      alert("❌ Failed to save questions. Check console.");
      console.error(result.error);
    }
  }

  return (
<<<<<<< HEAD:src/app/form/build/page.tsx
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
=======
    <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
      <div className="w-full h-full overflow-auto">
        <div className="flex bg-[#e8ede8] h-screen overflow-hidden">
          {/* Left Nav */}
          <div className="w-[24vw] h-[92vh] bg-white border-r-2 border-black-200" />

          {/* Middle Content */}
          <div className="w-full h-full overflow-auto">
            <CenterNav />

            {/* Top Row */}
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

            {/* Add Section Button */}
            <SectionButton />
>>>>>>> 733cd2c (CUD done):src/app/form/page.tsx
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
