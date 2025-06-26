'use client';

import { useEffect, useState } from 'react';
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { createNewForm } from '@/app/action/createnewform';
import { getFormsForUser } from '@/app/action/forms'; // ✅ Import server action

interface Form {
  form_ID: string;
  title: string;
  createdAt: string;
  publishedAt?: string;
}

function MainContent() {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const handleCreateForm = async () => {
    const newId = await createNewForm();
    router.push(`/form/${newId}`);
  };

  useEffect(() => {
    const fetchForms = async () => {
      try {
        const data = await getFormsForUser(); // ✅ direct call to server action
        setForms(data);
      } catch (err) {
        console.error("Failed to fetch forms:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchForms();
  }, []);

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Top Nav */}
      <div className="flex justify-between items-center px-6 py-4 border-b">
        <button className="flex items-center gap-2 bg-[#56A37D] text-white px-4 py-2 rounded-lg hover:bg-[#4a9470]">
          My Workspace
          <FaChevronDown size={12} />
        </button>

        <button
          onClick={handleCreateForm}
          className="bg-[#56A37D] text-white px-4 py-2 rounded-lg hover:bg-[#4a9470]"
        >
          + New Form
        </button>
      </div>

      {/* Form Buttons or Empty State */}
      <div className="flex-1 p-6 overflow-y-auto">
        {loading ? (
          <div className="text-gray-600 text-center mt-8">Loading forms...</div>
        ) : forms.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {forms.map((form) => (
              <button
                key={form.form_ID}
                onClick={() => router.push(`/form/${form.form_ID}`)}
                className="bg-[#61A986] hover:bg-[#4d8a6b] text-white px-6 py-4 rounded-md shadow-md transition-all"
              >
                {form.title || 'Untitled Form'}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full">
            <div className="border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-12 max-w-md w-full text-center">
              <h3 className="text-lg text-gray-600 mb-2">You have not created any forms yet.</h3>
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Your First Form Today!</h2>
              <button
                onClick={handleCreateForm}
                className="bg-[#56A37D] text-white px-6 py-3 rounded-lg hover:bg-[#4a9470] font-medium"
              >
                Create Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainContent;
