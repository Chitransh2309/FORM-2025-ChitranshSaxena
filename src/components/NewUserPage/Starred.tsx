"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as regularStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as solidStar } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";

import { toggleStarForm, deleteFormFromDB, getFormsForUser } from "@/app/action/forms";

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
  isStarred: boolean;
}

export default function Starred({ searchTerm }: { searchTerm: string }) {
  const [forms, setForms] = useState<Form[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ⏬ Fetch starred forms on mount
  useEffect(() => {
    async function fetchStarredForms() {
      try {
        const allForms = await getFormsForUser(); // ✅ this returns an array
        const starredForms = allForms.filter((form: Form) => form.isStarred);
        setForms(starredForms);
      } catch (err) {
        console.error("Error fetching forms:", err);
      }
    }

    fetchStarredForms();
  }, []);

  const filteredForms = useMemo(() => {
    return forms.filter((form) =>
      form.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [forms, searchTerm]);

  const handleStarToggle = (formId: string) => {
    startTransition(async () => {
      try {
        const res = await toggleStarForm(formId);
        setForms((prev) => prev.filter((f) => f.form_ID !== formId)); // ⬅️ remove from starred list
      } catch (err) {
        console.error("Failed to toggle star:", err);
        alert("Something went wrong while toggling star.");
      }
    });
  };

  const handleDelete = (formId: string) => {
    startTransition(async () => {
      const confirmDelete = confirm("Are you sure you want to delete this form?");
      if (!confirmDelete) return;

      try {
        const res = await deleteFormFromDB(formId);
        setForms((prev) => prev.filter((f) => f.form_ID !== formId));
      } catch (err) {
        console.error("Failed to delete form:", err);
        alert("Something went wrong while deleting.");
      }
    });
  };

  return (
    <section className="w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="text-xl font-semibold px-4 py-3">⭐ Starred</h2>

      <div className="border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 min-h-[60vh]">
        {filteredForms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No starred forms found.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                {/* ⭐ Star Toggle */}
                <button
                  className={`absolute top-1.5 right-9 z-10 ${
                    form.isStarred ? "text-yellow-500" : "text-gray-500 hover:text-yellow-500"
                  }`}
                  title="Unstar Form"
                  onClick={() => handleStarToggle(form.form_ID)}
                >
                  <FontAwesomeIcon icon={form.isStarred ? solidStar : regularStar} />
                </button>

                {/* 🗑️ Delete Button */}
                <button
                  onClick={() => handleDelete(form.form_ID)}
                  className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800"
                  title="Delete Form"
                >
                  <Trash2 size={18} />
                </button>

                {/* 📄 Form Title */}
                <div
                  className="w-full aspect-square bg-gray-300 text-center flex items-center justify-center rounded-lg dark:bg-[#353434] cursor-pointer hover:bg-[#d1ebdb] dark:hover:bg-[#3f3d3d]"
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                >
                  {form.title || "Untitled Form"}
                </div>

                {/* ✏️ Edit + View */}
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1"
                  >
                    Edit Form
                  </button>
                  <button
                    onClick={() => router.push(`/response/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#3D3D3D] text-white text-xs py-1"
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
