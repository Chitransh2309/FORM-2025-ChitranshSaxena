import React from "react";
import { Plus } from "lucide-react"; 

export default function AddQuestion({ onClick }: { onClick: () => void }) {
    return (
        <div className="flex justify-center mb-4">
            <button onClick={onClick} className="border-2 border-dashed border-gray-400 rounded-lg p-4 w-[90%] mx-auto hover:bg-gray-300 cursor-pointer">
            <div className="flex items-center justify-center">
                <Plus size={20} />
                Add Question
            </div>
            </button>
        </div>
    );
};