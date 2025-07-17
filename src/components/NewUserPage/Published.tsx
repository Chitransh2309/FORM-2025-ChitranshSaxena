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
import type { Dispatch, SetStateAction } from "react";

interface PublishedProps {
  forms: Form[];
  setForms: Dispatch<SetStateAction<Form[]>>;
}

export default function Published({ forms, setForms }: PublishedProps) {
  const router = useRouter();

  const published = forms.filter((f) => f.isActive);

  /* delete ------------------------------------------------------------- */
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this form?")) return;
    try {
      await deleteFormFromDB(id);
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
    <section className="relative w-full xl:w-1/2 p-4 mb-20 xl:mb-0 text-black dark:text-white">
      <h2 className="px-4 py-3 text-xl font-semibold">Published</h2>

      <div className="rounded-lg border-2 border-dashed border-gray p-4 dark:border-white xl:min-h-90 lg:min-h-120 max-h-120 sm:max-h-none overflow-auto sm:overflow-visible">
        {published.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No published forms found.
          </p>
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
                <div
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                  className="aspect-square w-full cursor-pointer rounded-lg bg-gray-300 p-3 shadow transition hover:bg-[#d1ebdb] dark:bg-[#353434] dark:hover:bg-[#3f3d3d] flex flex-col justify-center"
                >
                  <div className="text-center font-semibold">
                    {form.title || "Untitled Form"}
                  </div>
                </div>

                {/* buttons */}
                <div className="mt-2 flex gap-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
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
    </section>
  );
}
