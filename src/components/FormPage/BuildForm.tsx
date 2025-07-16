/**
 * BuildPage.tsx
 *
 * Form-builder main screen — now 100 % responsive:
 * • No horizontal scroll on narrow view-ports
 * • Floating “Add Question” FAB on mobile so the action is always reachable
 */

"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi";
import SectionSidebar from "@/components/FormPage/SectionSidebar";
import RightNav from "@/components/FormPage/RightNav";
import QuestionParent from "@/components/FormPage/QuestionParent";
import getFormObject from "@/app/action/getFormObject";
import { saveFormToDB } from "@/app/action/saveformtodb";
import { Form, Question, Section, QuestionType } from "@/lib/interface";
import { Pencil } from "lucide-react";
import FAQs from "../NewUserPage/FAQs";
import toast from "react-hot-toast";
import { renameSectionTitle } from "@/app/action/sections";
import debounce from "lodash/debounce";

enum SectionForm {
  Builder,
  Workflow,
  Preview,
}

interface FormBuildProps {
  currentSection: SectionForm;
  setCurrentSection: (section: SectionForm) => void;
}

export default function BuildPage({
  currentSection,
  setCurrentSection,
}: FormBuildProps) {
  /* ─────────────────────────────── state ─────────────────────────────── */
  const LABELS = ["Builder", "Workflow", "Preview"];
  const { id: formId } = useParams<{ id: string }>();

  const [form, setForm] = useState<Form>();
  const formRef = useRef<Form | null>(form);
  useEffect(() => void (formRef.current = form), [form]);

  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    null
  );
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(
    null
  );

  const [showRightNav, setShowRightNav] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

  const [saved, setSaved] = useState(0);

  const selectedSection = form?.sections.find(
    (s) => s.section_ID === selectedSectionId
  );

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");

  /* ──────────────────── auto-save with debounce ─────────────────────── */
  const debouncedSaveForm = useCallback(
    debounce(async () => {
      if (!formRef.current) return;

      setSaved(0);
      const res = await saveFormToDB(formRef.current);
      if (!res.success) console.error("Failed to save form");
    }, 2500),
    []
  );

  /* countdown “Saved X sec ago” */
  useEffect(() => {
    const id = setInterval(() => setSaved((p) => p + 1), 1000);
    return () => {
      clearInterval(id);
      debouncedSaveForm.flush();
    };
  }, [debouncedSaveForm]);

  /* ─────────────────────── data loading ─────────────────────────────── */
  useEffect(() => {
    (async () => {
      if (!formId || typeof formId !== "string") return;
      const res = await getFormObject(formId);
      if (res.success && res.data) {
        setForm(res.data);
        setSelectedSectionId(res.data.sections?.[0]?.section_ID ?? null);
      }
    })();
  }, [formId]);

  useEffect(() => setSelectedQuestion(null), [selectedSectionId]);
  useEffect(
    () => setEditedTitle(selectedSection?.title || ""),
    [selectedSectionId, selectedSection?.title]
  );

  /* ───────────────────── theme (dark / light) ───────────────────────── */
  useEffect(() => {
    const stored = localStorage.getItem("theme");
    document.documentElement.classList.toggle("dark", stored === "dark");
  }, []);
  const FaqButton = () => (
    <button
      onClick={() => setShowFAQ(true)}
      className="absolute bottom-5 right-5 md:bottom-6 md:right-6 z-40
                 p-3 rounded-full bg-white dark:bg-gray-700 border border-gray-200
                 dark:border-gray-600 shadow-lg hover:shadow-xl transition"
    >
      <HiOutlineQuestionMarkCircle
        size={24}
        className="text-gray-600 dark:text-gray-300"
      />
    </button>
  );
  /* ─────────────────────── section helpers ──────────────────────────── */
  const addSection = () => {
    if (!form) return;

    const nums = form.sections
      .map((s) => Number(s.section_ID.match(/section-(\d+)/)?.[1] ?? 0))
      .filter(Boolean);

    let next = 1;
    while (nums.includes(next)) next++;

    const newSection: Section = {
      section_ID: `section-${next}`,
      title: `Section ${next}`,
      description: "",
      questions: [],
    };

    setForm({ ...form, sections: [...form.sections, newSection] });
    setSelectedSectionId(newSection.section_ID);
    debouncedSaveForm();
  };

  const deleteSection = (sectionId: string) => {
    if (!form) return;
    const sections = form.sections.filter((s) => s.section_ID !== sectionId);
    setForm({ ...form, sections });
    if (sectionId === selectedSectionId)
      setSelectedSectionId(sections[0]?.section_ID ?? null);
    debouncedSaveForm();
  };

  const handleRenameSection = async (sid: string, title: string) => {
    if (!formId || typeof formId !== "string") return;
    const res = await renameSectionTitle(formId, sid, title);

    if (res.success) {
      setForm((prev) => {
        if (!prev) return prev;
        const sections = prev.sections.map((s) =>
          s.section_ID === sid ? { ...s, title } : s
        );
        return { ...prev, sections };
      });
      toast.success("Section renamed");
    } else toast.error(res.error || "Rename failed");
    debouncedSaveForm();
  };

  /* ───────────────────── question helpers ───────────────────────────── */
  const addQuestion = () => {
    if (!form || !selectedSectionId) return;

    const newQ: Question = {
      question_ID: `q-${Date.now()}`,
      section_ID: selectedSectionId,
      questionText: "",
      isRequired: false,
      order: (selectedSection?.questions.length ?? 0) + 1,
      type: QuestionType.TEXT,
    };

    const sections = form.sections.map((sec) =>
      sec.section_ID === selectedSectionId
        ? { ...sec, questions: [...sec.questions, newQ] }
        : sec
    );

    setForm({ ...form, sections });
    setSelectedQuestion(newQ);
    debouncedSaveForm();
  };

  const updateQuestion = (id: string, u: Partial<Question>) => {
    if (!form || !selectedSectionId) return;
    let newSel: Question | null = null;

    const sections = form.sections.map((sec) =>
      sec.section_ID === selectedSectionId
        ? {
            ...sec,
            questions: sec.questions.map((q) => {
              if (q.question_ID === id) {
                const upd = { ...q, ...u };
                if (selectedQuestion?.question_ID === id) newSel = upd;
                return upd;
              }
              return q;
            }),
          }
        : sec
    );

    setForm({ ...form, sections });
    if (newSel) setSelectedQuestion(newSel);
    debouncedSaveForm();
  };

  const deleteQuestion = (id: string) => {
    if (!form || !selectedSectionId) return;

    const sections = form.sections.map((sec) =>
      sec.section_ID === selectedSectionId
        ? {
            ...sec,
            questions: sec.questions.filter((q) => q.question_ID !== id),
          }
        : sec
    );

    setForm({ ...form, sections });
    if (selectedQuestion?.question_ID === id) setSelectedQuestion(null);
    debouncedSaveForm();
  };

  /* ──────────────────────── render ──────────────────────────────────── */
  return (
    <div className="flex flex-col lg:flex-row h-[92vh] xl:h-[calc(100%-68px)] w-full">
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

      {/* 📝 Main column */}
      <div
        className="w-full lg:px-10 overflow-y-auto overflow-x-hidden
                   flex flex-col space-y-6 h-full max-w-full"
        >
          {/* Top Tabs */}
          <div className="w-full flex justify-center px-4 sm:px-0 py-[15px]">
            <div
              className="flex justify-between items-center w-full max-w-[480px]
                          h-[68px] rounded-[10px] dark:bg-[#414141]
                          bg-[#91C4AB]/45 shadow px-2 sm:px-4"
            >
              {LABELS.map((label, i) => (
                <button
                  key={label}
                  onClick={() => setCurrentSection(i as SectionForm)}
                  className={`flex-1 mx-1 text-[14px] sm:text-[16px] py-2 rounded-[7px] transition-colors
                            duration-200 ${
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
            {saved !== 0 ? <h4>Saved {saved} sec ago</h4> : <h4>Saving…</h4>}
          </div>
        </div>

        {/* Section title + autosave badge (desktop) */}
        <div className="flex flex-row justify-between w-full px-10 items-center">
          <div className="flex flex-row items-center gap-2 mt-6 mb-3">
            {isEditingTitle ? (
              <input
                className="text-xl font-semibold border-b border-black dark:border-white bg-transparent
                           focus:outline-none px-1"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  onBlur={() => {
                    if (
                      editedTitle.trim() &&
                      selectedSection?.section_ID &&
                      editedTitle.trim() !== selectedSection.title
                    )
                      handleRenameSection(
                        selectedSection.section_ID,
                        editedTitle.trim()
                      );
                    setIsEditingTitle(false);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                    if (e.key === "Escape") {
                      setEditedTitle(selectedSection?.title || "");
                      setIsEditingTitle(false);
                    }
                  }}
                  autoFocus
                />
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
              {saved < 1 ? (
                <h4>Saving...</h4>
              ) : saved < 60 ? (
                <h4>Synced moments ago</h4>
              ) : saved < 3600 ? (
                <h4>Synced {Math.floor(saved / 60)} minutes ago</h4>
              ) : (
                <h4>Synced {Math.floor(saved / 3600)} hours ago</h4>
              )}
            </div>
          </div>

          {/* Question list */}
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
        <div
          className="hidden lg:block w-1/3 h-full sticky border-l border-gray-300
                      bg-[#fefefe] dark:bg-[#363535] dark:border-gray-500 overflow-y-auto"
        >
          <RightNav
            selectedQuestion={selectedQuestion}
            onUpdate={updateQuestion}
          />
        </div>

        {/* 📱 RightNav overlay (mobile) */}
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
        {showFAQ && <FAQs showFaq={showFAQ} setShowFaq={setShowFAQ} />}
        {/* FAQ modal */}
        <FaqButton />
      </div>
    </>
  );
}
