"use client";

import { useRouter } from "next/navigation";

interface Form {
  form_ID: string;
  title: string;
  publishedAt: Date | null;
}

export default function Published({ forms }: { forms: Form[] }) {
  const router = useRouter();

  return (
    <div className="w-1/2 text-black p-4">
      <h2 className="text-xl text-black font-semibold px-4 py-3">Published</h2>
      <div className="space-y-3 border-2 border-black border-dashed rounded-lg overflow-y-auto  h-[90%]">
        {forms.map((form) => (
          <button
            key={form.form_ID}
            onClick={() => router.push(`/form/${form.form_ID}`)}
            className="w-45 h-45 m-2 text-left px-4 py-3 bg-gray-300 hover:bg-[#d1ebdb] rounded-lg shadow transition"
          >
            {form.title || "Untitled Form"}
          </button>
        ))}
      </div>
    </div>
  );
}
