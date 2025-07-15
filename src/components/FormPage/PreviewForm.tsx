"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import getFormObject from "@/app/action/getFormObject";
import {
  Form,
  Question,
  QuestionType,
  Answer,
  SectionForm,
} from "@/lib/interface";
import { validateAnswer } from "@/lib/validation";
import FAQs from "../NewUserPage/FAQs";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

// Dynamic Input Renderer (Preview Mode, with validation)
const DynamicPreviewInput = ({
  question,
  value,
  onChange,
  error,
}: {
  question: Question;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const baseInputClass =
    "w-full px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]";

  // MCQ Options
  const options =
    (question.config?.params?.find((p) => p.name === "options")
      ?.value as string[]) || [];

  // MCQ min/max
  const minSelections =
    (question.config?.params?.find((p) => p.name === "min")?.value as number) ||
    0;
  const maxSelections =
    (question.config?.params?.find((p) => p.name === "max")?.value as number) ||
    options.length;

  // Date config
  const includeTime = !!question.config?.params?.find(
    (p) => p.name === "includeTime"
  )?.value;
  const dateRange = question.config?.validations?.find(
    (v) => v.name === "dateRange"
  );
  const minDate = dateRange?.params?.find((p) => p.name === "minDate")
    ?.value as string | number | undefined;
  const maxDate = dateRange?.params?.find((p) => p.name === "maxDate")
    ?.value as string | number | undefined;

  switch (question.type) {
    case QuestionType.TEXT:
      return (
        <>
          <input
            type="text"
            placeholder={
              (question.config?.params?.find((p) => p.name === "placeholder")
                ?.value as string) || "Type your answer"
            }
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
    case QuestionType.EMAIL:
      return (
        <>
          <input
            type="email"
            placeholder="Enter your email address"
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
    case QuestionType.URL:
      return (
        <>
          <input
            type="url"
            placeholder="Enter a URL (e.g., https://example.com)"
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
    case QuestionType.DATE:
      return (
        <>
          <input
            type={includeTime ? "datetime-local" : "date"}
            min={minDate}
            max={maxDate}
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
    case QuestionType.MCQ: {
      const selectedValues = value
        ? value.split(",").filter((v) => v.trim())
        : [];
      const isMultiSelect = maxSelections > 1;

      const handleOptionChange = (option: string, checked: boolean) => {
        let newSelection = [...selectedValues];
        if (isMultiSelect) {
          if (checked) {
            if (newSelection.length < maxSelections) {
              newSelection.push(option);
            }
          } else {
            newSelection = newSelection.filter((v) => v !== option);
          }
        } else {
          newSelection = checked ? [option] : [];
        }
        onChange(newSelection.join(","));
      };

      return (
        <div className="space-y-2 ">
          {options.map((option, index) => (
            <label
              key={index}
              className="flex items-center space-x-2 cursor-pointer"
            >
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
                ? `Select at least ${minSelections} option${
                    minSelections > 1 ? "s" : ""
                  }`
                : "Please select an option"}
            </p>
          )}
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </div>
      );
    }
    case QuestionType.DROPDOWN:
      return (
        <>
          <select
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">Select an option</option>
            {options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
            {options.length === 0 && (
              <option value="" disabled>
                No options available
              </option>
            )}
          </select>
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
    // Inside your DynamicPreviewInput (or wherever you render linear scale):

    case QuestionType.LINEARSCALE: {
      const min =
        (question.config?.params?.find((p) => p.name === "min")
          ?.value as number) || 1;
      const max =
        (question.config?.params?.find((p) => p.name === "max")
          ?.value as number) || 5;
      const minLabel =
        (question.config?.params?.find((p) => p.name === "minLabel")
          ?.value as string) || "";
      const maxLabel =
        (question.config?.params?.find((p) => p.name === "maxLabel")
          ?.value as string) || "";

      const range = Array.from({ length: max - min + 1 }, (_, i) => min + i);
      const selected = value ? Number(value) : null;

      return (
        <div className="space-y-2 mt-4">
          <div className="flex items-center gap-4">
            {minLabel && <span className="text-xs">{minLabel}</span>}
            {range.map((val) => (
              <label
                key={val}
                className="flex flex-col items-center cursor-pointer"
                style={{ userSelect: "none" }}
              >
                <input
                  type="radio"
                  name={`linear-scale-${question.question_ID}`}
                  value={val}
                  checked={selected === val}
                  onChange={() => onChange(val.toString())}
                  className="hidden"
                />
                <span
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2
                ${
                  selected === val
                    ? "bg-[#8CC7AA] border-[#64ad8b]"
                    : "bg-white border-gray-400"
                }
                hover:border-[#8CC7AA] transition-all`}
                  style={{ fontSize: "1.1rem" }}
                >
                  {selected === val ? (
                    <span className="w-4 h-4 bg-white rounded-full block" />
                  ) : null}
                </span>
                <span className="text-xs mt-1">{val}</span>
              </label>
            ))}
            {maxLabel && <span className="text-xs">{maxLabel}</span>}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Scale: {min} to {max}{" "}
            {selected !== null && `| Selected: ${selected}`}
          </div>
        </div>
      );
    }

    default:
      return (
        <>
          <input
            type="text"
            placeholder="Type your answer"
            className={`${baseInputClass} h-[42px]`}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {error && <div className="text-red-500 text-xs mt-1">{error}</div>}
        </>
      );
  }
};

interface formbuild {
  currentSection: SectionForm;
  setCurrentSection: (section: SectionForm) => void;
  form: Form | undefined;
}

export default function PreviewForm({
  currentSection,
  setCurrentSection,
  form,
}: formbuild) {
  const { id: formId } = useParams();
  const [showFaq, setShowFaq] = useState(false);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const LABELS = ["Builder", "Workflow", "Preview"];

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loadedForm, setLoadedForm] = useState<Form | null>(null);

  const section = loadedForm?.sections?.[sectionIndex];

  useEffect(() => {
    const loadForm = async () => {
      if (!formId || typeof formId !== "string") return;

      const res = await getFormObject(formId);
      if (res.success && res.data) {
        setLoadedForm(res.data);
        setSectionIndex(0);
        setAnswers([]);
        setErrors({});
      } else {
        alert("❌ Failed to load form.");
      }
    };

    if (currentSection === SectionForm.Preview) {
      loadForm();
    }
  }, [currentSection, formId]);

  // Simulate answer state for preview
  const handleInputChange = (questionId: string, value: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.question_ID !== questionId);
      return [
        ...filtered,
        {
          answer_ID: questionId + "-preview",
          question_ID: questionId,
          value,
          updatedAt: new Date(),
        },
      ];
    });

    // Find the question
    const question = section?.questions.find(
      (q) => q.question_ID === questionId
    );
    if (question) {
      const answer: Answer = {
        answer_ID: questionId + "-preview",
        question_ID: questionId,
        value,
        updatedAt: new Date(),
      };
      const result = validateAnswer(question, answer);
      setErrors((prev) => ({
        ...prev,
        [questionId]: result.errors.length > 0 ? result.errors[0] : "",
      }));
    }
  };

  const goNext = () => {
    if (loadedForm && sectionIndex < loadedForm.sections.length - 1) {
      setSectionIndex(sectionIndex + 1);
      setErrors({});
    }
  };

  const goBack = () => {
    if (sectionIndex > 0) {
      setSectionIndex(sectionIndex - 1);
      setErrors({});
    }
  };

  const isLastSection =
    loadedForm && sectionIndex === loadedForm.sections.length - 1;

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#F6F8F6] px-2 py-4 font-[Outfit] w-full overflow-scroll h-full dark:bg-[#2B2A2A]">
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4 sm:px-0">
        <div className="flex justify-between items-center w-full max-w-[480px] h-[68px] rounded-[10px] dark:bg-[#414141] bg-[#91C4AB]/45 shadow px-2 sm:px-4">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentSection(i as SectionForm)}
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
      <div
        className={`pt-[130px] md:pt-0 w-full ${
          selectedDevice === "mobile" ? "max-w-[375px] scale-[0.95]" : "w-[80%]"
        } mx-auto px-2 sm:px-4 transition-all duration-300 ease-in-out`}
      >
        {!form || !section ? (
          <div className="w-full text-center mt-20 text-lg font-semibold">
            No form or section data available.
          </div>
        ) : (
          <>
            {/* Device Switcher (unique to preview) */}
            <div className="hidden md:flex items-center justify-between px-2 mb-6 w-full max-w-[200px] h-[62px] mt-20 rounded-[10px] mx-auto shadow-[0px_0px_4px_rgba(0,0,0,0.5)] bg-[#91C4AB]/45 dark:bg-[#414141]">
              {["desktop", "mobile"].map((device) => (
                <button
                  key={device}
                  onClick={() =>
                    setSelectedDevice(device as "desktop" | "mobile")
                  }
                  className={`cursor-pointer w-[70px] h-[44px] rounded-[7px] flex items-center justify-center transition-colors duration-200 ${
                    selectedDevice === device ? "bg-[#61A986]" : ""
                  }`}
                >
                  <Image
                    src={`/${device}-icon-light.svg`}
                    alt={device}
                    width={device === "desktop" ? 32 : 23}
                    height={27}
                    style={{
                      filter:
                        selectedDevice === device ? "none" : "brightness(0)",
                    }}
                  />
                </button>
              ))}
            </div>
            {/* === FORM HEADER === */}
            <div className=" w-full bg-white rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 sm:px-6 py-6 flex flex-col justify-between mb-6 dark:bg-[#5A5959] dark:text-white">
              <h2 className="text-black mb-1 font-[Outfit] font-semibold text-[25px] leading-[100%] tracking-[0%] dark:text-white">
                {form.title || "Untitled Form"}
              </h2>
              <p className="text-black text-[16px] sm:text-[20px] font-normal leading-[100%] mb-6 sm:mb-12 dark:text-white">
                {form.description || "No description provided"}
              </p>
              <hr className="border-t border-black mb-2 dark:border-white" />
              <p className="text-[#676767] font-[Outfit] font-normal text-[20px] leading-[100%] tracking-[0%] dark:text-white">
                <span className="text-red-500">*</span> implies compulsory
              </p>
            </div>

            {/* === SECTION BODY === */}
            <div className="w-full bg-white px-4 sm:px-6 py-6 shadow-[0_0_10px_rgba(0,0,0,0.3)] rounded-[8px] dark:bg-[#5A5959] dark:text-white">
              <h3 className="text-lg sm:text-xl font-semibold mb-6 text-black font-[Outfit] dark:text-white">
                {section.title}
              </h3>

              {section.questions.map((q) => (
                <div
                  key={q.question_ID}
                  className="mb-6 w-full bg-white rounded-[10px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 py-3 dark:bg-[#353434]"
                >
                  <label
                    className="block text-black text-[16px] sm:text-[20px] font-normal leading-[100%] mb-2 font-[Outfit] dark:text-white"
                    style={{ textShadow: "0.3px 0.6px 1px rgba(0, 0, 0, 0.1)" }}
                  >
                    {q.questionText}{" "}
                    {q.isRequired && <span className="text-red-500">*</span>}
                  </label>
                  <DynamicPreviewInput
                    question={q}
                    value={
                      answers.find((a) => a.question_ID === q.question_ID)
                        ?.value || ""
                    }
                    onChange={(value) =>
                      handleInputChange(q.question_ID, value)
                    }
                    error={errors[q.question_ID]}
                  />
                  {/* Config summary for preview */}
                  <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                    <span className="italic">Type: {q.type}</span>
                    {q.type === "DATE" && (
                      <>
                        {q.config?.validations?.find(
                          (v) => v.name === "dateRange"
                        ) && (
                          <>
                            {" | Range: "}
                            {q.config.validations
                              .find((v) => v.name === "dateRange")
                              ?.params?.find((p) => p.name === "minDate")
                              ?.value || "Any"}
                            {" to "}
                            {q.config.validations
                              .find((v) => v.name === "dateRange")
                              ?.params?.find((p) => p.name === "maxDate")
                              ?.value || "Any"}
                          </>
                        )}
                      </>
                    )}
                    {q.type === "MCQ" && (
                      <span>
                        {" | Min: "}
                        {q.config?.params?.find((p) => p.name === "min")
                          ?.value || 0}
                        {", Max: "}
                        {q.config?.params?.find((p) => p.name === "max")
                          ?.value ||
                          (
                            q.config?.params?.find((p) => p.name === "options")
                              ?.value as string[]
                          )?.length ||
                          0}
                      </span>
                    )}
                  </div>
                </div>
              ))}

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mt-4 flex-wrap gap-3 mb-10">
                {sectionIndex > 0 && (
                  <button
                    onClick={goBack}
                    className="cursor-pointer min-w-[90px] h-[34px] sm:w-[108px] sm:h-[30px] bg-[#91C4AB] active:bg-[#61A986] text-black rounded-[7px] font-[Outfit] font-medium text-[14px] sm:text-[16px]"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={
                    isLastSection ? () => alert("Preview Complete") : goNext
                  }
                  className="cursor-pointer min-w-[90px] h-[34px] sm:w-[108px] sm:h-[30px] bg-[#91C4AB] active:bg-[#61A986] text-black rounded-[7px] font-[Outfit] font-medium text-[14px] sm:text-[16px] right-0 ml-auto"
                >
                  {isLastSection ? "Submit" : "Next"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* FAQ Button - Mobile Only */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          className="flex items-center justify-center w-12 h-12 text-black rounded-full dark:text-white hover:shadow-xl transition-shadow"
          onClick={() => setShowFaq(true)}
        >
          <HiOutlineQuestionMarkCircle className="w-6 h-6" />
        </button>
      </div>

      {/* FAQ Modal Component */}
      <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />
    </div>
  );
}
