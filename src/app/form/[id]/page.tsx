"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import SectionSidebar from "@/components/SectionSidebar";
import CenterNav from "@/components/center-nav";
import RightNav from "@/components/right-nav";
import SaveButton from "@/components/savebutton";
import QuestionParent, { QuestionType } from "@/components/question-parent";

import {
  saveQuestionsToDB,
  getSectionsAndQuestions,
  deleteQuestionFromDB,
} from "@/app/action/questions";

import {
  createOrUpdateSection,
  saveSectionsToDB,
  deleteSection,
} from "@/app/action/sections";

import { createFormIfNotExists } from "@/app/action/forms";

import {Section} from "@/lib/interface"


export default function BuildPage() {
  const { id: formId } = useParams();
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [nextQId, setNextQId] = useState(1);

  const selectedSection = sections.find(
    (s) => s.section_ID === selectedSectionId
  );

  // Load form, sections and questions
  useEffect(() => {
    const loadData = async () => {
      if (!formId || typeof formId !== "string") return;

      // Ensure form exists
      await createFormIfNotExists(formId);

      const res = await getSectionsAndQuestions(formId);
      if (res.success && Array.isArray(res.data)) {
        const loadedSections: Section[] = res.data;
        setSections(loadedSections);
        setSelectedSectionId(loadedSections[0]?.section_ID || null);

        const allQs = loadedSections.flatMap((s) => s.questions);
        const maxId = allQs.reduce((max, q) => Math.max(max, q.id ?? 0), 0);
        setNextQId(maxId + 1);
      } else {
        alert("❌ Failed to load form data");
      }
    };

    loadData();
  }, [formId]);

  const addSection = async () => {
    if (!formId || typeof formId !== "string") return;

    const index = sections.length + 1;
    const newId = `section-${index}`;
    const newSection: Section = {
      section_ID: newId,
      form_ID: formId,
      title: `Section ${index}`,
      description: "",
      questions: [],
    };

    const res = await createOrUpdateSection(newSection);
    if (res.success) {
      setSections((prev) => [...prev, newSection]);
      setSelectedSectionId(newId);
    } else {
      alert("❌ Failed to add section");
    }
  };

  const deleteCurrentSection = async () => {
    if (!selectedSectionId) return;

    const confirm = window.confirm("Are you sure you want to delete this section?");
    if (!confirm) return;

    const res = await deleteSection(selectedSectionId);
    if (res.success) {
      setSections((prev) => prev.filter((s) => s.section_ID !== selectedSectionId));
      const remaining = sections.filter((s) => s.section_ID !== selectedSectionId);
      setSelectedSectionId(remaining[0]?.section_ID || null);
    } else {
      alert("❌ Failed to delete section");
    }
  };

  const addQuestion = () => {
    if (!selectedSectionId) return;

    const updated = sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: [
              ...section.questions,
              {
                id: nextQId,
                label: "",
                content: "",
                required: false,
              },
            ],
          }
        : section
    );

    setSections(updated);
    setNextQId((prev) => prev + 1);
  };

  const updateQuestion = (id: number, updates: Partial<QuestionType>) => {
    if (!selectedSectionId) return;

    const updated = sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: section.questions.map((q) =>
              q.id === id ? { ...q, ...updates } : q
            ),
          }
        : section
    );

    setSections(updated);
  };

  const handleSave = async () => {
    if (!formId || !selectedSectionId) return;

    const section = sections.find((s) => s.section_ID === selectedSectionId);
    if (!section) return;

    await saveSectionsToDB([
      {
        section_ID: section.section_ID,
        form_ID: formId as string,
        title: section.title,
        description: section.description,
      },
    ]);

    const formatted = section.questions.map((q, idx) => ({
      question_ID: `q-${q.id}`,
      order: idx + 1,
      section_ID: section.section_ID,
      form_ID: formId as string,
      type: "text",
      questionText: q.content,
      isRequired: q.required,
    }));

    const res = await saveQuestionsToDB(formatted);
    if (res.success) {
      alert("✅ Saved to DB");
    } else {
      alert("❌ Failed to save questions");
    }
  };

  const deleteQuestion = async (id: number) => {
    if (!selectedSectionId) return;

    const section = sections.find((s) => s.section_ID === selectedSectionId);
    const question = section?.questions.find((q) => q.id === id);
    const isUnsaved = !question?.label && !question?.content;

    const updated = sections.map((section) =>
      section.section_ID === selectedSectionId
        ? {
            ...section,
            questions: section.questions.filter((q) => q.id !== id),
          }
        : section
    );

    setSections(updated);

    if (!isUnsaved) {
      const res = await deleteQuestionFromDB(`q-${id}`);
      if (!res.success) {
        alert("❌ Failed to delete from DB");
      }
    }
  };

  return (
    <div className="bg-neutral-100 text-black w-screen h-[92vh] flex font-[Outfit]">
      <SectionSidebar
        sections={sections}
        selectedSectionId={selectedSectionId}
        setSelectedSectionId={setSelectedSectionId}
        onAddSection={addSection}
        onDeleteSection={deleteCurrentSection}
      />

      <div className="w-full h-full overflow-auto">
        <div className="flex bg-[#e8ede8] h-screen overflow-hidden">
          <div className="w-full h-full overflow-auto">
            <CenterNav />

            <div className="flex flex-row justify-between items-center">
              <div className="text-2xl font-bold ml-[5%] mb-3 mt-9 p-4">
                {selectedSection?.title || "No Section Selected"}
              </div>
              <div className="mr-5 mt-9 mb-3 p-4">
                <SaveButton onClick={handleSave} />
              </div>
            </div>

            {selectedSection && (
              <QuestionParent
                ques={selectedSection.questions}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                onAdd={addQuestion}
              />
            )}
          </div>

          <div className="w-[34vw] h-[92vh] bg-white border-l-2 border-black-200">
            <RightNav />
          </div>
        </div>
      </div>
    </div>
  );
}
