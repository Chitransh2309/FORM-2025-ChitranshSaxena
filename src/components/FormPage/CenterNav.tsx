"use client";

import React, { useState, useEffect } from "react";
import PreviewForm from "@/components/FormPage/PreviewForm";
import BuildForm from "@/components/FormPage/BuildForm";
import WorkflowPage from "./Workflow/WorkflowPage";
import { Form ,SectionForm} from "@/lib/interface";


const CenterNav = ({
  form,
  currentUserEmail,
  currentUserID,
}: {
  form?: Form;
  currentUserEmail: string;
  currentUserID?: string;
}) => {
  const [isEditor, setIsEditor] = useState<boolean>(false);
  const [isViewer, setIsViewer] = useState<boolean>(false);
  const [currentSection, setCurrentSection] = useState<SectionForm>(
    SectionForm.Builder
  );

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

    // If user is a viewer (and not an editor), set current section to Preview
    if (isInViewerList && !editorCheck) {
      setCurrentSection(SectionForm.Preview);
    }
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
  {currentSection === SectionForm.Builder && (
    <>
      {isEditor ? (
        <BuildForm
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      ) : isViewer ? (
        <>
          {(() => {
            // If viewer tries to access Builder, show alert and redirect to Preview
            window.alert("Editor access required to open Builder section.");
            setCurrentSection(SectionForm.Preview);
            return null; // Don't render anything here, let Preview section handle it
          })()}
        </>
      ) : (
        <BuildForm
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      )}
    </>
  )}

  {/* Workflow Section */}
  {currentSection === SectionForm.Workflow && (
    <>
      {isEditor ? (
        <WorkflowPage
          form_ID={form?.form_ID}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      ) : isViewer ? (
        <>
          {(() => {
            // If viewer tries to access Workflow, show alert and redirect to Preview
            window.alert("Editor access required to open Workflow section.");
            setCurrentSection(SectionForm.Preview);
            return null; // Don't render anything here, let Preview section handle it
          })()}
        </>
      ) : (
        <WorkflowPage
          form_ID={form?.form_ID}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
        />
      )}
    </>
  )}

  {/* Preview Section */}
  {currentSection === SectionForm.Preview && (
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

export default CenterNav;