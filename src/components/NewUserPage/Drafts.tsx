"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { deleteFormFromDB } from "@/app/action/forms";
import { Form } from "@/lib/interface";
import Loader from "../Loader";

export default function Drafts({ forms: initialForms }: { forms: Form[] }) {
  const router = useRouter();
  console.log("Initial forms received in Drafts component:", initialForms);
  // only keep items that are still drafts
  const [forms, setForms] = useState(
    initialForms.filter((f) => f.publishedAt === null)
  );
  console.log("Drafts component rendered with forms:", forms);
  const [isPending, startTransition] = useTransition();
  const [loading, setLoading] = useState(false);

  const handleDiscard = (id: string) =>
    startTransition(async () => {
      if (!confirm("Are you sure you want to discard this draft?")) return;

      const res = await deleteFormFromDB(id);
      if (res.success) {
        setForms((prev) => prev.filter((f) => f.form_ID !== id));
      } else {
        alert(res.message || res.error || "Failed to discard draft.");
      }
    });

  return (
    <>
      {loading && (
        <div className=" z-60">
          <Loader />
        </div>
      )}
      <section className="relative w-full xl:w-1/2 text-black p-4 dark:text-white mb-20 xl:mb-0">
        {/* ── loader overlay ── */}
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

        <h2 className="text-xl font-semibold px-4 py-3">Drafts</h2>

        <div className="border-2 border-gray border-dashed rounded-lg p-4 overflow-visible xl:min-h-90 lg:min-h-120 dark:border-white">
          <div className="grid grid-cols-2 gap-3">
            {forms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                {/* form card */}
                <button
                  onClick={() => {
                    setLoading(true);
                    router.push(`/form/${form.form_ID}`);
                  }}
                  disabled={isPending}
                  className="w-full aspect-square bg-gray-300 hover:bg-[#d1ebdb]
                  rounded-lg shadow transition p-3 dark:bg-[#353434] dark:hover:bg-[#3f3d3d]
                  text-center font-semibold disabled:opacity-60"
                >
                  {form.title || "Untitled Form"}
                </button>

                {/* action buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setLoading(true);
                      router.push(`/form/${form.form_ID}`);
                    }}
                    disabled={isPending}
                    className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1 disabled:opacity-60"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => handleDiscard(form.form_ID)}
                    disabled={isPending}
                    className="flex-1 rounded bg-[#3D3D3D] text-white text-xs py-1 disabled:opacity-60"
                  >
                    Discard Draft
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
