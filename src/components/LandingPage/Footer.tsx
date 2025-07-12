import React from "react";
import Link from "next/link";
import { Copyright, YoutubeIcon } from "lucide-react";
import { Outfit } from "next/font/google";
import Image from "next/image";

const out_fit = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Footer() {
  return (
    <div className="min-h-40 w-full p-3 sm:p-6 bg-[#61A986]" id="contact">
      {/* Main content section */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-0 w-full">
        <div className="flex-1 max-w-none lg:max-w-2xl">
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-[#F6F8F6] font-bold ${out_fit.className} dark:text-[#F6F8F6] leading-tight`}
          >
            "Forms that hustle, so you don't have to."
          </p>
          <p
            className={`text-lg sm:text-xl font-bold mt-2 sm:mt-4 ${out_fit.className} text-[#F6F8F6] dark:text-[#F6F8F6]`}
          >
            F.O.R.M
          </p>
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm mt-2 text-[#F6F8F6] dark:text-[#F6F8F6]">
            <Link href="/" className="hover:underline">
              Contact Us
            </Link>
            <Link href="/about" className="hover:underline">
              About Us
            </Link>
          </div>
        </div>

        <div className="flex justify-end mt-20">
          <p className="text-base sm:text-lg font-semibold text-[#F6F8F6] dark:text-[#F6F8F6]">
            Made with 🤍 by ACM-VIT
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-0 sm:mt-2 border-0 h-[2px] bg-[#F6F8F6] w-full mb-1 dark:bg-[#F6F8F6]" />

      {/* Bottom section - Copyright and social icons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mx-0 sm:mx-4 mt-[-50px]">
        {/* Copyright */}
        <div className="flex items-center">
      <Image
        src="/ACM.svg"
        alt="ACM logo"
        width={70}
        height={70}
        className="w-45 h-45 sm:w-47 sm:h-47 hover:opacity-80 cursor-pointer transition-opacity"
      />
</div>


        {/* Social icons */}
        <div className="flex justify-center gap-4 sm:gap-5 items-start">
          <a
            href="https://github.com/ACM-VIT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/Github.svg"
              alt="Github logo"
              width={28}
              height={28}
              className="w-7 h-7 sm:w-8 sm:h-8 top-0.5 stroke-none fill-[#F6F8F6] dark:stroke-none dark:fill-[#F6F8F6] hover:opacity-80 cursor-pointer transition-opacity"
            />
            
          </a>

          <a
            href="https://www.instagram.com/acmvit?igsh=MmJvMTllZHMxaW1l"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/InstagramIcon.svg"
              alt="Instagram logo"
              width={28}
              height={28}
              className="w-7 h-7 sm:w-8 sm:h-8 top-0.5 stroke-none fill-[#F6F8F6] dark:stroke-none dark:fill-[#F6F8F6] hover:opacity-80 cursor-pointer transition-opacity"
            />
            {/* <InstagramIcon className="w-7 h-7 sm:w-8 sm:h-8 text-[#F6F8F6] dark:stroke-[#000000] hover:opacity-80 cursor-pointer transition-opacity" /> */}
          </a>

          <a
            href="https://x.com/ACM_VIT?t=Jo9czfQPBy9yOpuggsHAOQ&s=09"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/twitter.svg"
              alt="X icon"
              width={28}
              height={28}
              className="w-7 h-7 sm:w-8 sm:h-8 stroke-none fill-[#F6F8F6] dark:stroke-none dark:fill-[#000000] hover:opacity-80 cursor-pointer transition-opacity"
            />
          </a>

          <a
            href="https://www.linkedin.com/company/acmvit/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/linkedin.svg"
              alt="LinkedIn icon"
              width={28}
              height={28}
              className="w-7 h-7 sm:w-8 sm:h-8 stroke-none dark:stroke-none dark:fill-[#000000] hover:opacity-80 cursor-pointer transition-opacity"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
