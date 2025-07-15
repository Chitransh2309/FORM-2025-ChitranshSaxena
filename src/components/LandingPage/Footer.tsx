"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Outfit } from "next/font/google";
import ContactButton from "./ContactButton";
import { getUser } from "@/app/action/getUser";
import TermsModal from "@/components/LandingPage/TermsConditions";
import useSmoothScrollTo from "@/hooks/useSmoothScrollTo";

const out_fit = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Footer() {
  const [user_ID, setUser_ID] = useState("");
  const [showTerms, setShowTerms] = useState(false);
  const scrollToSection = useSmoothScrollTo();

  useEffect(() => {
    async function fetchUser() {
      const user = await getUser();
      setUser_ID(user?.user_ID || "");
    }
    fetchUser();
  }, []);

  return (
    <div
      className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-6 md:py-8 bg-[#61A986] dark:bg-[#61A986]"
      id="contact"
    >
      {/* Main content section */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-8 w-full">
        <div className="flex-1">
          <p
            className={`text-xs sm:text-sm md:text-lg lg:text-xl text-[#F6F8F6] font-bold ${out_fit.className} leading-tight`}
          >
            Seamless forms, smarter data all in one place.
          </p>
          <p
            className={`text-xs sm:text-sm md:text-lg lg:text-xl font-bold mt-2 sm:mt-4 ${out_fit.className} text-[#F6F8F6]`}
          >
            FormSpace
          </p>
          <div className="flex flex-wrap gap-3 text-xs sm:text-sm md:text-lg lg:text-xl mt-2 text-[#F6F8F6]">
            <ContactButton user_ID={user_ID} />

            <span
              onClick={() => setShowTerms(true)}
              className="hover:underline cursor-pointer"
            >
              Terms and Conditions
            </span>

            <span
              onClick={() => scrollToSection("about")}
              className="hover:underline cursor-pointer"
            >
              About Us
            </span>
          </div>
        </div>

        <div className="flex justify-end mt-0 lg:mt-20">
          <p className="text-xs sm:text-sm md:text-lg lg:text-xl font-semibold text-[#F6F8F6] mt-0">
            Made with 🤍 by ACM-VIT
          </p>
        </div>
      </div>

      {/* Divider */}
      <hr className="mt-6 border-0 h-[2px] bg-[#F6F8F6] w-full mb-4" />

      {/* Bottom row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
        {/* ACM logo */}
        <a
          href="https://www.acmvit.in/"
          target="_blank"
          rel="noopener noreferrer"
          className="scale-[1.25] hover:opacity-80 transition-opacity"
        >
          <Image src="/ACM.svg" alt="ACM logo" width={90} height={90} />
        </a>

        {/* Social icons */}
        <div className="flex items-center gap-4">
          {[
            {
              href: "https://github.com/ACM-VIT",
              icon: "/Github.svg",
              alt: "GitHub",
            },
            {
              href: "https://www.instagram.com/acmvit",
              icon: "/InstagramIcon.svg",
              alt: "Instagram",
            },
            { href: "https://x.com/ACM_VIT", icon: "/twitter.svg", alt: "X" },
            {
              href: "https://www.linkedin.com/company/acmvit/",
              icon: "/linkedin.svg",
              alt: "LinkedIn",
            },
          ].map((item, index) => (
            <a
              key={index}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              <Image
                src={item.icon}
                alt={item.alt}
                width={28}
                height={28}
                className="w-7 sm:w-8 h-7 sm:h-8"
              />
            </a>
          ))}
        </div>
      </div>

      {/* Modal */}
      <TermsModal open={showTerms} onClose={() => setShowTerms(false)} />
    </div>
  );
}
