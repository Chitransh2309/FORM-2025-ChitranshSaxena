"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getFormObject from "@/app/action/getFormObject";
import { getUser } from "@/app/action/getUser";
import { Form } from "@/lib/interface";

type SharedFormWithRole = {
  form: Form;
  role: "editor" | "viewer";
};

export default function Shared() {
  const router = useRouter();
  const [sharedForms, setSharedForms] = useState<SharedFormWithRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSharedForms() {
      try {
        const user = await getUser();
        console.log("👤 User object:", user);

        if (!user?.sharedForms || user.sharedForms.length === 0) {
          setSharedForms([]);
          return;
        }

        const fetchedForms: SharedFormWithRole[] = [];

        for (const formId of user.sharedForms) {
          const res = await getFormObject(formId);
          if (res.success && res.data) {
            const form = res.data;

            const role = form.editorID?.includes(user.user_ID)
              ? "editor"
              : "viewer";

            fetchedForms.push({ form, role });
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
    <section className="w-full px-4 xl:px-10 py-6 text-black dark:text-white">
      <h2 className="text-xl font-semibold px-4 py-3">Shared With Me</h2>

      <div className="border-2 border-dashed border-gray-400 dark:border-white rounded-lg p-6 min-h-[60vh]">
        {sharedForms.length === 0 ? (
          <p className="text-center text-gray-500 dark:text-gray-400">
            No shared forms available.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {sharedForms.map(({ form, role }) => (
              <div key={form.form_ID} className="flex flex-col relative">
                <button
                  onClick={() => router.push(`/form/${form.form_ID}`)}
                  className="w-full aspect-square bg-gray-300 text-center flex items-center justify-center rounded-lg dark:bg-[#353434]"
                >
                  {form.title || "Untitled Form"}
                </button>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => router.push(`/form/${form.form_ID}`)}
                    className="flex-1 rounded bg-[#56A37D] text-white text-xs py-1"
                  >
                    {role === "editor" ? "Edit Form" : "Preview Form"}
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
