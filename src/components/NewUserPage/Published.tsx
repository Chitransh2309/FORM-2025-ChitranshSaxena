"use client";

import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { useTransition, useState } from "react";
import { deleteFormFromDB } from "@/app/action/forms"; // adjust path if needed

interface Form {
  form_ID: string;
  title: string;
  publishedAt: Date | null;
}

export default function Published({ forms: initialForms }: { forms: Form[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [forms, setForms] = useState(initialForms);

  const handleDelete = (formId: string) => {
    startTransition(async () => {
      const confirmDelete = confirm("Are you sure you want to delete this form?");
      if (!confirmDelete) return;

      const res = await deleteFormFromDB(formId);
      if (res.success) {
        setForms((prev) => prev.filter((form) => form.form_ID !== formId));
      } else {
        alert(res.message || res.error || "Failed to delete");
      }
    });
  };

  return (
    <section className="w-full xl:w-1/2 text-black p-4 dark:text-white mb-20 xl:mb-0">
      <h2 className="text-xl font-semibold px-4 py-3">Published</h2>

      <div className="border-2 border-gray border-dashed rounded-lg p-4 overflow-visible xl:min-h-90 lg:min-h-120 dark:border-white">
        <div className="grid grid-cols-2 gap-3">
          {forms.map((form) => (
            <div key={form.form_ID} className="flex flex-col relative">
              {/* 🗑️ Delete Button */}
              <button
                onClick={() => handleDelete(form.form_ID)}
                className="absolute top-2 right-2 z-10 text-red-600 hover:text-red-800"
                title="Delete Form"
              >
                <Trash2 size={18} />
              </button>

              {/* Form Preview Button */}
              <button
                onClick={() => router.push(`/form/${form.form_ID}`)}
                className="w-full aspect-square bg-gray-300 hover:bg-[#d1ebdb]
                  rounded-lg shadow transition p-3 dark:bg-[#353434] dark:hover:bg-[#3f3d3d] text-center"
              >
                {form.title || "Untitled Form"}
              </button>

              {/* Edit + View Buttons */}
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
      </div>
    </section>
  );
}

export default Published 