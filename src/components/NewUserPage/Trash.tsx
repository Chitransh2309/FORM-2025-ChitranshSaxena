"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useMemo } from "react";
import { restoreForm, permanentlyDeleteForm } from "@/app/action/forms";

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
}

export default function Trash({ forms: initialForms, searchTerm, onRestore }) {

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
        onRestore(formId);
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
    <section className="w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="text-xl font-semibold px-4 py-3">Trash</h2>

      <div className="border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 min-h-[60vh]">
        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No deleted forms found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                <div className="w-full aspect-square bg-gray-300 text-center flex items-center justify-center rounded-lg dark:bg-[#353434]">
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
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
