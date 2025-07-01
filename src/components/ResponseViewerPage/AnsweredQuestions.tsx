import { Form, FormResponse } from "@/lib/interface";

interface Props {
  form: Form;
  response: FormResponse;
}

export default function AnsweredQuestionsBlock({ form, response }: Props) {
  const getQuestionText = (questionId: string) => {
    for (const section of form.sections) {
      const question = section.questions.find((q) => q.question_ID === questionId);
      if (question) return { text: question.questionText, required: question.isRequired };
    }
    return null;
  };

  return (
    <div className="bg-white dark:bg-[#5A5959] p-6 rounded-lg shadow space-y-6">
      {response.answers
        .filter((ans) => ans.value?.trim() !== "")
        .map((ans) => {
          const question = getQuestionText(ans.question_ID);
          if (!question) return null;

          return (
            <div
              key={ans.question_ID}
              className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 shadow-sm bg-white dark:bg-[#4a4a4a]"
            >
              <label className="block text-md font-medium mb-2 text-gray-800 dark:text-gray-100">
                {question.text}{" "}
                {question.required && <span className="text-red-500">*</span>}
              </label>
              <div className="bg-gray-100 dark:bg-[#3a3a3a] px-3 py-2 rounded text-gray-900 dark:text-gray-100">
                {ans.value}
              </div>
            </div>
          );
        })}
    </div>
  );
}
