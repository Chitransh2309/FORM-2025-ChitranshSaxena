"use client";
import { useState } from "react";
import Image from "next/image";
import { FaRegCircleUser } from "react-icons/fa6";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import ToggleSwitch from "../LandingPage/ToggleSwitch";
import FAQs from "./FAQs";
import Profile from "./Profile";

export default function Navbar({
  image,
  name,
  email,
}: {
  image: string;
  name: string;
  email: string;
}) {
  const [showFaq, setShowFaq] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  return (
    /* mobile‑only green bar */
    <div className="xl:hidden w-full flex items-center justify-between px-4 py-3 bg-[#56A37D] dark:bg-[#2B2A2A]">
      {/* left: logo + title */}
      <div className="flex items-center gap-2">
        <Image
          src="/logo-component.svg"
          alt="LOGO"
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
        />

        <span className="text-lg sm:text-xl md:text-2xl font-bold">
          FormSpace
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
        <button onClick={() => setShowProfile(!showProfile)}>
          {image !== "" ? (
            <Image
              src={image}
              width={26}
              height={26}
              alt="profile_image"
              className="text-black rounded-full hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            />
          ) : (
            <FaRegCircleUser
              size={20}
              className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            />
          )}
        </button>
      </div>
      {showProfile && <Profile name={name} email={email} />}
      {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}
