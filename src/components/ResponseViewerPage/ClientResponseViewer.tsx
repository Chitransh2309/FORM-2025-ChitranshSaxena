"use client";

import React, { useState } from "react";
import HeaderSection from "@/components/ResponseViewerPage/HeaderSection";
import FormInfoCard from "@/components/ResponseViewerPage/FormInfo";
import AnsweredQuestionsBlock from "@/components/ResponseViewerPage/AnsweredQuestions";
import GroupedResponseBlock from "@/components/ResponseViewerPage/GroupedResponses";
import { Form, FormResponse } from "@/lib/interface";

interface Props {
  form: Form;
  responses: FormResponse[];
}

export default function ClientResponseViewer({ form, responses }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewMode, setViewMode] = useState<
    "Individual response" | "Grouped response"
  >("Individual response");

  const currentResponse = {
    ...responses[currentIndex],
    submittedAt: new Date(responses[currentIndex].submittedAt),
  };

  const handlePrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, responses.length - 1));
  const handleUserChange = (index: number) => setCurrentIndex(index);

  return (
    <div className="min-h-screen bg-[#F6F8F6] dark:bg-[#2B2A2A] text-black dark:text-white">
      <div className="max-w-4xl mx-auto px-4 py-8 font-[Outfit]">
        <HeaderSection
          currentIndex={currentIndex}
          total={responses.length}
          onPrev={handlePrev}
          onNext={handleNext}
          onUserChange={handleUserChange}
          userName={currentResponse.userName}
          submittedAt={currentResponse.submittedAt}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <FormInfoCard title={form.title} description={form.description} />

        {viewMode === "Individual response" && (
          <AnsweredQuestionsBlock form={form} response={currentResponse} />
        )}
        {viewMode === "Grouped response" && (
          <GroupedResponseBlock form={form} responses={responses} />
        )}
      </div>
    </div>
  );
}
