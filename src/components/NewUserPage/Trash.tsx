
"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useMemo } from "react";
import { restoreForm, permanentlyDeleteForm } from "@/app/action/forms"; // Create these if not yet

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
}

export default function Trash({
  forms: initialForms,
  searchTerm,
}: {
  forms: Form[];
  searchTerm: string;
}) {
  const router = useRouter();
  const [forms, setForms] = useState(initialForms);
  const [isPending, startTransition] = useTransition();

  const filteredForms = useMemo(() => {
    return forms.filter((form) =>
      form.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [forms, searchTerm]);

  const handleRestore = (formId: string) => {
    startTransition(async () => {
      const res = await restoreForm(formId);
      if (res.success) {
        setForms((prev) => prev.filter((f) => f.form_ID !== formId));
      } else {
        alert(res.message || "Failed to restore");
      }
    });
  };

  const handlePermanentDelete = (formId: string) => {
    startTransition(async () => {
      const confirm = window.confirm("Permanently delete this form?");
      if (!confirm) return;

      const res = await permanentlyDeleteForm(formId);
      if (res.success) {
        setForms((prev) => prev.filter((f) => f.form_ID !== formId));
      } else {
        alert(res.message || "Failed to permanently delete");
      }
    });
  };

  return (
    <section className="w-full xl:w-1/2 text-black p-4 dark:text-white mb-20 xl:mb-0">
      <h2 className="text-xl font-semibold px-4 py-3">Trash</h2>

      <div className="border-2 border-gray border-dashed rounded-lg p-4 overflow-visible xl:min-h-90 lg:min-h-120 dark:border-white">
        <div className="grid grid-cols-2 gap-3">
          {filteredForms.length > 0 ? (
            filteredForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                <div
                  className="w-full aspect-square bg-gray-300 text-center
                    flex items-center justify-center rounded-lg dark:bg-[#353434]"
                >
                  {form.title || "Untitled Form"}
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleRestore(form.form_ID)}
                    className="flex-1 bg-[#56A37D] hover:bg-[#4d8a6b] text-white text-xs py-1 rounded"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(form.form_ID)}
                    className="flex-1 bg-[#2B2A2A] hover:bg-[#1f1e1e] text-white text-xs py-1 rounded"
                  >
                    Permanent Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center col-span-2 text-gray-500 dark:text-gray-400">
              No deleted forms.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}