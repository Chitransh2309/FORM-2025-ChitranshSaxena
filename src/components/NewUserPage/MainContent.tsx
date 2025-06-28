"use client";

import { useEffect, useState } from "react";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createNewForm } from "@/app/action/createnewform";
import { getFormsForUser } from "@/app/action/forms";

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
  publishedAt?: string;
}

export default function MainContent() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreateForm = async () => {
    const newId = await createNewForm();
    router.push(`/form/${newId}`);
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await getFormsForUser();
        setForms(data);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* ───────── Mobile top buttons row ───────── */}
      <div className="md:hidden w-full bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          {/* My Workspace */}
          <button className="bg-[#61A986] text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2">
            My Workspace <FaChevronDown size={12} />
          </button>

          {/* Search */}
          <div className="bg-[#3D3D3D] text-white px-3 py-2 rounded-lg flex items-center flex-1 min-w-0">
            <FaSearch size={14} className="mr-2" />
            <input
              type="text"
              placeholder="Search"
              className="bg-transparent outline-none text-sm flex-1 placeholder-white"
            />
          </div>

          {/* + New Form */}
          <button
            onClick={handleCreateForm}
            className="bg-[#3D3D3D] text-white px-4 py-2 rounded-lg text-sm flex-shrink-0"
          >
            + New Form
          </button>
        </div>
      </div>

      {/* ───────── Content Area ───────── */}
      <div className="flex-1 p-6 md:p-6 overflow-y-auto">
        {loading ? (
          <p className="text-gray-600 text-center mt-8">Loading forms...</p>
        ) : forms.length ? (
          <div className="flex flex-wrap gap-4">
            {forms.map((form) => (
              <button
                key={form.form_ID}
                onClick={() => router.push(`/form/${form.form_ID}`)}
                className="bg-[#61A986] hover:bg-[#4d8a6b] text-white px-6 py-4 rounded-md shadow-md transition-all"
              >
                {form.title || "Untitled Form"}
              </button>
            ))}
          </div>
        ) : (
          <>
            {/* Mobile Empty State */}
            <div className="md:hidden flex flex-col items-center justify-center h-full text-center">
              <p className="text-gray-600 mb-4">
                You have not created any forms yet.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Create Your First Form Today!
              </h2>
              <button
                onClick={handleCreateForm}
                className="bg-[#61A986] text-white px-6 py-3 rounded-lg"
              >
                Create Now
              </button>
            </div>

            {/* Desktop Empty State */}
            <div className="hidden md:flex justify-center h-full">
              <div className="w-[995px] h-[775px] mt-[193px] ml-[369px] border border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-center px-12 py-12">
                <p className="text-gray-600 mb-2">
                  You have not created any forms yet.
                </p>
                <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                  Create Your First Form Today!
                </h2>
                <button
                  onClick={handleCreateForm}
                  className="bg-[#61A986] text-white px-6 py-3 rounded-lg"
                >
                  Create Now
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
