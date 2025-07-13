"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import SectionSidebar from "@/components/FormPage/SectionSidebar";
import RightNav from "@/components/FormPage/RightNav";
import QuestionParent from "@/components/FormPage/QuestionParent";
import getFormObject from "@/app/action/getFormObject";
import { saveFormToDB } from "@/app/action/saveformtodb";
import { Form, Question, Section, QuestionType } from "@/lib/interface";
import { Menu, Pencil } from "lucide-react";
import FAQs from "../NewUserPage/FAQs";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import toast from "react-hot-toast";
import { renameSectionTitle } from "@/app/action/sections";
import  debounce  from "lodash/debounce";

enum sectionform {
  Build,
  Workflow,
  Preview,
}

interface formbuild {
  currentSection: sectionform;
  setCurrentSection: (section: sectionform) => void;
}

export default function BuildPage({
  currentSection,
  setCurrentSection,
}: formbuild) {
  const LABELS = ["Builder", "Workflow", "Preview"];
  const { id: formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);

  const formRef = useRef<Form | null>(form);

  useEffect(() => {
    formRef.current = form;
  }, [form]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [showRightNav, setShowRightNav] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );
  const [showFAQ, setShowFAQ] = useState(false);

  const [saved, setSaved] = useState(0);

  const selectedSection = form?.sections.find(
    (s) => s.section_ID === selectedSectionId
  );

  // Inside your BuildPage component

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  const debouncedSaveForm = React.useCallback(
    debounce(async () => {
      if (!formRef.current) return;

      setSaved(0);

      const res = await saveFormToDB(formRef.current);
      if (!res.success) {
        console.error("Failed to save form response");
      }
    }, 2500),
    []
  );
  useEffect(() => {
    let intervalId: NodeJS.Timeout | null = null;
    intervalId = setInterval(() => {
      setSaved((prev) => prev + 1);
    }, 1000);
    return () => {
      if (intervalId) clearInterval(intervalId);
      debouncedSaveForm.flush(); // Flush pending saves on unmount
    };
  }, []);

  useEffect(() => {
    setEditedTitle(selectedSection?.title || "");
  }, [selectedSectionId]);

  const handleTitleSave = () => {
    if (
      editedTitle.trim() &&
      selectedSection?.section_ID &&
      editedTitle.trim() !== selectedSection.title
    ) {
      handleRenameSection(selectedSection.section_ID, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

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

  const handleRenameSection = async (sectionId: string, newTitle: string) => {
    if (!formId || typeof formId !== "string") return;

    const res = await renameSectionTitle(formId, sectionId, newTitle);

    if (res.success) {
      setForm((prev) => {
        if (!prev) return prev;
        const updatedSections = prev.sections.map((s) =>
          s.section_ID === sectionId ? { ...s, title: newTitle } : s
        );
        return { ...prev, sections: updatedSections };
      });
      toast.success("Section renamed");
    } else {
      toast.error(res.error || "Rename failed");
    }
    debouncedSaveForm();
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
    debouncedSaveForm();
  };

  const addQuestion = () => {
    if (!form || !selectedSectionId) return;

    const newQuestion: Question = {
      question_ID: `q-${Date.now()}`,
      section_ID: selectedSectionId,
      section_ID: selectedSectionId,
      questionText: "",
      isRequired: false,
      order: (selectedSection?.questions.length || 0) + 1,
      type: QuestionType.TEXT,
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
    setSelectedQuestion(newQuestion);
    debouncedSaveForm();
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

    setForm({ ...form, sections: updatedSections });
    if (newSelected) {
      setSelectedQuestion(newSelected);
    }
    debouncedSaveForm();
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
    if (selectedQuestion?.question_ID === id) {
      setSelectedQuestion(null);
    }
    debouncedSaveForm();
  };

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-[90vh] w-full">
      {/* ⬅️ Desktop Sidebar */}
      <div className="hidden lg:flex w-1/3 border-r border-gray-300 dark:border-gray-500 overflow-y-auto h-screen">
        <SectionSidebar
          sections={form?.sections || []}
          selectedSectionId={selectedSectionId}
          setSelectedSectionId={setSelectedSectionId}
          onAddSection={addSection}
          onDeleteSection={deleteSection}
        />
      </div>

      {/* 📝 Main Content */}
      <div className="w-full lg:px-10 overflow-y-auto flex flex-col space-y-6 ">
        {/* Top Tabs */}
       <div className="w-full flex justify-center px-4 sm:px-0 py-[15px]">

          <div className="flex justify-between items-center w-full max-w-[480px] h-[68px] rounded-[10px] dark:bg-[#414141] bg-[#91C4AB]/45 shadow px-2 sm:px-4">
            {LABELS.map((label, i) => (
              <button
                key={label}
                onClick={() => setCurrentSection(i as sectionform)}
                className={`flex-1 mx-1 text-[14px] sm:text-[16px] py-2 rounded-[7px] transition-colors duration-200 ${
                  currentSection === i
                    ? "bg-[#61A986] text-black dark:text-white"
                    : "text-black dark:text-white hover:bg-[#b9d9c8] dark:hover:bg-[#353434]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 📱 Mobile Section Sidebar */}
        <div className="lg:hidden w-full px-4 flex flex-row justify-between items-center">
          <SectionSidebar
            sections={form?.sections || []}
            selectedSectionId={selectedSectionId}
            setSelectedSectionId={setSelectedSectionId}
            onAddSection={addSection}
            onDeleteSection={deleteSection}
          />
          
          <div className="bg-[#91C4AB] p-3 rounded shadow mr-2">
            {saved !== 0 ? <h4>Saved {saved} sec ago</h4> : <h4>Saving...</h4>}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-row justify-between w-full px-10 items-center">
          <div className="flex flex-row justify-center items-center gap-2 mt-6 mb-3">
            {isEditingTitle ? (
              <>
                <input
                  className="text-xl font-semibold border-b border-black dark:border-white bg-transparent focus:outline-none px-1"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleTitleSave();
                    if (e.key === "Escape") {
                      setEditedTitle(selectedSection?.title || "");
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                />
              </>
            ) : (
              <>
                <div className="text-2xl font-bold">
                  {selectedSection?.title || "No Section Selected"}
                </div>
                <button
                  className="pl-2"
                  onClick={() => {
                    setEditedTitle(selectedSection?.title || "");
                    setIsEditingTitle(true);
                  }}
                >
                  <Pencil className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="bg-[#91C4AB] p-3 rounded shadow hidden lg:block mt-3">
            {saved != 0 ? <h4>Saved {saved} sec ago</h4> : <h4>Saving...</h4>}
          </div>
        </div>

        {/* Question List */}
        {selectedSection && (
          <QuestionParent
            ques={selectedSection.questions}
            onUpdate={updateQuestion}
            onDelete={deleteQuestion}
            onAdd={addQuestion}
            selectedQuestion={selectedQuestion}
            setSelectedQuestion={setSelectedQuestion}
            onEditQuestion={() => setShowRightNav(!showRightNav)}
          />
        )}
      </div>

      {/* 🧾 RightNav (desktop) */}
      <div className="hidden lg:block w-1/3 h-full sticky border-l border-gray-300 bg-[#fefefe] dark:bg-[#363535] dark:border-gray-500">
        <RightNav
          selectedQuestion={selectedQuestion}
          onUpdate={updateQuestion}
        />
      </div>

      {/* 📱 Mobile RightNav Overlay */}
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

      {/* FAQ */}
      <FAQs showFaq={showFAQ} setShowFaq={setShowFAQ} />
    </div>
  );
}
