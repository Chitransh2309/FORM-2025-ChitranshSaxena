
import { useState } from "react";

interface Form {
  form_ID: string;
  title: string;
  publishedAt: Date | null;
}

export default async function TrashPage({
  forms: initialForms,
}: {
  forms: Form[];
}) {
  const [forms, setForms] = useState(initialForms);

  return (
    <section className="p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Trashed Forms</h1>

      {forms.length === 0 && (
        <p className="text-gray-600">No discarded forms.</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {forms.map((form) => (
          <div
            key={form.form_ID}
            className="p-4 border rounded-lg bg-white dark:bg-[#2a2a2a]"
          >
            <p className="font-semibold">{form.title || "Untitled Form"}</p>

            <div className="flex justify-end gap-2 mt-4">
              <button className="text-red-600 hover:underline text-sm">
                Delete Permanently
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
