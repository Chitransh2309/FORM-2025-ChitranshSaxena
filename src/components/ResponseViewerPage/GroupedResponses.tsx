import { Form, FormResponse } from "@/lib/interface";

interface Props {
  form: Form;
  responses: FormResponse[];
}

export default function GroupedResponseBlock({ form, responses }: Props) {
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
              <label className="block text-md font-semibold mb-3 text-gray-800 dark:text-gray-100">
                {question.questionText}{" "}
                {question.isRequired && <span className="text-red-500">*</span>}
              </label>

              <ul className="space-y-2">
                {answersToThisQuestion.map((ans, i) => (
                  <li
                    key={`${question.question_ID}-${i}`}
                    className="bg-gray-100 dark:bg-[#3a3a3a] px-3 py-2 rounded text-gray-900 dark:text-gray-100"
                  >
                    <span className="font-medium"> </span>
                    {ans.value}
                  </li>
                ))}
              </ul>
            </div>
          );
        })
      )}
    </div>
  );
}
