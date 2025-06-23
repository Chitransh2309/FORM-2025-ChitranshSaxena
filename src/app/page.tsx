"use client";

import React, { useEffect, useState } from "react";
import SectionSidebar from "../components/SectionSidebar";
import SectionEditor from "../components/SectionEditor";
import { Section, Question, QuestionType } from "../lib/interface";

export default function Page() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );

  // Load sections from MongoDB when the page loads
  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch("/api/sections");
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error("Failed to load sections:", err);
      }
    }
    fetchSections();
  }, []);

  // Add new section and save to MongoDB
  const addSection = async () => {
    const newSection: Section = {
      section_ID: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      description: "",
      questions: [],
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.section_ID);

    // Save to MongoDB
    try {
      await fetch("/api/sections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSection),
      });
    } catch (err) {
      console.error("Failed to save section:", err);
    }
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updated: Partial<Question>
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        const updatedQuestions = section.questions.map((q) =>
          q.question_ID === questionId ? { ...q, ...updated } : q
        );
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        return {
          ...section,
          questions: section.questions.filter(
            (q) => q.question_ID !== questionId
          ),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      question_ID: Date.now().toString() + Math.floor(Math.random() * 1000),
      order: 0,
      section_ID: sectionId,
      type: QuestionType.TEXT,
      questionText: "",
      isRequired: false,
      config: {
        name: "text",
        type: "string",
        params: [],
        validations: [],
      },
    };

    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const selectedSection =
    sections.find((s) => s.section_ID === selectedSectionId) || null;

  return (
    <div>
      <div className="flex h-screen">
        <SectionSidebar
          sections={sections}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          onAddSection={addSection}
        />

        <div className="flex-1 bg-[#FAFAFA] overflow-y-auto">
          <SectionEditor
            section={selectedSection}
            onUpdateQuestion={updateQuestion}
            onDeleteQuestion={deleteQuestion}
            onAddQuestion={addQuestion}
          />
        </div>
      </div>
    </div>
  );
}
