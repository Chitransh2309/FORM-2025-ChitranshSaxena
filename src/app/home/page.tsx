"use client";

import { CircleQuestionMark, CircleUser } from "lucide-react";
import FormCard from "@/components/Home_Page/form-card";

export default function HomePage() {
  return (
    <div className="h-full flex flex-col p-6">
      {/* Icons */}
      <div className="flex justify-end gap-4 mb-4">
        <CircleQuestionMark />
        <CircleUser />
      </div>

      {/* Workspace Dropdown + New Form */}
      <div className="flex justify-between items-center mb-6">
        <select className="bg-[#61A986] text-white px-3 py-1 rounded">
          <option>My Workspace</option>
        </select>
        <button className="bg-black text-white px-3 py-1 rounded">
          + New Form
        </button>
      </div>

      {/* Form Sections */}
      <div className="flex-grow grid grid-cols-2 gap-6">
        {/* Drafts */}
        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Drafts</h2>
          <div className="flex-grow overflow-auto max-h-[calc(100vh-220px)] border border-dashed p-4 grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <FormCard
                key={i}
                editLabel="Edit Form"
                secondLabel="Discard Draft"
              />
            ))}
          </div>
        </div>

        {/* Published */}
        <div className="flex flex-col">
          <h2 className="font-semibold mb-2">Published</h2>
          <div className="flex-grow overflow-auto max-h-[calc(100vh-220px)] border border-dashed p-4 grid grid-cols-2 gap-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <FormCard
                key={i}
                editLabel="Edit Form"
                secondLabel="View Response"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
