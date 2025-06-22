// app/components/savebutton.tsx
import React from 'react';

export default function Save({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-green-500 text-white cursor-pointer hover:bg-green-300 h-10 w-20 rounded-lg"
    >
      Save
    </button>
  );
}
