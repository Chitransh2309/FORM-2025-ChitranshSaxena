// components/Shared.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getFormObject from "@/app/action/getFormObject";
import { getUser } from "@/app/action/getUser";
import { Form } from "@/lib/interface";

export default function Shared() {
  const router = useRouter();
  const [sharedForms, setSharedForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSharedForms() {
      try {
        const user = await getUser();
        console.log("👤 User object:", user); // <-- DEBUG
        if (!user?.sharedForms || user.sharedForms.length === 0) {
          setSharedForms([]);
          return;
        }

        const fetchedForms: Form[] = [];

        for (const formId of user.sharedForms) {
          const res = await getFormObject(formId);
          if (res.success && res.data) {
            fetchedForms.push(res.data);
          }
        }

        setSharedForms(fetchedForms);
      } catch (err) {
        console.error("❌ Error fetching shared forms:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchSharedForms();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-10 text-gray-500 dark:text-white">
        Loading shared forms...
      </div>
    );
  }

  return (
    <section className="w-full xl:w-1/2 text-black p-4 dark:text-white mb-20 xl:mb-0">
      <h2 className="text-xl font-semibold px-4 py-3">Shared With Me</h2>

      <div className="border-2 border-gray border-dashed rounded-lg p-4 dark:border-white">
        {sharedForms.length === 0 ? (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400">
            No shared forms available.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {sharedForms.map((form) => (
              <div key={form.form_ID} className="flex flex-col relative">
                <button
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                  className="w-full aspect-square bg-gray-300 hover:bg-[#d1ebdb]
                    rounded-lg shadow transition p-3 dark:bg-[#353434] dark:hover:bg-[#3f3d3d] text-center"
                >
                  {form.title || "Untitled Form"}
                </button>
                <button
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                  className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1"
                >
                  Edit Form
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
