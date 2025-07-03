"use client";
import { useState } from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import ToggleSwitch from "../LandingPage/ToggleSwitch";
import FAQs from "./FAQs";

export default function Navbar() {
  const [showFaq, setShowFaq] = useState(false);
  return (
    /* mobile‑only green bar */
    <div className="xl:hidden w-full flex items-center justify-between px-4 py-3 bg-[#56A37D] dark:bg-[#2B2A2A]">
      {/* left: logo + title */}
      <div className="flex items-center gap-2">
        <Image
          src="/main-icon.png" /* pulls from /public/main-icon.png */
          alt="F.O.R.M logo"
          width={24}
          height={24}
          className="w-6 h-6 opacity-80 flex-shrink-0"
        />
        <span className="font-bold text-lg text-black dark:text-white">
          F.O.R.M
        </span>
      </div>

      {/* right: toggle + icons */}
      <div className="flex items-center gap-4">
        <ToggleSwitch />
        <button onClick={() => setShowFaq(true)}>
          <HiOutlineQuestionMarkCircle
            size={26}
            className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
          />
        </button>
        <FaRegCircleUser
          size={20}
          className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
        />
      </div>
      {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}
