"use client";

import React, { useState, useEffect } from "react";
<<<<<<< HEAD:src/components/Form_Page/center-nav.tsx
<<<<<<< HEAD:src/components/center-nav.tsx
import PreviewForm from "@/components/preview-form";
=======
import PreviewForm from "@/components/Form_Page/preview-form";
import BuildForm from "@/components/Form_Page/build-form";
>>>>>>> 96613d5 (better organization of components and fixed home button on landing page):src/components/Form_Page/center-nav.tsx
=======
import PreviewForm from "@/components/FormPage/PreviewForm";
import BuildForm from "@/components/FormPage/BuildForm";
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard):src/components/FormPage/CenterNav.tsx

enum Section {
  Builder,
  Workflow,
  Preview,
}

type CenterNavProps = {
  formId?: string;
  showQues: () => void;
  hideQues: () => void;
};

const CenterNav = ({ formId, showQues, hideQues }: CenterNavProps) => {
  const [currentSection, setCurrentSection] = useState<Section>(
    Section.Builder
  );
  const LABELS = ["Builder", "Workflow", "Preview"];

  return (
    <div className="relative w-full h-full flex flex-col bg-[#F6F8F6] overflow-hidden">
      {/* Top tab nav centered */}
      <div className="mt-5 pr-20 absolute space-y-2 left-1/2 transform -translate-x-1/2 z-10 w-full flex justify-center  ">
        <div className="flex justify-between items-center px-4 w-full max-w-[483px] h-[62px] rounded-[10px] shadow-[0px_0px_4px_rgba(0,0,0,0.5)] bg-[#91C4AB]/45">
          {LABELS.map((label, i) => (
            <button
              key={label}
              onClick={() => setCurrentSection(i as Section)}
              className={`cursor-pointer font-[Outfit] text-[16px] sm:text-[18px] w-auto px-5 py-2 rounded-[7px] transition-colors duration-200 ${
                currentSection === i
                  ? "bg-[#61A986] text-black"
                  : "text-black hover:bg-[#b9d9c8]"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Main builder or preview area */}
      <div>
        {currentSection === Section.Builder && <BuildForm />}
        {currentSection === Section.Workflow && (
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">🔁 Workflow View</h2>
            <p>This is the form workflow configuration.</p>
          </div>
        )}
        {currentSection === Section.Preview && (
          <div className="p-6 h-full">
            <PreviewForm formId={formId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterNav;
