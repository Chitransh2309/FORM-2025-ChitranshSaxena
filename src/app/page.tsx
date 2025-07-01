<<<<<<< HEAD
'use client';

import React, { useEffect, useState } from 'react';
import SectionSidebar from '../components/SectionSidebar';
import SectionEditor from '../components/SectionEditor';
import { Section, Question, QuestionType } from '../lib/interface';

export default function Page() {
  const [sections, setSections] = useState<Section[]>([]);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);

  // Load sections from MongoDB when the page loads
  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch('/api/sections');
        const data = await res.json();
        setSections(data);
      } catch (err) {
        console.error('Failed to load sections:', err);
      }
    }
    fetchSections();
  }, []);

  // Add new section and save to MongoDB
  const addSection = async () => {
    const newSection: Section = {
      section_ID: Date.now().toString(),
      title: `Section ${sections.length + 1}`,
      description: '',
      questions: [],
    };

    setSections((prev) => [...prev, newSection]);
    setSelectedSectionId(newSection.section_ID);

    // Save to MongoDB
    try {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });
    } catch (err) {
      console.error('Failed to save section:', err);
    }
  };

  const updateQuestion = (
    sectionId: string,
    questionId: string,
    updated: Partial<Question>
  ) => {
    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        const updatedQuestions = section.questions.map((q) =>
          q.question_ID === questionId ? { ...q, ...updated } : q
        );
        return { ...section, questions: updatedQuestions };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const deleteQuestion = (sectionId: string, questionId: string) => {
    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        return {
          ...section,
          questions: section.questions.filter((q) => q.question_ID !== questionId),
        };
      }
      return section;
    });
    setSections(updatedSections);
  };

  const addQuestion = (sectionId: string) => {
    const newQuestion: Question = {
      question_ID: Date.now().toString() + Math.floor(Math.random() * 1000),
      order: 0,
      section_ID: sectionId,
      type: QuestionType.TEXT,
      questionText: '',
      isRequired: false,
      config: {
        name: 'text',
        type: 'string',
        params: [],
        validations: [],
      },
    };

    const updatedSections = sections.map((section) => {
      if (section.section_ID === sectionId) {
        return { ...section, questions: [...section.questions, newQuestion] };
      }
      return section;
    });

    setSections(updatedSections);
  };

  const selectedSection = sections.find((s) => s.section_ID === selectedSectionId) || null;
=======
import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import { insertUser } from "./action/user";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />

      <div className="w-full px-4 py-10 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8">
          Build Forms Like Never Before
        </p>
        <div className="w-full flex justify-center">
          <Image
            src="/form builder-dark mode.svg"
            height={1063}
            width={750}
            alt="form-builder"
            className="w-full max-w-[1063px] h-auto hidden dark:block"
          />
          <Image 
            src="/form builder -default 1.svg"
            alt="dark mode"
            height={1063}
            width={750}
            className="w-full max-w-[1063px] h-auto block dark:hidden"
          />
        </div>
      </div>

      <div className="w-full px-4 py-10 flex flex-col items-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8 text-center">
          Features That Make You Come Back
        </p>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full place-items-center">
            <div className="w-full max-w-[345px] bg-[#61A986] dark:bg-[#E1F4E6] rounded-xl p-6 text-white dark:text-[#61A986] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F8F8F6] dark:bg-[#61A986] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>

            <div className="w-full max-w-[345px] bg-[#E6AD00] dark:bg-[#F8F5EA] rounded-xl p-6 text-white dark:text-[#E6AD00] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F6F8F6] dark:bg-[#C69D1F] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>

            <div className="w-full max-w-[345px] bg-[#3D3D3D] dark:bg-[#E9E6E9] rounded-xl p-6 text-white dark:text-[#3D3D3D] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F4F3F4] dark:bg-[#3D3D3D] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
