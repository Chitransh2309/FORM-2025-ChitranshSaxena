/* --------------------------------------------------------------------------
 * Drafts.tsx  – shows all *draft* forms (publishedAt === null)
 * Uses the `forms` array and `setForms` updater passed down from the parent.
 * ------------------------------------------------------------------------ */
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTransition } from "react";
import { deleteFormFromDB } from "@/app/action/forms";
import { updateFormInfo } from "@/app/action/updateFormInfo";
import { Form } from "@/lib/interface";
import Loader from "../Loader";

export default function Drafts({
  forms,
  setForms,
}: {
  forms: Form[];
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;
}) {
  const router = useRouter();

  // only keep items that are still drafts
  // const [forms, setForms] = useState(
  //   initialForms.filter((f) => f.publishedAt === null && !f.isDeleted)
  // );

  const [showDialog, setShowDialog] = useState(false);
  const [title, setTitle] = useState("Untitled Form");
  const [description, setDescription] = useState("");
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleOpenDialog = (form: Form) => {
    setTitle(form.title || "Untitled Form");
    setDescription(form.description || "");
    setSelectedFormId(form.form_ID);
    setShowDialog(true);
  };

  const handleSave = () => {
    if (!selectedFormId) return;

    startTransition(async () => {
      const res = await updateFormInfo(selectedFormId, title, description);

      if (res.success) {
        setForms((prev) =>
          prev.map((f) =>
            f.form_ID === selectedFormId ? { ...f, title, description } : f
          )
        );
        setShowDialog(false);
      } else {
        alert(res.message || res.error || "Failed to update");
      }
    });
  };

  const handleDiscard = (id: string) =>
    startTransition(async () => {
      if (!confirm("Are you sure you want to discard this draft?")) return;

      const res = await deleteFormFromDB(id);
      if (res.success) {
        /* keep the object, just flag it as deleted */
        setForms((prev) =>
          prev.map((f) => (f.form_ID === id ? { ...f, isDeleted: true } : f))
        );
      } else {
        alert(res.message || res.error || "Failed to discard draft.");
      }
    });

  return (
    <>
      {loading && (
        <div>
          <Loader />
        </div>
      )}
      <section className="relative w-full xl:w-1/2 p-4 mb-20 xl:mb-0 text-black dark:text-white">
        {/* ── loader overlay ── */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/60">
            <svg
              className="h-8 w-8 animate-spin text-[#61A986]"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          </div>
        )}

        <h2 className="px-4 py-3 text-xl font-semibold">Drafts</h2>

        <div className="border-2 border-gray border-dashed rounded-lg p-4 sm:overflow-visible xl:min-h-90 lg:min-h-120 max-h-120 sm:max-h-none overflow-auto dark:border-white">
          {forms.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No Draft forms found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {forms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                {/* form card */}
                <button
                  onClick={() => handleOpenDialog(form)}
                  disabled={isPending}
                  className="w-full aspect-square bg-gray-300 hover:bg-[#d1ebdb]
                  rounded-lg shadow transition p-3 dark:bg-[#353434] dark:hover:bg-[#3f3d3d]
                  text-center font-semibold disabled:opacity-60"
                >
                  {form.title || "Untitled Form"}
                </button>

                {/* action buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => {
                      setLoading(true);
                      router.push(`/form/${form.form_ID}`);
                    }}
                    disabled={isPending}
                    className="flex-1 rounded bg-[#56A37D] py-1 text-xs text-white disabled:opacity-60"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => handleDiscard(form.form_ID)}
                    disabled={isPending}
                    className="flex-1 rounded bg-[#3D3D3D] py-1 text-xs text-white disabled:opacity-60"
                  >
                    Discard Draft
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        </div>

        {/* Modal Dialog */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center m-6">
            <div className="bg-white border-2 border-gray-800 rounded-xl shadow-2xl w-[42rem] max-w-full p-8 animate-pop-in dark:bg-[#353434] dark:border-gray-500">
              <label className="text-gray-950 mb-6 font-bold text-3xl flex items-center justify-center dark:text-white">
                Form Info
              </label>
              <input
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-6 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white"
                placeholder="Enter form name"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-8 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white"
                placeholder="Enter description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
                style={{ maxHeight: "calc(1.5rem * 8)" }}
                autoFocus
              />

              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => setShowDialog(false)}
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-200 text-lg font-medium transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-3 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-lg font-medium transition-all duration-200 hover:shadow-md"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </>
  );
}
