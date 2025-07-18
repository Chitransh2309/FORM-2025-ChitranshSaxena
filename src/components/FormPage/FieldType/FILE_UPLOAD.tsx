import { useState } from "react";

export default function FileUploadPlaceholder() {
  return (
    <div
      className="block w-full border-2 border-dashed border-[#8CC7AA] rounded-lg py-6 px-4 text-center bg-gray-100 text-gray-400 dark:bg-[#3b3b3b]"
    >
      <span className="text-[#61A986] font-medium">
        Click to upload a file
      </span>
    </div>
  );
}
