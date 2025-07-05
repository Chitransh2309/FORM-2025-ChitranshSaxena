import { Form, FormResponse } from '@/lib/interface';
import React from 'react'
import PieChart from './PieChart';

const Analysis = ({form,responses}:{form: Form;
  responses: FormResponse[];}) => {
  return (
    <div className="bg-white dark:bg-[#5A5959] p-6 rounded-lg shadow space-y-8">
      {form.sections.map((section) =>
        section.questions.map((question) => {
          const answersToThisQuestion = responses
            .map((response) => {
              const answer = response.answers.find(
                (a) => a.question_ID === question.question_ID
              );
              return answer?.value?.trim()
                ? { ...answer, userName: response.userName || response.userId }
                : null;
            })
            .filter(Boolean); // remove nulls

          if (answersToThisQuestion.length === 0) return null;

          return (
            <div
              key={question.question_ID}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm bg-white dark:bg-[#4a4a4a]"
            >
              <label className="block text-xl font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {question.questionText}{" "}
                {question.isRequired && <span className="text-red-500">*</span>}
              </label>
              <PieChart answers={answersToThisQuestion}/>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Analysis
