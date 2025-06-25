"use client";

import { FaChevronDown } from "react-icons/fa";
import { useRouter } from 'next/navigation';
//import { nanoid } from 'nanoid';
import { createNewForm } from '@/app/action/createnewform';

function MainContent() {
  const router = useRouter();

  const handleCreateForm = async () => {
    //const newId = nanoid(); // ✅ Unique ID
    //console.log("🆕 Generated new form ID:", newId); // 🔍 Debug
    
    const newId = await createNewForm(); // ✅ Create in DB

    console.log("📦 Navigating to: /form/" + newId); // 🔍 Confirm push path
    
    router.push(`/form/${newId}`); // ✅ Navigate to form
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
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

      <div className="flex-1 flex items-center justify-center p-8">
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
    </div>
  );
}

export default MainContent;
