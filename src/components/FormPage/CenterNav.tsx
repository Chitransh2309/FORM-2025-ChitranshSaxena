"use client";

import React, { useState } from "react";
import PreviewForm from "@/components/FormPage/PreviewForm";
import BuildForm from "@/components/FormPage/BuildForm";
import WorkflowPage from "./Workflow/WorkflowPage";
enum Section {
  Builder,
  Workflow,
  Preview,
}

const CenterNav = ({ formId }: { formId?: string }) => {
  const [currentSection, setCurrentSection] = useState<Section>(
    Section.Builder
  );
  const LABELS = ["Builder", "Workflow", "Preview"];

  return (
    <div className=" w-full  bg-[#F6F8F6] dark:bg-[#2B2A2A] dark:text-white overflow-hidden font-[Outfit]">
      {/* Top tab nav */}
      {/* Floating tab bar */}
      <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4 sm:px-0">
        <div className="flex justify-between items-center w-full max-w-[480px] h-[68px] rounded-[10px] dark:bg-[#414141] bg-[#91C4AB]/45 shadow px-2 sm:px-4">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentSection(i as Section)}
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

      {/* Main content area */}
      <div className="w-full h-full flex-grow overflow-auto">
        {currentSection === Section.Builder && <BuildForm />}
        {currentSection === Section.Workflow && (
          <WorkflowPage form_ID={formId} />
        )}
        {currentSection === Section.Preview && (
          <div className="p-4 sm:p-6 dark:text-white">
            <PreviewForm formId={formId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterNav;
