"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar }   from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import {
  toggleStarForm,
  deleteFormFromDB,
  getFormsForUser,
} from "@/app/action/forms";
import { Form } from "@/lib/interface";

export default function Starred({ searchTerm }: { searchTerm: string }) {
  const [forms,       setForms]       = useState<Form[]>([]);
  const [loading,     setLoading]     = useState(true);          // 🆕
  const [isPending,   startTransition] = useTransition();
  const router = useRouter();

  /* ────────────────────────── fetch on mount ────────────────────────── */
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const formsRes = await getFormsForUser(true);             // starred

        const mapped: Form[] = formsRes.map((form: { _id: { toString: () => string }, responseCount: number } & Partial<Form>) => ({
          form_ID    : form._id.toString(),
          title      : form.title ?? "",
          description: form.description ?? "",
          createdAt  : form.createdAt as Date,
          createdBy  : form.createdBy ?? "",
          isActive   : !!form.isActive,
          version    : form.version ?? 0,
          share_url  : form.share_url ?? "",
          settings   : form.settings ?? { startDate: new Date(), cameraRequired: false },
          sections  : form.sections ?? [],
          isDeleted : !!form.isDeleted,
          isStarred : form.isStarred ?? true,                     // keep flag
        }));

        setForms(mapped);
      } catch (err) {
        console.error("Error fetching starred forms:", err);
      } finally {
        setLoading(false);                                        // 🆕
      }
    })();
  }, []);

  /* ────────────────────────── search filter ─────────────────────────── */
  const filteredForms = useMemo(
    () =>
      forms.filter(
        (f) =>
          f.title?.toLowerCase().includes(searchTerm.toLowerCase()) &&
          f.isStarred &&
          !f.isDeleted,
      ),
    [forms, searchTerm],
  );

  /* ────────────────────────── handlers ──────────────────────────────── */
  const handleStarToggle = (id: string) =>
    startTransition(async () => {
      try {
        await toggleStarForm(id);
        setForms((prev) => prev.filter((f) => f.form_ID !== id));
      } catch {
        alert("Something went wrong while toggling star.");
      }
    });

  const handleDelete = (id: string) =>
    startTransition(async () => {
      if (!confirm("Are you sure you want to delete this form?")) return;
      try {
        await deleteFormFromDB(id);
        setForms((prev) => prev.filter((f) => f.form_ID !== id));
      } catch {
        alert("Something went wrong while deleting.");
      }
    });

  /* ──────────────────────────── UI ──────────────────────────────────── */
  const busy = loading || isPending;                               // 🆕

  return (
    <section className="relative w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      {/* ─── loader overlay ─── */}
      {busy && (                                                     /* 🆕 */
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/70 dark:bg-black/60">
          <svg
            className="animate-spin h-8 w-8 text-[#61A986]"
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

      <h2 className="text-xl font-semibold px-4 py-3">⭐ Starred</h2>

      <div className="border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 min-h-[60vh]">
        {loading ? (                                                  /* 🆕 */
          <p className="text-center text-gray-500 dark:text-gray-400">
            Loading…
          </p>
        ) : filteredForms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No starred forms found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                {/* ⭐ toggle */}
                <button
                  className={`absolute top-1.5 right-9 z-10 ${
                    form.isStarred
                      ? "text-yellow-500"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                  onClick={() => handleStarToggle(form.form_ID)}
                  title="Unstar Form"
                  disabled={busy}
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
                  disabled={busy}
                >
                  <Trash2 size={18} />
                </button>

                {/* 📄 card */}
                <div
                  className="w-full aspect-square bg-gray-300 flex items-center justify-center
                             rounded-lg dark:bg-[#353434] cursor-pointer hover:bg-[#d1ebdb]
                             dark:hover:bg-[#3f3d3d] p-3"
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                >
                  <div className="text-center font-semibold">
                    {form.title || "Untitled Form"}
                  </div>
                </div>

                {/* buttons */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1 disabled:opacity-60"
                    disabled={busy}
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => router.push(`/response/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#3D3D3D] text-white text-xs py-1 disabled:opacity-60"
                    disabled={busy}
                  >
                    View Response
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
