"use client";
import React, { useEffect, useRef, useState } from "react";
import { Trash2 } from "lucide-react";

export default function Question({ id, onDelete }: { id: number; onDelete: (id: number) => void }) {
  const containerRef = useRef(null);
  const textareaRef = useRef(null);
  const [isSelected, setIsSelected] = useState(false);
  const [isRequired, setIsRequired] = useState(false); // Add state for required toggle

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

  const handleRequiredToggle = () => {
    setIsRequired(!isRequired); // Handle toggle state change
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

  // Create unique IDs for each question
  const toggleId = `title-toggle-${id}`;

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      className={`bg-green-200 p-6 rounded-xl w-[90%] min-h-[20%] mx-auto mb-10 ${
        isSelected ? "ring-4 ring-black" : ""
      }`}
    >
      <div className="flex justify-between items-center">
        <input
          placeholder="Ques Label *"
          className="focus:outline-none font-bold text-xl text-black"
        />

        <div className="flex items-center">
          <label className="text-gray-700 mr-1">Required</label>
          <label
            htmlFor={toggleId} // Use unique ID
            className="relative inline-flex items-center cursor-pointer"
          >
            <input
              type="checkbox"
              id={toggleId} // Use unique ID
              className="sr-only peer"
              checked={isRequired} // Bind to state
              onChange={handleRequiredToggle} // Handle change
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
        />
      </div>

      <div className="mt-0 bg-green-300 rounded-md px-4 py-2 text-black/50">
        answer type: short text/mcq/checkbox
      </div>

      <div className="text-black mt-3">
        character limit/single choice/multi choice
      </div>
    </div>
  );
}