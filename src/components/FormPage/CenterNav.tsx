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
    <div className="relative w-full min-h-screen flex flex-col bg-[#F6F8F6] dark:bg-[#2B2A2A] dark:text-white overflow-hidden font-[Outfit]">
      {/* Top tab nav */}
      <div className="flex justify-center mt-6 px-4 sm:px-0">
        <div className="flex justify-between items-center w-full max-w-[480px] h-[58px] rounded-[10px] dark:bg-[#414141] shadow-[0px_0px_4px_rgba(0,0,0,0.5)] bg-[#91C4AB]/45 px-2 sm:px-4">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentSection(i as Section)}
              className={`flex-1 mx-1 text-[15px] dark:text-white sm:text-[16px] py-2 rounded-[7px] transition-colors duration-200 ${
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
      <div className="w-full flex-grow overflow-auto mt-6 px-2 sm:px-4">
        {currentSection === Section.Builder && <BuildForm />}
        {/* {currentSection === Section.Workflow && (
          <WorkflowPage form_ID={formId} />
          // <div className="p-4 sm:p-6">
          //   <h2 className="text-xl font-semibold mb-4 dark:text-white">
          //     🔁 Workflow View
          //   </h2>
          //   <p className="dark:text-white">
          //     This is the form workflow configuration.
          //   </p>
          // </div>
        )} */}
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
