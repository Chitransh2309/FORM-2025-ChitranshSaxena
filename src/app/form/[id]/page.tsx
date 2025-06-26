"use client";

// import React, { useEffect, useState } from "react";
// import { useParams } from "next/navigation";
// import SectionSidebar from "@/components/SectionSidebar";
import CenterNav from "@/components/center-nav";
// import RightNav from "@/components/right-nav";
// import SaveButton from "@/components/savebutton";
// import QuestionParent from "@/components/question-parent";
// import getFormObject from "@/app/action/getFormObject";
// import { saveFormToDB } from "@/app/action/saveformtodb";
// import { Form, Question, Section } from "@/lib/interface";

//   const { id: formId } = useParams();
//   const [form, setForm] = useState<Form | null>(null);
//   const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

//   // Fixed the typo here: selectedSectaionId -> selectedSectionId
//   const selectedSection = form?.sections.find(
//     (s) => s.section_ID === selectedSectionId
//   );

//   useEffect(() => {
//     const loadData = async () => {
//       if (!formId || typeof formId !== "string") return;
//       const res = await getFormObject(formId);
//       if (res.success) {
//         setForm(res.data);
//         setSelectedSectionId(res.data.sections?.[0]?.section_ID ?? null);
//       }
//     };
//     loadData();
//   }, [formId]);

//   const addSection = () => {
//     if (!form) return;

//     // Extract existing section numbers
//     const existingNumbers = form.sections
//       .map(s => {
//         const match = s.section_ID.match(/section-(\d+)/);
//         return match ? parseInt(match[1]) : 0;
//       })
//       .filter(num => num > 0);

//     // Find next available number
//     let nextNumber = 1;
//     while (existingNumbers.includes(nextNumber)) {
//       nextNumber++;
//     }

//     const newId = `section-${nextNumber}`;
//     const newSection: Section = {
//       section_ID: newId,
//       title: `Section ${nextNumber}`,
//       description: "",
//       questions: [],
//     };

//     setForm({
//       ...form,
//       sections: [...form.sections, newSection],
//     });
//     setSelectedSectionId(newId);
//   };

//   const deleteSection = (sectionId: string) => {
//     if (!form) return;

//     const filteredSections = form.sections.filter(
//       (s) => s.section_ID !== sectionId
//     );

//     setForm({ ...form, sections: filteredSections });

//     // If we're deleting the currently selected section, select the first remaining one
//     if (sectionId === selectedSectionId) {
//       setSelectedSectionId(filteredSections[0]?.section_ID ?? null);
//     }
//   };

//   const addQuestion = () => {
//     if (!form || !selectedSectionId) return;

//     const updatedSections = form.sections.map((section) =>
//       section.section_ID === selectedSectionId
//         ? {
//             ...section,
//             questions: [
//               ...section.questions,
//               {
//                 question_ID: `q-${Date.now()}`,
//                 section_ID: section.section_ID,
//                 questionText: "",
//                 isRequired: false,
//                 order: section.questions.length + 1,
//               },
//             ],
//           }
//         : section
//     );

//     setForm({ ...form, sections: updatedSections });
//   };

//   const updateQuestion = (id: string, updates: Partial<Question>) => {
//     if (!form || !selectedSectionId) return;

//     const updatedSections = form.sections.map((section) =>
//       section.section_ID === selectedSectionId
//         ? {
//             ...section,
//             questions: section.questions.map((q) =>
//               q.question_ID === id ? { ...q, ...updates } : q
//             ),
//           }
//         : section
//     );

//     setForm({ ...form, sections: updatedSections });
//   };

//   const deleteQuestion = (id: string) => {
//     if (!form || !selectedSectionId) return;

//     const updatedSections = form.sections.map((section) =>
//       section.section_ID === selectedSectionId
//         ? {
//             ...section,
//             questions: section.questions.filter(
//               (q) => q.question_ID !== id
//             ),
//           }
//         : section
//     );

//     setForm({ ...form, sections: updatedSections });
//   };

//   const handleSave = async () => {
//     if (!form) return;

//     const res = await saveFormToDB(form);
//     if (res.success) {
//       alert("✅ Saved successfully");
//     } else {
//       alert("❌ Failed to save");
//     }
//   };

export default function FormPage() {
  return (
    <div className="bg-[#e8ede8]">
      <CenterNav />
    </div>
  );
}
