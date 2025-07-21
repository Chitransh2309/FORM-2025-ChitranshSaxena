/* --------------------------------------------------------------------------
 * Published.tsx – shows all published (isActive === true) forms.
 * Replaces React’s experimental useTransition with a simple `busy` flag
 * managed by useState.
 * ------------------------------------------------------------------------ */
"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

import { deleteFormFromDB, toggleStarForm } from "@/app/action/forms";
import type { Form } from "@/lib/interface";
import { useState, useTransition, type Dispatch, type SetStateAction } from "react";
import { updateFormInfo } from "@/app/action/updateFormInfo";
import Loader from "../Loader";

interface PublishedProps {
  forms: Form[];
  setForms: Dispatch<SetStateAction<Form[]>>;
}

export default function Published({ forms, setForms }: PublishedProps) {
  const router = useRouter();

  const published = forms.filter((f) => f.isActive);
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

  /* delete ------------------------------------------------------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      setLoading(true);
      await deleteFormFromDB(id);
      setLoading(false);
      setForms((prev) =>
        prev.map((f) => (f.form_ID === id ? { ...f, isDeleted: true } : f))
      );
    } catch {
      alert("Something went wrong while deleting.");
    }
  };

  /* star/unstar -------------------------------------------------------- */
  const handleStarToggle = async (id: string) => {
    /* optimistic local flip */
    setForms((prev) =>
      prev.map((f) =>
        f.form_ID === id ? { ...f, isStarred: !f.isStarred } : f
      )
    );

    try {
      const res = await toggleStarForm(id); // may return { isStarred }
      if (res && "isStarred" in res) {
        setForms((prev) =>
          prev.map((f) =>
            f.form_ID === id ? { ...f, isStarred: !!res.isStarred } : f
          )
        );
      }
    } catch {
      alert("Something went wrong while toggling star.");
      /* roll back optimistic change on error */
      setForms((prev) =>
        prev.map((f) =>
          f.form_ID === id ? { ...f, isStarred: !f.isStarred } : f
        )
      );
    }
  };

  /* ------------------------------ UI ------------------------------- */
  return (
    <>
    {(loading || isPending) && (
            <div>
              <Loader />
            </div>
          )}
    <section className="relative w-full xl:w-1/2 p-4 mb-20 xl:mb-0 text-black dark:text-white">
    {/* {isPending && (
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
        )} */}
      <h2 className="px-4 py-3 text-xl font-semibold">Published</h2>

      <div className="rounded-lg border-2 border-dashed border-gray p-4 dark:border-white xl:min-h-90 lg:min-h-120 max-h-120 sm:max-h-none overflow-auto sm:overflow-visible">
        {published.length === 0 ? (
          <div
            className="flex items-center justify-center xl:min-h-90 lg:min-h-120 max-h-120 sm:max-h-none"
          >
            <p className="text-center text-gray-500 dark:text-gray-400">
              No published forms found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {published.map((form) => (
              <div key={form.form_ID} className="relative flex flex-col">
                {/* ⭐ toggle */}
                <button
                  className={`absolute top-1.5 right-9 z-10 ${
                    form.isStarred
                      ? "text-yellow-500"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                  onClick={() => handleStarToggle(form.form_ID)}
                  title="Star Form"
                >
                  <FontAwesomeIcon
                    icon={form.isStarred ? solidStar : regularStar}
                  />
                </button>

                {/* 🗑 delete */}
                <button
                  onClick={() => handleDelete(form.form_ID)}
                  className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800 disabled:opacity-60"
                  title="Delete Form"
                >
                  <Trash2 size={18} />
                </button>

                {/* card */}
                <button
                  onClick={() => handleOpenDialog(form)}
                  disabled={isPending}
                  className="aspect-square w-full cursor-pointer rounded-lg bg-gray-300 p-3 shadow transition hover:bg-[#d1ebdb] dark:bg-[#353434] dark:hover:bg-[#3f3d3d] flex flex-col justify-center"
                >
                  <div className="text-center font-semibold">
                    {form.title || "Untitled Form"}
                  </div>
                </button>

                {/* buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    
                    onClick={() =>{
                      setLoading(true);
                      router.push(`/form/${form.form_ID}`)} }
                    className="flex-1 rounded bg-[#56A37D] py-1 text-xs text-white disabled:opacity-60"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => router.push(`/response/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#3D3D3D] py-1 text-xs text-white disabled:opacity-60"
                  >
                    View Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
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
