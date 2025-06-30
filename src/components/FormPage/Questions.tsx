"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

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
}) {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
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

  const toggleId = `title-toggle-${id}`; // unique ID for checkbox

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`bg-[#FEFEFE] shadow-[0_0_10px_rgba(0,0,0,0.3)] p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 ${
        isSelected ? "ring-4 ring-black dark:ring-[#353434]" : ""
      } dark:bg-[#5A5959] dark:text-white`}
    >
      <div className="flex justify-between items-center dark:text-white">
        <input
          placeholder="Ques Label *"
          className="focus:outline-none font-bold text-xl text-black dark:text-white dark:placeholder-white"
          value={data.questionText || ""} // Use questionText and provide fallback
          onChange={(e) => onUpdate(id, { questionText: e.target.value })} // Update questionText
        />

        <div className="flex items-center">
          <label className="text-gray-700 mr-1 dark:text-white">Required</label>
          <label
            htmlFor={toggleId}
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id={toggleId}
              className="sr-only peer"
              checked={data.isRequired || false} // Use isRequired and provide fallback
              onChange={(e) => onUpdate(id, { isRequired: e.target.checked })} // Update isRequired
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
          </label>
          <button
            className="text-gray-700 hover:text-red-500 hover:bg-gray-300 ml-4 px-2 py-2 rounded cursor-pointer dark:text-white dark:hover:bg-[#494949]"
            onClick={() => onDelete(id)}
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <div className="mt-2 text-black text-lg dark:text-white">
        <textarea
          ref={textareaRef}
          onInput={handleInput}
          placeholder="Write your question here *"
          className="resize-none focus:outline-none w-[75%] min-h-[10px] overflow-hidden p-0 dark:text-white dark:placeholder-white"
          value={data.questionText || ""} // Use questionText and provide fallback
          onChange={(e) => onUpdate(id, { questionText: e.target.value })} // Update questionText
        />
      </div>

      <div className="mt-0 bg-[#F6F6F6] rounded-md px-4 py-2 text-black/50 dark:bg-[#494949] dark:text-white">
        answer type: {data.type || "short text"}{" "}
        {/* Show the actual question type */}
      </div>

<<<<<<< HEAD
      <div className="text-black mt-3">
        character limit/single choice/multi choice
=======
      <div className="text-black mt-3 dark:text-white">
        Order: {data.order} {/* Show other relevant info */}
>>>>>>> b595afc (fix: dark and light theme)
      </div>
    </div>
  );
}
