'use client';

import React, { useState } from 'react';
import SectionSidebar from '@/components/SectionSidebar';
import CenterNav from '@/components/center-nav';
import RightNav from '@/components/right-nav';
import SaveButton from '@/components/savebutton';
import SectionButton from '@/components/sectionbutton';
import QuestionParent, { QuestionType } from '@/components/question-parent';

import { saveQuestionsToDB } from '../../app/action/savequestions';
import { deleteQuestionFromDB } from '@/app/action/deletequestion';

export default function BuildPage() {
  const [sections, setSections] = useState([
    {
      section_ID: 'section-1',
      title: 'Section 1',
      description: '',
      questions: [
        {
          id: 1,
          label: '',
          content: '',
          required: true,
        },
      ],
    },
  ]);

  const [nextId, setNextId] = useState(2);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(
    sections[0]?.section_ID || null
  );

  const selectedSection = sections.find(
    (s) => s.section_ID === selectedSectionId
  );

  const addQuestion = () => {
    if (!selectedSectionId) return;

    const updatedSections = sections.map((section) => {
      if (section.section_ID === selectedSectionId) {
        const newQ: QuestionType = {
          id: nextId,
          label: '',
          content: '',
          required: false,
        };
        return {
          ...section,
          questions: [...section.questions, newQ],
        };
      }
      return section;
    });

    setSections(updatedSections);
    setNextId((prev) => prev + 1);
  };

  const updateQuestion = (id: number, updates: Partial<QuestionType>) => {
    if (!selectedSectionId) return;

    const updatedSections = sections.map((section) => {
      if (section.section_ID === selectedSectionId) {
        const newQs = section.questions.map((q) =>
          q.id === id ? { ...q, ...updates } : q
        );
        return { ...section, questions: newQs };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const deleteQuestion = async (id: number) => {
    if (!selectedSectionId) return;

    const section = sections.find((s) => s.section_ID === selectedSectionId);
    const question = section?.questions.find((q) => q.id === id);
    const isUnsaved = !question?.label && !question?.content;

    const updatedSections = sections.map((section) => {
      if (section.section_ID === selectedSectionId) {
        return {
          ...section,
          questions: section.questions.filter((q) => q.id !== id),
        };
      }
      return section;
    });

    setSections(updatedSections);

    // Only call DB delete if question has data
    if (!isUnsaved) {
      const question_ID = `q-${id}`;
      const result = await deleteQuestionFromDB(question_ID);
      if (!result.success) {
        alert(`❌ Failed to delete from DB: ${result.error}`);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedSectionId) return;

    const section = sections.find((s) => s.section_ID === selectedSectionId);
    if (!section) return;

    const formatted = section.questions.map((q, idx) => ({
      question_ID: `q-${q.id}`,
      order: idx + 1,
      section_ID: section.section_ID,
      type: 'text',
      questionText: q.content,
      isRequired: q.required,
    }));

    const result = await saveQuestionsToDB(formatted);
    if (result.success) {
      alert('✅ Saved to DB!');
    } else {
      console.error(result.error);
      alert('❌ Failed to save questions.');
    }
  };

  const addSection = () => {
    const newIndex = sections.length + 1;
    const newId = `section-${newIndex}`;
  
    const newSection = {
      section_ID: newId,
      title: `Section ${newIndex}`,
      description: '',
      questions: [],
    };
  
    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newId);
  };
  

  return (
    <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
      <SectionSidebar
        sections={sections}
        selectedSectionId={selectedSectionId}
        setSelectedSectionId={setSelectedSectionId}
        onAddSection={addSection}
      />

      <div className="w-full h-full overflow-auto">
        <div className="flex bg-[#e8ede8] h-screen overflow-hidden">
          <div className="w-full h-full overflow-auto">
            <CenterNav />

            {/* Top Row */}
            <div className="flex flex-row justify-between items-center">
              <div className="text-2xl font-bold ml-[5%] mb-3 mt-9 p-4">
                {selectedSection?.title || 'No Section Selected'}
              </div>
              <div className="mr-5 mt-9 mb-3 p-4">
                <SaveButton onClick={handleSave} />
              </div>
            </div>

            {selectedSection && (
              <QuestionParent
                ques={selectedSection.questions}
                onUpdate={updateQuestion}
                onDelete={deleteQuestion}
                onAdd={addQuestion}
              />
            )}
            
          </div>

          <div className="w-[34vw] h-[92vh] bg-white border-l-2 border-black-200">
            <RightNav />
          </div>
        </div>
      </div>
    </div>
  );
}
