// Starred.tsx
"use client";

import { useTransition, useMemo } from "react";
import { toggleStarForm } from "@/app/action/forms";

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
  isStarred: boolean;
}

export default function Starred({
  forms,
  searchTerm,
  onUnstar,
}: {
  forms: Form[];
  searchTerm: string;
  onUnstar: (formId: string) => void;
}) {
  const [isPending, startTransition] = useTransition();

  const filteredForms = useMemo(() => {
    return forms.filter((form) =>
      form.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [forms, searchTerm]);

  const handleUnstar = (formId: string) => {
    startTransition(async () => {
      const res = await toggleStarForm(formId);
      if (res.success) {
        onUnstar(formId); // 🔁 update in parent
      } else {
        alert(res.message || "Failed to unstar");
      }
    });
  };

  return (
    <section className="w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="text-xl font-semibold px-4 py-3">⭐ Starred</h2>

      <div className="border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 min-h-[60vh]">
        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No starred forms found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                <div className="w-full aspect-square bg-gray-300 text-center flex items-center justify-center rounded-lg dark:bg-[#353434]">
                  {form.title || "Untitled Form"}
                </div>

                <button
                  onClick={() => handleUnstar(form.form_ID)}
                  className="mt-2 bg-[#2B2A2A] hover:bg-[#1f1e1e] text-white text-xs py-1 rounded"
                >
                  Unstar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

