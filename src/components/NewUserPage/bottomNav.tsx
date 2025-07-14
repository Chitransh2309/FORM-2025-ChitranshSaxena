"use client";

import { MdOutlineHome } from "react-icons/md";
import { TbShare3 } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";

type Props = {
  selected: string;
  setSelected: (val: "myForms" | "shared" | "starred" | "trash") => void;
};

export default function BottomNav({ selected, setSelected }: Props) {
  const items = [
    { key: "myForms", icon: <MdOutlineHome size={22} />, label: "Home" },
    { key: "shared", icon: <TbShare3 size={22} />, label: "Shared" },
    { key: "starred", icon: <FaRegStar size={22} />, label: "Starred" },
    { key: "trash", icon: <LuTrash2 size={20} />, label: "Trash" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 xl:hidden bg-white border-t shadow-md dark:bg-[#2B2A2A] dark:border-gray-500">
      <ul className="flex justify-around">
        {items.map(({ key, icon, label }) => (
          <li key={key}>
            <button
              onClick={() => setSelected(key as "myForms" | "shared" | "starred" | "trash")}
              className={`flex flex-col items-center py-3 text-xs ${
                selected === key
                  ? "text-[#56A37D]"
                  : "text-black dark:text-white"
              }`}
            >
              {icon}
              <span className="mt-1">{label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
