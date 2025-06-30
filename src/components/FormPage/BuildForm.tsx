"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SectionSidebar from "@/components/FormPage/SectionSidebar";
import RightNav from "@/components/FormPage/RightNav";
import SaveButton from "@/components/FormPage/SaveButton";
import QuestionParent from "@/components/FormPage/QuestionParent";
import getFormObject from "@/app/action/getFormObject";
import { saveFormToDB } from "@/app/action/saveformtodb";
import { Form, Question, Section } from "@/lib/interface";
import { Menu } from "lucide-react";

export default function BuildPage() {
  const { id: formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showRightNav, setShowRightNav] = useState(false);

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

    const updatedSections = form.sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: [
              ...section.questions,
              {
                question_ID: `q-${Date.now()}`,
                section_ID: section.section_ID,
                questionText: "",
                isRequired: false,
                order: section.questions.length + 1,
              },
            ],
          }
        : section
    );

    setForm({ ...form, sections: updatedSections });
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    if (!form || !selectedSectionId) return;

    const updatedSections = form.sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: section.questions.map((q) =>
              q.question_ID === id ? { ...q, ...updates } : q
            ),
          }
        : section
    );

    setForm({ ...form, sections: updatedSections });
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
    <div className="dark:bg-[#2B2A2A] bg-[#F6F8F6] text-black dark:text-white w-screen h-[90vh] font-[Outfit] flex flex-col lg:flex-row">
      {/* Sidebar always visible */}
      <div className="dark:bg-[#363535] ">
        <SectionSidebar
          sections={form?.sections || []}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          onAddSection={addSection}
          onDeleteSection={deleteSection}
        />
      </div>

      {/* Toggle RightNav for mobile */}
      <div className="lg:hidden flex items-center justify-start px-4 mt-2">
        <button
          className="flex items-center gap-2 bg-[#8cc7aa] text-black py-1 px-3 rounded-md shadow dark:bg-[#353434] dark:text-white"
          onClick={() => setShowRightNav(!showRightNav)}
        >
          <Menu className="w-4 h-4" />
          Edit Question
        </button>
      </div>

      {/* Main content */}
      <div className="w-full flex-1 overflow-auto dark:text-white">
        <div className="flex flex-col lg:flex-row h-full">
          {/* Left content */}
          <div className="w-full lg:w-full px-4 lg:px-10 mt-4">
            <div className="flex flex-row justify-between items-center">
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
              />
            )}
          </div>

          {/* RightNav */}
          <div className="hidden lg:block lg:w-[30vw] h-full border-l dark:bg-[#363535] bg-[#fefefe]">
            <RightNav />
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
                <RightNav />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
