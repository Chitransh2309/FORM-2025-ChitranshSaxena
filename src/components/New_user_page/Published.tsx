'use client';

import { useRouter } from 'next/navigation';

interface Form {
  form_ID: string;
  title: string;
  publishedAt: Date | null;
}

export default function Published({ forms }: { forms: Form[] }) {
  const router = useRouter();

  return (
    <div className="w-1/2 p-4">
      <h2 className="text-xl text-black bg-green-300 rounded-lg px-3 py-3 font-semibold mb-4">Published</h2>
      <div className="space-y-3">
        {forms.map((form) => (
          <button
            key={form.form_ID}
            onClick={() => router.push(`/form/${form.form_ID}`)}
            className="w-full text-left px-4 py-3 bg-[#F0F0F0] hover:bg-[#e0e0e0] rounded-lg shadow transition"
          >
            {form.title || 'Untitled Form'}
          </button>
        ))}
      </div>
    </div>
  );
}
