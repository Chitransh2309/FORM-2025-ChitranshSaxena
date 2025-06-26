"use client";

import { FaChevronDown } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { createNewForm } from "@/app/action/createnewform";

function Formsorter() {
  const router = useRouter();

  const handleNewForm = async () => {
    const res = await createNewForm();
    if (res) {
      router.push(`/form/${res}`);
    } else {
      alert("Failed to create a new form. Please try again.");
    }
    console.log("New form created with ID:", res);
  };

  return (
    <div className="bg-[#FFFFFF] px-8 py-6">
      <div className="flex justify-between items-center">
        <button className="flex gap-2 items-center bg-[#61A986] text-lg px-4 py-2 text-white rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors">
          My Workspace
          <FaChevronDown size={12} />
        </button>

        <button
          className="bg-[#61A986] px-4 py-2 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors"
          onClick={handleNewForm}
        >
          + New Form
        </button>
      </div>
    </div>
  );
}

export default Formsorter;
