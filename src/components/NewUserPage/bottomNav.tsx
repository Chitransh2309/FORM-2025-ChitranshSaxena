"use client";

import Link from "next/link";
import { MdOutlineHome } from "react-icons/md";
import { TbShare3 } from "react-icons/tb";
import { FaRegStar } from "react-icons/fa";
import { GrDocument } from "react-icons/gr";
import { LuTrash2 } from "react-icons/lu";

type Item = { href: string; icon: React.ReactNode; label: string };

const items: Item[] = [
  { href: "/",         icon: <MdOutlineHome size={22} />, label: "Home" },
  { href: "/shared",   icon: <TbShare3       size={22} />, label: "Shared" },
  { href: "/starred",  icon: <FaRegStar      size={22} />, label: "Starred" },
  { href: "/drafts",   icon: <GrDocument     size={20} />, label: "Drafts" },
  { href: "/trash",    icon: <LuTrash2       size={20} />, label: "Trash" },
];

export default function BottomNav() {
  return (
    /* hidden on ≥ md screens */
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-white border-t shadow-md dark:bg-[#2B2A2A] dark:border-gray-500">
      <ul className="flex justify-around">
        {items.map(({ href, icon, label }) => (
          <li key={label}>
            <Link
              href={href}
              className="flex flex-col items-center py-3 text-xs text-black hover:text-[#56A37D] dark:text-white"
            >
              {icon}
              <span className="mt-1">{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
