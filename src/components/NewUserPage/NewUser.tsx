"use client";

import { createNewForm } from "@/app/action/createnewform";
import { useState } from "react";
import { useRouter } from "next/navigation";

function Newuser() {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
    const [formName, setFormName] = useState("");
    const handleCreate = async () => {
    if (!formName.trim()) return alert("Please enter a form name");
    const res = await createNewForm(formName);
    if (res) {
      router.push(`/form/${res}`);
    } else {
      alert("Failed to create a new form. Try again.");
    }
  };
  // const router = useRouter();

  // const handleCreateNow = async () => {
  //   const res = await createNewForm();
  //   if (res.success) {
  //     router.push(`/form/${res.form_ID}`);
  //   } else {
  //     alert("❌ Failed to create form");
  //   }
  // };
  
  return (
    <div className="w-full h-full border border-dashed border-black mx-auto flex flex-col justify-center items-center gap-6 px-8 bg-transparent dark:border-white">
      <h4 className="text-xl text-gray-600 dark:text-white">
        You have not created any forms yet.
      </h4>
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
        Create Your First Form Today!
      </h2>
      <button
        className="bg-[#61A986] px-6 py-3 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors dark:text-black"
        onClick={() => setShowDialog(!showDialog)}
      >
        Create Now
      </button>
      {showDialog && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="bg-white border-2 border-gray-800 rounded-xl shadow-2xl w-[42rem] max-w-full p-8 animate-pop-in dark:bg-[#353434] dark:border-gray-500">
                <label className="text-gray-950 mb-6 font-bold text-3xl flex items-center justify-center dark:text-white">
                  Create New Form
                </label>
                <input
                  className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-8 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white"
                  placeholder="Enter form name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  autoFocus
                />
                <div className="flex gap-4 justify-end">
                  <button
                    onClick={() => setShowDialog(false)}
                    className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-200 text-lg font-medium transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-6 py-3 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-lg font-medium transition-all duration-200 hover:shadow-md"
                  >
                    Create
                  </button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard):src/components/NewUserPage/NewUser.tsx
}

export default Newuser 