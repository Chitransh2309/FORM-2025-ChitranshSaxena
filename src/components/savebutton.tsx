// app/components/savebutton.tsx
import React from "react";

export default function Save({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-[#61A986] text-white cursor-pointer hover:bg-[#628a76] h-10 w-20 rounded-lg"
    >
      Save
    </button>
  );
}
