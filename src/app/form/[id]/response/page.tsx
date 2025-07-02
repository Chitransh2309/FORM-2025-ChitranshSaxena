"use client";
import React, { use, useEffect, useState } from "react";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import getFormObject from "@/app/action/getFormObject";
import { Form, Answer, FormResponse, Question, QuestionType } from "@/lib/interface";
import { saveFormResponse } from "@/app/action/saveformtodb";
import { useSession } from "next-auth/react";
import { nanoid } from "nanoid";
import toast from "react-hot-toast";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";

// Dynamic Input Component based on question type
const DynamicInput = ({ 
  question, 
  value, 
  onChange 
}: { 
  question: Question; 
  value: string; 
  onChange: (value: string) => void; 
}) => {
  const baseInputClass = "w-full px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]";

  switch (question.type) {
    case QuestionType.TEXT:
      const isMultiline = question.config?.params?.find(p => p.name === "multiline")?.value;
      if (isMultiline) {
        return (
          <textarea
            placeholder="Type your answer"
            className={`${baseInputClass} min-h-[100px] resize-vertical`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      }
      return (
        <input
          type="text"
          placeholder={question.config?.params?.find(p => p.name === "placeholder")?.value as string || "Type your answer"}
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case QuestionType.EMAIL:
      return (
        <input
          type="email"
          placeholder="Enter your email address"
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case QuestionType.URL:
      return (
        <input
          type="url"
          placeholder="Enter a URL (e.g., https://example.com)"
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case QuestionType.DATE:
      const includeTime = question.config?.params?.find(p => p.name === "includeTime")?.value;
      return (
        <input
          type={includeTime ? "datetime-local" : "date"}
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );

    case QuestionType.MCQ:
      const options = question.config?.params?.find(p => p.name === "options")?.value as unknown as string[] || [];
      const minSelections = question.config?.params?.find(p => p.name === "min")?.value as number || 0;
      const maxSelections = question.config?.params?.find(p => p.name === "max")?.value as number || options.length;
      const selectedValues = value ? value.split(',').filter(v => v.trim()) : [];
      
      const isMultiSelect = maxSelections > 1;

      const handleOptionChange = (option: string, checked: boolean) => {
        let newSelection = [...selectedValues];
        
        if (isMultiSelect) {
          if (checked) {
            if (newSelection.length < maxSelections) {
              newSelection.push(option);
            }
          } else {
            newSelection = newSelection.filter(v => v !== option);
          }
        } else {
          newSelection = checked ? [option] : [];
        }
        
        onChange(newSelection.join(','));
      };

      return (
        <div className="space-y-2">
          {options.map((option, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer">
              <input
                type={isMultiSelect ? "checkbox" : "radio"}
                name={`question-${question.question_ID}`}
                checked={selectedValues.includes(option)}
                onChange={(e) => handleOptionChange(option, e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
              <span className="text-sm font-medium text-gray-900 dark:text-gray-300">
                {option}
              </span>
            </label>
          ))}
          {minSelections > 0 && (
            <p className="text-xs text-gray-500 dark:text-gray-400">
              {isMultiSelect 
                ? `Select at least ${minSelections} option${minSelections > 1 ? 's' : ''}`
                : 'Please select an option'
              }
            </p>
          )}
        </div>
      );

    case QuestionType.DROPDOWN:
      const dropdownOptions = question.config?.params?.find(p => p.name === "options")?.value as unknown as string[] || [];
      return (
        <select
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select an option</option>
          {dropdownOptions.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      );

    case QuestionType.LINEARSCALE:
      const min = question.config?.params?.find(p => p.name === "min")?.value as number || 1;
      const max = question.config?.params?.find(p => p.name === "max")?.value as number || 5;
      const minLabel = question.config?.params?.find(p => p.name === "minLabel")?.value as string || "";
      const maxLabel = question.config?.params?.find(p => p.name === "maxLabel")?.value as string || "";
      
      const scaleValue = parseInt(value) || min;
      
      return (
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            {minLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{minLabel}</span>}
            {maxLabel && <span className="text-sm text-gray-600 dark:text-gray-400">{maxLabel}</span>}
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium dark:text-white">{min}</span>
            <input
              type="range"
              min={min}
              max={max}
              value={scaleValue}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <span className="text-sm font-medium dark:text-white">{max}</span>
          </div>
          <div className="text-center">
            <span className="text-lg font-semibold text-blue-600 dark:text-blue-400">{scaleValue}</span>
          </div>
        </div>
      );

    default:
      return (
        <input
          type="text"
          placeholder="Type your answer"
          className={`${baseInputClass} h-[42px]`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      );
  }
};

export default function ResponsesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
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
      if (res.success && res.data && res.data.isActive) {
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

  const validateAnswers = () => {
    if (!section) return { isValid: true, errors: [] };
    
    const errors: string[] = [];
    
    for (const question of section.questions) {
      const answer = answers.find((a) => a.question_ID === question.question_ID);
      const value = answer?.value || "";
      
      // Check required fields
      if (question.isRequired && !value.trim()) {
        errors.push(`${question.questionText} is required`);
        continue;
      }
      
      // Validate MCQ minimum selections
      if (question.type === QuestionType.MCQ && value.trim()) {
        const minSelections = question.config?.params?.find(p => p.name === "min")?.value as number || 0;
        const selectedCount = value.split(',').filter(v => v.trim()).length;
        if (minSelections > 0 && selectedCount < minSelections) {
          errors.push(`${question.questionText} requires at least ${minSelections} selection${minSelections > 1 ? 's' : ''}`);
        }
      }
      
      // Add more validation rules as needed
    }
    
    return { isValid: errors.length === 0, errors };
  };

  const handleSubmit = async () => {
    const validation = validateAnswers();
    
    if (!validation.isValid) {
      toast.error(validation.errors[0]); // Show first error
      return;
    }

    const response: FormResponse = {
      response_ID: nanoid(),
      form_ID: formId,
      userId,
      userName: session?.user?.name || "Anonymous",
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
      toast.success("Form Submitted Successfully");
    } else {
      toast.error("Failed to submit form.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        Loading form...
      </div>
    );
  }

  if (!form || !section) {
    return (
      <div className="text-center mt-20 text-lg font-semibold">
        No form or section data available.
      </div>
    );
  }

  return (
    <div className="bg-[#F6F8F6] dark:bg-[#2B2A2A]">
      {showConfetti && <Confetti width={width} height={height} />}
      <div className="flex justify-end pt-5 pr-8">
        <ToggleSwitch />
      </div>
      <div className="relative flex justify-center items-start py-4 font-[Outfit] w-full h-screen">
        <div className=" w-[80%] mx-auto px-2 sm:px-4 transition-all duration-300 ease-in-out dark:bg-[#2B2A2A]">
          <div className="w-full bg-white rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 sm:px-6 py-6 mb-6 dark:bg-[#5A5959] dark:text-white">
            <h2 className="text-black mb-1 font-semibold text-[25px] dark:text-white">
              {form.title || "Untitled Form"}
            </h2>
            <p className="text-black text-[16px] sm:text-[20px] mb-6 sm:mb-12 dark:text-white">
              {form.description || "No description provided"}
            </p>
            <hr className="border-t border-black mb-2 dark:border-white" />
            <p className="text-[#676767] text-[20px] dark:text-white">
              <span className="text-red-500">*</span> implies compulsory
            </p>
          </div>

          <div className="w-full bg-white px-4 sm:px-6 py-6 shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-[8px] dark:bg-[#5A5959] dark:text-white">
            <h3 className="text-lg sm:text-xl font-semibold mb-6 text-black dark:text-white">
              {section.title}
            </h3>

            {section.questions.map((q) => (
              <div
                key={q.question_ID}
                className="mb-6 bg-white rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 py-3 dark:bg-[#353434]"
              >
                <label className="block text-black text-[16px] sm:text-[20px] font-normal leading-[100%] mb-3 font-[Outfit] dark:text-white">
                  {q.questionText}{" "}
                  {q.isRequired && <span className="text-red-500">*</span>}
                </label>
                
                <DynamicInput
                  question={q}
                  value={answers.find((a) => a.question_ID === q.question_ID)?.value || ""}
                  onChange={(value) => handleInputChange(q.question_ID, value)}
                />
              </div>
            ))}

            <div className="flex justify-between mt-4 gap-3 text-black">
              {sectionIndex > 0 && (
                <button
                  onClick={goBack}
                  className="min-w-[90px] bg-[#91C4AB] rounded px-4 py-2 hover:bg-[#7FB39B] transition-colors"
                >
                  Back
                </button>
              )}
              <button
                onClick={isLastSection ? handleSubmit : goNext}
                className="min-w-[90px] bg-[#91C4AB] rounded px-4 py-2 ml-auto hover:bg-[#7FB39B] transition-colors"
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