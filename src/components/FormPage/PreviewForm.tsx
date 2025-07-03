"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import getFormObject from "@/app/action/getFormObject";
import { Form, Section, QuestionType, FieldType, Param } from "@/lib/interface"; // Ensure FieldType and Param are imported
import FAQs from "../NewUserPage/FAQs";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";

export default function PreviewForm() {
  const { id: formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true); // Corrected: useState(true)
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );
  const [showFaq, setShowFaq] = useState(false);
  const section = form?.sections?.[sectionIndex];

  useEffect(() => {
    const loadForm = async () => {
      if (!formId || typeof formId !== "string") return;

      setLoading(true);
      const res = await getFormObject(formId);
      if (res.success && res.data) {
        setForm(res.data);
        setSectionIndex(0);
      } else {
        alert("❌ Failed to load form.");
      }
      setLoading(false);
    };

    loadForm();
  }, [formId]);

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

  // >>>>>> THIS IS THE CORRECTED getOptions FUNCTION <<<<<<
  const getOptions = (config: FieldType | undefined): string[] => {
    if (!config || !config.params) {
      return [];
    }
    const optionsParam = config.params.find(
      (p: Param) => p.name === "options"
    );
    // Ensure optionsParam exists and its value is an array of strings
    if (optionsParam && Array.isArray(optionsParam.value)) {
      return optionsParam.value as string[];
    }
    return [];
  };
  // >>>>>> END OF CORRECTED getOptions FUNCTION <<<<<<


  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#F6F8F6] px-2 py-4 font-[Outfit] w-full overeflow-scroll h-full dark:bg-[#2B2A2A]">
      <div
        className={`w-full ${
          selectedDevice === "mobile" ? "max-w-[375px] scale-[0.95]" : "w-[80%]"
        } mx-auto px-2 sm:px-4 transition-all duration-300 ease-in-out`}
      >
        {/* Device Switcher */}
        <div className="flex items-center justify-between px-2 mb-6 w-full max-w-[200px] h-[62px] rounded-[10px] mx-auto shadow-[0px_0px_4px_rgba(0,0,0,0.5)] bg-[#91C4AB]/45 dark:bg-[#414141]">
          {["desktop", "mobile"].map((device) => (
            <button
              key={device}
              onClick={() => setSelectedDevice(device as "desktop" | "mobile")}
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
                  filter: selectedDevice === device ? "none" : "brightness(0)",
                }}
              />
            </button>
          ))}
        </div>

        {/* === FORM HEADER === */}
        <div className="w-full bg-white rounded-[8px] shadow-[0_0_10px_rgba(0,0,0,0.3)] px-4 sm:px-6 py-6 flex flex-col justify-between mb-6 dark:bg-[#5A5959] dark:text-white">
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

              {/* TEXT TYPE */}
              {q.type === "TEXT" && (
                <input
                  type="text"
                  placeholder="Type your answer"
                  className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]"
                />
              )}

              {/* DATE TYPE */}
              {q.type === "DATE" && (
                <input
                  type="date"
                  className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black outline-none font-[Outfit] dark:text-white dark:bg-[#494949]"
                />
              )}

              {/* EMAIL TYPE */}
              {q.type === "EMAIL" && (
                <input
                  type="email"
                  placeholder="example@email.com"
                  className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]"
                />
             )}

              {/* URL TYPE */}
              {q.type === "URL" && (
                <input
                  type="url"
                  placeholder="https://example.com"
                  className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black placeholder:text-[#676767] outline-none border border-transparent focus:border-gray-300 font-[Outfit] dark:text-white dark:placeholder-white dark:bg-[#494949]"
                />
              )}


              {q.type === "LINEARSCALE" && (
  <div className="space-y-2 mt-4">
    
    {/* Min and Max Labels */}

    {/* Radio Inputs */}
    <div className="flex items-center gap-4 px-2">
      {(() => {
        const min = Number(q.params?.find(p => p.name === "min")?.value ?? 1)
        const max = Number(q.params?.find(p => p.name === "max")?.value ?? 5)
        return Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
          <label
            key={num}
            className="flex flex-col items-center cursor-pointer"
            style={{ userSelect: "none" }}
          >
            <input
              type="radio"
              name={q.question_ID}
              value={num}
              className="hidden peer"
            />
            <span
              className={`
                w-8 h-8 rounded-full flex items-center justify-center border-2
                bg-white border-gray-400 peer-checked:bg-[#8CC7AA] peer-checked:border-[#64ad8b]
                hover:border-[#8CC7AA] transition-all
              `}
            >
              <span className="w-4 h-4 bg-white rounded-full hidden peer-checked:block" />
            </span>
            <span className="text-xs mt-1 text-black dark:text-white">{num}</span>
          </label>
        ))
      })()}
    </div>
  </div>
)}



              {/* MCQ TYPE */}
              {q.type === "MCQ" && (
                <div className="flex flex-col gap-2">
                  {getOptions(q.config).map((opt: string, idx: number) => (
                    <label key={idx} className="flex items-center gap-2 dark:text-white">
                      <input
                        type="radio" // Keeping "radio" as per your current setup for MCQ
                        name={q.question_ID}
                        value={opt}
                        className="form-radio h-4 w-4 text-green-600 transition duration-150 ease-in-out dark:bg-[#494949] dark:border-gray-600"
                      />
                      <span>{opt}</span>
                    </label>
                  ))}
                  {getOptions(q.config).length === 0 && (
                    <p className="text-red-500 text-xs italic">No options configured for this MCQ.</p>
                  )}
                </div>
              )}

              {/* DROPDOWN TYPE */}
              {q.type === "DROPDOWN" && (
                <select className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] text-black font-[Outfit] outline-none dark:text-white dark:bg-[#494949]">
                  <option value="" disabled selected>Select an option</option>
                  {getOptions(q.config).map((opt: string, idx: number) => (
                    <option key={idx} value={opt}>{opt}</option>
                  ))}
                  {getOptions(q.config).length === 0 && (
                    <option value="" disabled>No options available</option>
                  )}
                </select>
              )}
            </div>
          ))}

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center mt-4 flex-wrap gap-3">
            {sectionIndex > 0 && (
              <button
                onClick={goBack}
                className="cursor-pointer min-w-[90px] h-[34px] sm:w-[108px] sm:h-[30px] bg-[#91C4AB] active:bg-[#61A986] text-black rounded-[7px] font-[Outfit] font-medium text-[14px] sm:text-[16px]"
              >
                Back
              </button>
            )}
            <button
              onClick={isLastSection ? () => alert("Form Submitted") : goNext}
              className="cursor-pointer min-w-[90px] h-[34px] sm:w-[108px] sm:h-[30px] bg-[#91C4AB] active:bg-[#61A986] text-black rounded-[7px] font-[Outfit] font-medium text-[14px] sm:text-[16px] right-0 ml-auto"
            >
              {isLastSection ? "Submit" : "Next"}
            </button>
          </div>
        </div>
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