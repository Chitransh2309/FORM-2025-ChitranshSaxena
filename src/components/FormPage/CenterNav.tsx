"use client";

import React, { useState, useEffect } from "react";
import PreviewForm from "@/components/FormPage/PreviewForm";
import BuildForm from "@/components/FormPage/BuildForm";
import WorkflowPage from "./Workflow/WorkflowPage";
import { Form } from "@/lib/interface";

enum Section {
  Builder,
  Workflow,
  Preview,
}

const CenterNav = ({ form, currentUserEmail, currentUserID }: { 
  form?: Form; 
  currentUserEmail: string; 
  currentUserID?: string; 
}) => {
  const [currentSection, setCurrentSection] = useState<Section>(Section.Builder);
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [isViewer, setIsViewer] = useState<boolean>(false);

  useEffect(() => {
    console.log("=== Editor Check Debug ===");
    console.log("Form:", form);
    console.log("Current User Email:", currentUserEmail);
    console.log("Current User ID:", currentUserID);
    console.log("Form Creator ID:", form?.createdBy);
    console.log("Form Editor IDs:", form?.editorID);
    console.log("Form Viewer IDs:", form?.viewerID);
    
    if (!form || !currentUserID) {
      console.log("No form or current user ID found");
      setIsEditor(false);
      setIsViewer(false);
      return;
    }

    // Check if user is the creator OR in the editorID array
    const isCreator = form.createdBy === currentUserID;
    const isInEditorList = form.editorID?.includes(currentUserID) ?? false;
    const editorCheck = isCreator || isInEditorList;
    const isInViewerList = form.viewerID?.includes(currentUserID) ?? false;

    console.log("Is Creator:", isCreator);
    console.log("Is In Editor List:", isInEditorList);
    console.log("Is In Viewer List:", isInViewerList);
    console.log("Is Editor Result:", editorCheck);
    
    setIsEditor(editorCheck);
    setIsViewer(isInViewerList);
  }, [form, currentUserEmail, currentUserID]);

  console.log("Current isEditor state:", isEditor);
  console.log("Current isViewer state:", isViewer);

  return (
    <div className="w-full bg-[#F6F8F6] dark:bg-[#2B2A2A] dark:text-white overflow-hidden font-[Outfit] h-full">
      {/* Top tab nav */}
      {/* Floating tab bar */}
      {/* <div className="fixed top-[90px] left-1/2 -translate-x-1/2 z-40 w-full flex justify-center px-4 sm:px-0">
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
      </div> */}

      {/* Main content area */}
      <div className="w-full h-full flex-grow overflow-auto">
        {/* Builder Section */}
        {currentSection === Section.Builder ? (
          isEditor ? (
            <BuildForm 
              currentSection={currentSection} 
              setCurrentSection={setCurrentSection} 
            />
          ) : isViewer ? (
            <div className="p-4 sm:p-6 dark:text-white">
              <PreviewForm 
                form={form} 
                currentSection={currentSection} 
                setCurrentSection={setCurrentSection} 
              />
            </div>
          ) : (
            <div className="p-4 text-center">
              <div className="max-w-md mx-auto mt-20 p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <div className="text-4xl mb-4">🚫</div>
                <h2 className="text-xl font-semibold mb-2 text-red-800 dark:text-red-200">
                  Access Denied
                </h2>
                <p className="text-red-600 dark:text-red-300 mb-4">
                  You don't have permission to access this form.
                </p>
                <div className="text-sm text-red-500 dark:text-red-400 space-y-1">
                  <p>Current user: {currentUserEmail}</p>
                  <p>User ID: {currentUserID}</p>
                  <p>Form creator: {form?.createdBy}</p>
                </div>
              </div>
            </div>
          )
        ) : null}
        
        {/* Workflow Section */}
        {currentSection === Section.Workflow ? (
          isEditor ? (
            <WorkflowPage 
              form_ID={form?.form_ID} 
              currentSection={currentSection} 
              setCurrentSection={setCurrentSection} 
            />
          ) : (
            <div className="p-4 text-center">
              <div className="max-w-md mx-auto mt-20 p-6 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                <div className="text-4xl mb-4">⚠️</div>
                <h2 className="text-xl font-semibold mb-2 text-yellow-800 dark:text-yellow-200">
                  Editor Access Required
                </h2>
                <p className="text-yellow-600 dark:text-yellow-300 mb-4">
                  You are not an editor. Only editors can access the workflow section.
                </p>
                <p className="text-sm text-yellow-500 dark:text-yellow-400">
                  Contact the form owner to request editor permissions.
                </p>
              </div>
            </div>
          )
        ) : null}
        
        {/* Preview Section */}
        {currentSection === Section.Preview && (
          <div className="p-4 sm:p-6 dark:text-white">
            <PreviewForm 
              form={form} 
              currentSection={currentSection} 
              setCurrentSection={setCurrentSection} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CenterNav;