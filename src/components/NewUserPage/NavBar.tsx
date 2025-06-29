"use client";

import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import ToggleSwitch from "./Toggle";

export default function Navbar() {
  return (
    /* mobile‑only green bar */
    <div className="md:hidden w-full flex items-center justify-between px-4 py-3 bg-[#56A37D]">

      {/* left: logo + title */}
      <div className="flex items-center gap-2">
        <Image
          src="/main-icon.png"      /* pulls from /public/main-icon.png */
          alt="F.O.R.M logo"
          width={24}
          height={24}
          className="w-6 h-6 opacity-80 flex-shrink-0"
        />
        <span className="font-bold text-lg text-black">F.O.R.M</span>
      </div>

      {/* right: toggle + icons */}
      <div className="flex items-center gap-4">
        <ToggleSwitch />
        <HiOutlineQuestionMarkCircle size={26} className="text-black hover:text-gray-700" />
        <FaRegCircleUser         size={20} className="text-black hover:text-gray-700" />
      </div>
    </div>
  );
}
