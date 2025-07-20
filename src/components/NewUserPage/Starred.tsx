/* --------------------------------------------------------------------------
 * Starred.tsx – “⭐ Starred” tab (state-only version)
 * ------------------------------------------------------------------------ */
"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";

import { toggleStarForm, deleteFormFromDB } from "@/app/action/forms";
import type { Form } from "@/lib/interface";
import type { Dispatch, SetStateAction } from "react";

/* ---------- props ---------- */
interface StarredProps {
  searchTerm: string;
  forms: Form[];
  setForms: Dispatch<SetStateAction<Form[]>>;
}

/* ---------- component ---------- */
export default function Starred({ searchTerm, forms, setForms }: StarredProps) {
  const router = useRouter();

  /* ───────── search filter ───────── */
  const filteredForms = useMemo(
    () =>
      forms.filter(
        (f) =>
          f.isStarred &&
          !f.isDeleted &&
          f.title.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [forms, searchTerm]
  );

  /* ───────── handlers ───────── */
  const handleStarToggle = async (id: string) => {
    try {
      const res = await toggleStarForm(id); // toggles on the server
      const newStarState = res?.isStarred ?? false;

      setForms((prev) =>
        prev.map((f) =>
          f.form_ID === id ? { ...f, isStarred: newStarState } : f
        )
      );
    } catch {
      alert("Something went wrong while toggling star.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteFormFromDB(id);
      setForms((prev) => prev.filter((f) => f.form_ID !== id));
    } catch {
      alert("Something went wrong while deleting.");
    }
  };

  /* ───────── UI ───────── */
  return (
    <section className="relative w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="px-4 py-3 text-xl font-semibold">⭐ Starred</h2>

      <div className="min-h-[60vh] rounded-lg border-2 border-dashed border-gray-400 p-6 dark:border-white">
        {filteredForms.length === 0 ? (
          <div
            className="absolute left-0 w-full h-[500px] p-4 text-center flex items-center justify-center transform -translate-y-1/2"
            style={{ top: "55%" }}
          >
            <p className="text-center text-gray-500 dark:text-gray-400">
              No starred forms found.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {filteredForms.map((form) => (
              <div key={form.form_ID} className="relative flex flex-col">
                {/* ⭐ toggle */}
                <button
                  className={`absolute top-1.5 right-9 z-10 ${
                    form.isStarred
                      ? "text-yellow-500"
                      : "text-gray-500 hover:text-yellow-500"
                  }`}
                  onClick={() => handleStarToggle(form.form_ID)}
                  title="Unstar Form"
                >
                  <FontAwesomeIcon
                    icon={form.isStarred ? solidStar : regularStar}
                  />
                </button>

                {/* 🗑 delete */}
                <button
                  onClick={() => handleDelete(form.form_ID)}
                  className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800"
                  title="Delete Form"
                >
                  <Trash2 size={18} />
                </button>

                {/* 📄 card */}
                <div
                  className="aspect-square w-full cursor-pointer rounded-lg bg-gray-300 p-3 shadow transition hover:bg-[#d1ebdb] dark:bg-[#353434] dark:hover:bg-[#3f3d3d]"
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                >
                  <div className="flex h-full items-center justify-center text-center font-semibold">
                    {form.title || "Untitled Form"}
                  </div>
                </div>

                {/* buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#56A37D] py-1 text-xs text-white"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => router.push(`/response/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#3D3D3D] py-1 text-xs text-white"
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
