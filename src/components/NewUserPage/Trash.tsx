"use client";

import { restoreForm, permanentlyDeleteForm } from "@/app/action/forms";
import type { Form } from "@/lib/interface";

interface TrashProps {
  forms: Form[];
  searchTerm: string;
  onRestore: (formId: string) => void;
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;
}

export default function Trash({
  forms,
  searchTerm,
  onRestore,
  setForms,
}: TrashProps) {
  /* common predicate so we don’t repeat the logic string-literal style */
  const matches = (f: Form) =>
    f.isDeleted && f.title?.toLowerCase().includes(searchTerm.toLowerCase());

  /* ───────── handlers ───────── */
  const handleRestore = async (formId: string) => {
    try {
      const res = await restoreForm(formId);
      if (res.success) {
        setForms((prev) =>
          prev.map((f) =>
            f.form_ID === formId ? { ...f, isDeleted: false } : f
          )
        );

        onRestore(formId);
      } else {
        alert(res.message || "Failed to restore");
      }
    } catch (error) {
      alert("An error occurred while restoring the form");
      console.error(error);
    }
  };

  const handlePermanentDelete = async (formId: string) => {
    if (!confirm("Permanently delete this form?")) return;
    try {
      const res = await permanentlyDeleteForm(formId);
      if (res.success) {
        setForms((prev) => prev.filter((f) => f.form_ID !== formId));
      } else {
        alert(res.message || "Failed to permanently delete");
      }
    } catch (error) {
      alert("An error occurred while permanently deleting the form");
      console.error(error);
    }
  };

  /* ───────── UI ───────── */
  return (
    <section className="relative w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="px-4 py-3 text-xl font-semibold">Trash</h2>

      <div className="min-h-[60vh] rounded-lg border-2 border-dashed border-gray-400 p-6 dark:border-white">
        {forms.filter(matches).length === 0 ? (
          <div
            className="absolute left-0 w-full h-[500px] p-4 text-center flex items-center justify-center transform -translate-y-1/2"
            style={{ top: "55%" }}
          >
            <p className="text-center text-gray-500 dark:text-gray-400">
              No deleted forms found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {forms.filter(matches).map((form) => (
              <div key={form.form_ID} className="flex flex-col">
                {/* thumbnail */}
                <div className="aspect-square w-full rounded-lg bg-gray-300 text-center flex items-center justify-center dark:bg-[#353434]">
                  {form.title || "Untitled Form"}
                </div>

                {/* buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => handleRestore(form.form_ID)}
                    className="flex-1 rounded bg-[#56A37D] py-1 text-xs text-white hover:bg-[#4d8a6b]"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => handlePermanentDelete(form.form_ID)}
                    className="flex-1 rounded bg-[#2B2A2A] py-1 text-xs text-white hover:bg-[#1f1e1e]"
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
