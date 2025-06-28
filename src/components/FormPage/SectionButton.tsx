import React from "react";
import { Plus } from "lucide-react"; 

export default function SectionButton(){
    return (
        <div className="mb-10 w-[70%] ml-auto px-13 text-white rounded flex justify-end items-center">
            <button className="bg-black text-white px-4 rounded-lg hover:bg-gray-500 flex items-center gap-2 h-7 cursor-pointer">
                <Plus size={16} />
                Add new section
            </button>
        </div>
    )
};