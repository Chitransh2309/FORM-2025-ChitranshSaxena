"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import getFormObject from "@/app/action/getFormObject";
import { Form, Section } from "@/lib/interface";

export default function PreviewForm() {
  const { id: formId } = useParams();
  const [form, setForm] = useState<Form | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<"desktop" | "mobile">(
    "desktop"
  );

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

  return (
    <div className="relative flex justify-center items-center min-h-screen bg-[#F6F8F6] dark:bg-[#2B2A2A] dark:text-white px-2 py-4 font-[Outfit] w-full overeflow-scroll h-full">
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
        {sectionIndex === 0 && (
          <div className="w-full bg-white dark:bg-[#363535] dark:text-white rounded-[8px] shadow-[0px_0px_4px_0px_#00000040] px-4 sm:px-6 py-6 flex flex-col justify-between mb-6">
            <h2 className="mb-1 font-[Outfit] font-semibold text-[25px] leading-[100%] tracking-[0%]">
              {form.title || "Untitled Form"}
            </h2>
            <p
              className=" text-[16px] sm:text-[20px] font-normal leading-[100%] mb-6 sm:mb-12"
              style={{ textShadow: "0.5px 1px 1.5px rgba(0, 0, 0, 0.20)" }}
            >
              {form.description || "No description provided"}
            </p>
            <hr className="border-t border-black dark:border-white mb-2" />
            <p
              className="text-[#676767] dark:text-gray-400 font-[Outfit] font-normal text-[20px] leading-[100%] tracking-[0%]"
              style={{ textShadow: "0px 0px 4px rgba(0, 0, 0, 0.25)" }}
            >
              <span className="text-red-500">*</span> implies compulsory
            </p>
          </div>
        )}

        {/* === SECTION BODY === */}
        <div className="w-full bg-white dark:bg-[#363535] dark:text-white px-4 sm:px-6 py-6 shadow-[0px_0px_4px_0px_#00000040] rounded-[8px]">
          <h3 className="text-lg sm:text-xl font-semibold mb-6 font-[Outfit]">
            {section.title}
          </h3>

          {section.questions.map((q) => (
            <div
              key={q.question_ID}
              className="mb-6 w-full bg-white dark:bg-[#2B2A2A] rounded-[10px] shadow-[0px_0px_4px_0px_#00000040] px-4 py-3"
            >
              <label
                className="block  text-[16px] sm:text-[20px] font-normal leading-[100%] mb-2 font-[Outfit]"
                style={{ textShadow: "0.3px 0.6px 1px rgba(0, 0, 0, 0.1)" }}
              >
                {q.questionText}{" "}
                {q.isRequired && <span className="text-red-500">*</span>}
              </label>
              <input
                type="text"
                placeholder="Type your answer"
                className="w-full h-[42px] px-3 py-2 rounded-[7px] bg-[#F6F8F6] dark:bg-[#363535] placeholder:text-[#676767] dark:placeholder:text-gray-400 outline-none border border-transparent focus:border-gray-300 font-[Outfit]"
              />
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
    </div>
  );
}
