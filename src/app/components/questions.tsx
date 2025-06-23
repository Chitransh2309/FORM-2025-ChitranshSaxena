"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";
import { Question as QuestionInterface } from "@/lib/interface"; // Import your actual interface

<<<<<<<< HEAD:src/components/questions.tsx
interface Props {
  id: string;
  data: QuestionInterface; // Use your actual Question interface
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedFields: Partial<QuestionInterface>) => void;
}

export default function Question({ id, data, onDelete, onUpdate }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
========
export default function Question({
  id,
  data,
  onDelete,
  onUpdate,
}: {
  id: number;
  data: {
    label: string;
    content: string;
    required: boolean;
  };
  onDelete: (id: number) => void;
  onUpdate: (id: number, updatedFields: Partial<typeof data>) => void;
<<<<<<< HEAD
}) 
{
=======
}) {
>>>>>>> 733cd2c (CUD done)
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
>>>>>>>> 9b4c9b0 (backend):src/app/components/questions.tsx
  const [isSelected, setIsSelected] = useState(false);

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

  const handleClick = () => {
    setIsSelected(true);
  };

<<<<<<< HEAD
 
=======
>>>>>>> 733cd2c (CUD done)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsSelected(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleId = `title-toggle-${id}`;

<<<<<<< HEAD
=======
  const toggleId = `title-toggle-${id}`; // unique ID for checkbox

>>>>>>> 733cd2c (CUD done)
  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`bg-[#FEFEFE] p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 ${
      className={`bg-[#FEFEFE] p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 ${
        isSelected ? "ring-4 ring-black" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <input
          placeholder="Ques Label *"
          className="focus:outline-none font-bold text-xl text-black"
<<<<<<< HEAD
          value = {data.label}
=======
          value={data.label}
>>>>>>> 733cd2c (CUD done)
          onChange={e => onUpdate(id, { label: e.target.value })}
>>>>>>>> 9b4c9b0 (backend):src/app/components/questions.tsx
        />

        <div className="flex items-center">
          <label className="text-gray-700 mr-1">Required</label>
          <label
<<<<<<< HEAD
            htmlFor="title-toggle"
=======
            htmlFor={toggleId}
>>>>>>> 733cd2c (CUD done)
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
<<<<<<< HEAD
              id="title-toggle"
              className="sr-only peer"
<<<<<<<< HEAD:src/components/questions.tsx
              checked={data.isRequired || false} // Use isRequired and provide fallback
              onChange={e => onUpdate(id, { isRequired: e.target.checked })} // Update isRequired
========
              checked = {data.required}
=======
              id={toggleId}
              className="sr-only peer"
              checked={data.required}
>>>>>>> 733cd2c (CUD done)
              onChange={e => onUpdate(id, { required: e.target.checked })}
>>>>>>>> 9b4c9b0 (backend):src/app/components/questions.tsx
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <button
            className="text-gray-700 hover:text-red-500 hover:bg-gray-300 ml-4 px-2 py-2 rounded cursor-pointer"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-2 text-black text-lg">
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          placeholder="Write your question here *"
          className="resize-none focus:outline-none w-[75%] min-h-[10px] overflow-hidden p-0"
<<<<<<<< HEAD:src/components/questions.tsx
          value={data.questionText || ""} // Use questionText and provide fallback
          onChange={e => onUpdate(id, { questionText: e.target.value })} // Update questionText
========
          value={data.content}
          onChange={e => onUpdate(id, { content: e.target.value })}
>>>>>>>> 9b4c9b0 (backend):src/app/components/questions.tsx
        />
        
      </div>

      <div className="mt-0 bg-[#F6F6F6] rounded-md px-4 py-2 text-black/50">
        answer type: short text/mcq/checkbox
      </div>

      <div className="text-black mt-3">
        Order: {data.order} {/* Show other relevant info */}
      </div>
    </div>
  );
}