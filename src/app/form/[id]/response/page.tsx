"use client";
import React, { use, useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import getFormObject from "@/app/action/getFormObject";
import { Form, Answer, FormResponse } from "@/lib/interface";
import { saveFormResponse } from "@/app/action/saveformtodb";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";

export default function ResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: formId } = use(params);
  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const [form, setForm] = useState<Form | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const section = form?.sections?.[sectionIndex];
  const { data: session } = useSession();
  const userId = session?.user?.id ?? "anonymous";

  const startedAt = React.useRef(new Date());

  useEffect(() => {
    const loadForm = async () => {
      if (!formId || typeof formId !== "string") return;

      setLoading(true);
      const res = await getFormObject(formId);
      if (res.success && res.data&&res.data.isActive) {
        setForm(res.data);
        setSectionIndex(0);
      } else {
        toast.error("Failed to load form.");
      }
      setLoading(false);
    };

    loadForm();
  }, [formId]);

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.question_ID !== questionId);
      return [
        ...filtered,
        {
          answer_ID: nanoid(),
          question_ID: questionId,
          value,
          updatedAt: new Date(),
        },
      ];
    });
  };

  const goNext = () => {
    if (form && sectionIndex < form.sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
    }
  };

  const goBack = () => {
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
    }
  };

  const isLastSection = form && sectionIndex === form.sections.length - 1;

  const handleSubmit = async () => {
    const unansweredRequired = form?.sections.flatMap((s) =>
      s.questions.filter(
        (q) => q.isRequired && !answers.find((a) => a.question_ID === q.question_ID)?.value
      )
    );

    if (unansweredRequired && unansweredRequired.length > 0) {
      toast.error("Please answer all required questions marked with *");
      return;
    }

    const response: FormResponse = {
      response_ID: nanoid(),
      form_ID: formId,
      userId,
      startedAt: startedAt.current,
      submittedAt: new Date(),
      status: "submitted",
      answers,
      version: 1,
    };

    const success = await saveFormResponse(response);

    if (success) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      toast.success("Form Submitted Succesfully")
    } else {
      toast.error("Failed to submit form.");
    }
  };

  if (loading) {
    return <div className="text-center mt-20 text-lg font-semibold">Loading form...</div>;
  }

  if (!form || !section) {
    return <div className="text-center mt-20 text-lg font-semibold">No form or section data available.</div>;
  }

  return (
    <div className="bg-[#F6F8F6] dark:bg-[#2B2A2A]">
    {showConfetti && <Confetti width={width} height={height} />}
    <div className="flex justify-end pt-5 pr-8">
      <ToggleSwitch />
    </div>
    <div className="relative flex justify-center items-start  py-4 font-[Outfit] w-full h-screen ">
      <div className="w-full w-[80%] mx-auto px-2 sm:px-4 transition-all duration-300 ease-in-out dark:bg-[#2B2A2A]">
          <div className="w-full bg-white rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 sm:px-6 py-6 mb-6 dark:bg-[#5A5959] dark:text-white">
            <h2 className="text-black mb-1 font-semibold text-[25px] dark:text-white">{form.title || "Untitled Form"}</h2>
            <p className="text-black text-[16px] sm:text-[20px] mb-6 sm:mb-12 dark:text-white">{form.description || "No description provided"}</p>
            <hr className="border-t border-black mb-2 dark:border-white" />
            <p className="text-[#676767] text-[20px] dark:text-white">
              <span className="text-red-500">*</span> implies compulsory
            </p>
          </div>

        <div className="w-full bg-white px-4 sm:px-6 py-6 shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-[8px] dark:bg-[#5A5959] dark:text-white">
          <h3 className="text-lg sm:text-xl font-semibold mb-6 text-black dark:text-white">{section.title}</h3>

          {section.questions.map((q) => (
            <div key={q.question_ID} className="mb-6 bg-white rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 py-3 dark:bg-[#353434]">
              <label className="block text-black text-[16px] sm:text-[20px] font-normal leading-[100%] mb-2 font-[Outfit] dark:text-white">
                {q.questionText} {q.isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder="Type your answer"
                className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]"
                value={answers.find((a) => a.question_ID === q.question_ID)?.value || ""}
                onChange={(e) => handleInputChange(q.question_ID, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-between mt-4 gap-3 text-black">
            {sectionIndex > 0 && (
              <button onClick={goBack} className="min-w-[90px] bg-[#91C4AB] rounded px-4 py-2">Back</button>
            )}
            <button
              onClick={isLastSection ? handleSubmit : goNext}
              className="min-w-[90px] bg-[#91C4AB] rounded px-4 py-2 ml-auto"
            >
              {isLastSection ? "Submit" : "Next"}
            </button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}


