"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SectionSidebar from "@/components/FormPage/SectionSidebar";
import RightNav from "@/components/FormPage/RightNav";
import SaveButton from "@/components/FormPage/SaveButton";
import QuestionParent from "@/components/FormPage/QuestionParent";
import getFormObject from "@/app/action/getFormObject";
import { saveFormToDB } from "@/app/action/saveformtodb";
import { Form, Question, Section, QuestionType } from "@/lib/interface";
import { Menu } from "lucide-react";
import FAQs from "../NewUserPage/FAQs";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

export default function BuildPage() {
  const { id: formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showRightNav, setShowRightNav] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showFAQ, setShowFAQ] = useState(false);

  const selectedSection = form?.sections.find(
    (s) => s.section_ID === selectedSectionId
  );

  useEffect(() => {
    const loadData = async () => {
      if (!formId || typeof formId !== "string") return;
      const res = await getFormObject(formId);
      if (res.success) {
        setForm(res.data);
        setSelectedSectionId(res.data.sections?.[0]?.section_ID ?? null);
      }
    };
    loadData();
  }, [formId]);

  // Clear selected question when section changes
  useEffect(() => {
    setSelectedQuestion(null);
  }, [selectedSectionId]);

  const addSection = () => {
    if (!form) return;

    const existingNumbers = form.sections
      .map((s) => {
        const match = s.section_ID.match(/section-(\d+)/);
        return match ? parseInt(match[1]) : 0;
      })
      .filter((num) => num > 0);

    let nextNumber = 1;
    while (existingNumbers.includes(nextNumber)) {
      nextNumber++;
    }

    const newId = `section-${nextNumber}`;
    const newSection: Section = {
      section_ID: newId,
      title: `Section ${nextNumber}`,
      description: "",
      questions: [],
    };

    setForm({
      ...form,
      sections: [...form.sections, newSection],
    });
    setSelectedSectionId(newId);
  };

  const deleteSection = (sectionId: string) => {
    if (!form) return;
    const filteredSections = form.sections.filter(
      (s) => s.section_ID !== sectionId
    );
    setForm({ ...form, sections: filteredSections });
    if (sectionId === selectedSectionId) {
      setSelectedSectionId(filteredSections[0]?.section_ID ?? null);
    }
  };

  const addQuestion = () => {
    if (!form || !selectedSectionId) return;

    const newQuestion: Question = {
      question_ID: `q-${Date.now()}`,
      section_ID: selectedSectionId,
      questionText: "",
      isRequired: false,
      order: (selectedSection?.questions.length || 0) + 1,
      type: QuestionType.TEXT, // Default type
    };

    const updatedSections = form.sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: [...section.questions, newQuestion],
          }
        : section
    );

    setForm({ ...form, sections: updatedSections });

    // Auto-select the new question
    setSelectedQuestion(newQuestion);
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    if (!form || !selectedSectionId) return;

    let newSelected: Question | null = null;

    const updatedSections = form.sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: section.questions.map((q) => {
              if (q.question_ID === id) {
                const updated = { ...q, ...updates };
                // Track the new selected question
                if (selectedQuestion?.question_ID === id) {
                  newSelected = updated;
                }
                return updated;
              }
              return q;
            }),
          }
        : section
    );

    // Apply updates to the form
    setForm({ ...form, sections: updatedSections });

    // Also update the selectedQuestion so RightNav reflects the latest data
    if (newSelected) {
      setSelectedQuestion(newSelected);
    }
  };

  const deleteQuestion = (id: string) => {
    if (!form || !selectedSectionId) return;

    const updatedSections = form.sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: section.questions.filter((q) => q.question_ID !== id),
          }
        : section
    );

    setForm({ ...form, sections: updatedSections });

    // Clear selected question if it was deleted
    if (selectedQuestion?.question_ID === id) {
      setSelectedQuestion(null);
    }
  };

  const handleSave = async () => {
    if (!form) return;

    const res = await saveFormToDB(form);
    if (res.success) {
      alert("✅ Saved successfully");
    } else {
      alert("❌ Failed to save");
    }
  };

  useEffect(() => {
    // Check saved theme on initial mount
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="h-full w-full flex font-[Outfit] dark:bg-[#2B2A2A] bg-[#F6F8F6] text-black dark:text-white overflow-hidden">
      {/* Sidebar always visible */}
      <div className="dark:bg-[#363535] h-full overflow-y-auto w-[1/5] sticky shadow-md">
        <SectionSidebar
          sections={form?.sections || []}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          onAddSection={addSection}
          onDeleteSection={deleteSection}
        />
      </div>

      {/* Mobile controls */}
      <div className="lg:hidden flex items-center justify-start px-4 mt-2">
        <button
          className="flex items-center gap-2 bg-[#8cc7aa] text-black py-1 px-3 rounded-md shadow dark:bg-[#353434] dark:text-white"
          onClick={() => setShowRightNav(!showRightNav)}
        >
          <Menu className="w-4 h-4" />
          Edit Question
        </button>
      </div>

      {/* FAQ Icon - (Mobile Only) */}
      <div className="lg:hidden fixed bottom-6 right-6 z-40">
        <button
          className="flex items-center justify-center w-12 h-12 text-black rounded-full dark:text-white hover:shadow-xl transition-shadow"
          onClick={() => setShowFAQ(true)}
        >
          <HiOutlineQuestionMarkCircle className="w-6 h-6" />
        </button>
      </div>

      {/* Main content */}
      <div className="w-full flex-1 overflow-hidden dark:text-white h-full">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left content */}
          <div className="w-full h-[90vh] px-4 lg:px-10 overflow-y-auto">
            <div className="mt-20 flex flex-row justify-between items-center">
              <div className="text-2xl font-bold mb-3 mt-6">
                {selectedSection?.title || "No Section Selected"}
              </div>
              <div className="mr-2">
                <SaveButton onClick={handleSave} />
              </div>
            </div>

            {selectedSection && (
              <QuestionParent
                ques={selectedSection.questions}
                onUpdate={(id, updates) => updateQuestion(id, updates)}
                onDelete={(id) => deleteQuestion(id)}
                onAdd={() => addQuestion()}
                selectedQuestion={selectedQuestion}
                setSelectedQuestion={setSelectedQuestion}
              />
            )}
          </div>

          {/* RightNav */}
          <div className="hidden lg:block w-[30vw] h-[90vh] sticky border-l border-gray-300 bg-[#fefefe] dark:bg-[#363535] dark:border-gray-500">
            <RightNav
              selectedQuestion={selectedQuestion}
              onUpdate={updateQuestion}
            />
          </div>

          {/* Mobile RightNav Overlay */}
          {showRightNav && (
            <div className="lg:hidden fixed top-0 left-0 w-full h-full bg-white z-50 overflow-y-auto dark:bg-[#2a2b2b]">
              <div className="flex justify-between items-center p-4 border-b dark:border-gray-500">
                <h2 className="text-lg font-semibold">Edit Question</h2>
                <button
                  onClick={() => setShowRightNav(false)}
                  className="text-red-500 font-semibold"
                >
                  Close
                </button>
              </div>
              <div className="p-4">
                <RightNav
                  selectedQuestion={selectedQuestion}
                  onUpdate={updateQuestion}
                />
              </div>
            </div>
          )}

          {/* FAQ Component */}
          <FAQs showFaq={showFAQ} setShowFaq={setShowFAQ} />
        </div>
      </div>
    </div>
  );
}
