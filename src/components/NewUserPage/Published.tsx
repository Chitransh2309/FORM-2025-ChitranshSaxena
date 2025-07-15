"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

import { deleteFormFromDB, toggleStarForm } from "@/app/action/forms";

import { Form } from "@/lib/interface";
import Loader from "../Loader";

export default function Published({ forms: initialForms }: { forms: Form[] }) {
  const router = useRouter();
  // Initialize state with the filtered published forms from props
  const [forms, setForms] = useState<Form[]>(
    initialForms.filter((f: Form) => f.isActive === true)
  );
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  // ────────── handlers ──────────
  const handleDelete = (id: string) =>
    startTransition(async () => {
      if (!confirm("Are you sure you want to delete this form?")) return;
      try {
        await deleteFormFromDB(id);
        setForms((prev) => prev.filter((f) => f.form_ID !== id));
      } catch (err) {
        console.error("Error deleting form:", err);
        alert("Something went wrong while deleting.");
      }
    });

  const handleStarToggle = (id: string) =>
    startTransition(async () => {
      try {
        const res = await toggleStarForm(id);
        setForms((prev) =>
          prev.map((f) =>
            f.form_ID === id ? { ...f, isStarred: res.isStarred ?? false } : f
          )
        );
      } catch (err) {
        console.error("Star toggle failed:", err);
        alert("Something went wrong while toggling star.");
      }
    });

  // ────────── UI ──────────
  return (
    <>
      {loading && (
        <div className="z-60">
          <Loader />
        </div>
      )}

      <section className="relative w-full xl:w-1/2 text-black p-4 dark:text-white mb-20 xl:mb-0">
        {/* loader overlay */}
        {isPending && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/60">
            <svg
              className="animate-spin h-8 w-8 text-[#61A986]"
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

        <h2 className="text-xl font-semibold px-4 py-3">Published</h2>

        <div className="border-2 border-gray border-dashed rounded-lg p-4 overflow-visible xl:min-h-90 lg:min-h-120 dark:border-white">
          <div className="grid grid-cols-2 gap-3">
            {forms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                {/* ⭐ star */}
                <button
                  className={`absolute top-1.5 right-9 z-10 ${
                    form.isStarred
                      ? "text-yellow-500"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                  title="Star Form"
                  onClick={() => handleStarToggle(form.form_ID)}
                  disabled={isPending}
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
                  disabled={isPending}
                >
                  <Trash2 size={18} />
                </button>

                {/* card */}
                <div
                  onClick={() => {
                    setLoading(true);
                    router.push(`/form/${form.form_ID}`);
                  }}
                  className="cursor-pointer w-full aspect-square bg-gray-300 hover:bg-[#d1ebdb]
                  rounded-lg shadow transition p-3 dark:bg-[#353434] dark:hover:bg-[#3f3d3d]
                  flex flex-col justify-between"
                >
                  <div className="flex-grow flex items-center justify-center text-center font-semibold">
                    {form.title || "Untitled Form"}
                  </div>
                </div>

                {/* buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setLoading(true);
                      router.push(`/form/${form.form_ID}`);
                    }}
                    className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1 disabled:opacity-60"
                    disabled={isPending}
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => {
                      setLoading(true);
                      router.push(`/response/${form.form_ID}`);
                    }}
                    className="flex-1 rounded bg-[#3D3D3D] text-white text-xs py-1 disabled:opacity-60"
                    disabled={isPending}
                  >
                    View Response
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
