/* --------------------------------------------------------------------------
 * Drafts.tsx  – shows all *draft* forms (publishedAt === null)
 * Uses the `forms` array and `setForms` updater passed down from the parent.
 * ------------------------------------------------------------------------ */
"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { deleteFormFromDB } from "@/app/action/forms";
import type { Form } from "@/lib/interface";

interface DraftsProps {
  forms: Form[];                                            // parent-owned data
  setForms: React.Dispatch<React.SetStateAction<Form[]>>;   // parent updater
}
export default function Drafts({ forms, setForms }: DraftsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /* draft = unpublished AND not deleted */
  const drafts = forms.filter(
    (f) => f.publishedAt === null && !f.isDeleted,
  );

  const handleDiscard = (id: string) =>
    startTransition(async () => {
      if (!confirm("Are you sure you want to discard this draft?")) return;

      const res = await deleteFormFromDB(id);
      if (res.success) {
        /* keep the object, just flag it as deleted */
        setForms((prev) =>
          prev.map((f) =>
            f.form_ID === id ? { ...f, isDeleted: true } : f,
          ),
        );
      } else {
        alert(res.message || res.error || "Failed to discard draft.");
      }
    });
  return (
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

      <div className="rounded-lg border-2 border-dashed border-gray p-4 dark:border-white xl:min-h-90 lg:min-h-120">
        {drafts.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No draft forms found.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {drafts.map((form) => (
              <div key={form.form_ID} className="relative flex flex-col">
                {/* form card */}
                <button
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                  disabled={isPending}
                  className="aspect-square w-full rounded-lg bg-gray-300 p-3 text-center font-semibold shadow transition hover:bg-[#d1ebdb] disabled:opacity-60 dark:bg-[#353434] dark:hover:bg-[#3f3d3d]"
                >
                  {form.title || "Untitled Form"}
                </button>

                {/* action buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
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
    </section>
  );
}
