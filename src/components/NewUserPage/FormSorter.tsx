"use client";

import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createNewForm } from "@/app/action/CreateNewForm";

function Formsorter() {
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

  return (
    <div className="px-8 py-6 ">
      <div className="flex justify-between items-start relative">
        <button className="flex gap-2 items-center bg-[#61A986] text-lg px-6 py-3 text-white rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg dark:text-black">
          My Workspace
          <FaChevronDown
            size={12}
            className="transition-transform duration-200 group-hover:rotate-180"
          />
        </button>

        <div className="relative">
          <button
            className="bg-[#3D3D3D] px-6 py-3 text-white text-lg rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] shadow-md hover:shadow-lg"
            onClick={() => setShowDialog(!showDialog)}
          >
            + New Form
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
      </div>
    </div>
  );
}

export default Formsorter;
