import Link from "next/link";
import Image from "next/image";
import { Outfit } from "next/font/google";
import ContactButton from "./ContactButton"; // New client component
import { getUser } from "@/app/action/getUser";

const out_fit = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default async function Footer() {
  const user = await getUser();
  const user_ID = user?.user_ID || "";

  return (
    <div className="w-full p-4 sm:p-6 bg-[#61A986]" id="contact">
      {/* Main content */}
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
            {/* 🔘 Replaces Button + Popup */}
            <ContactButton user_ID={user_ID} />

            <Link href="/about" className="hover:underline">
              Terms and Conditions
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

      <hr className="mt-6 border-0 h-[2px] bg-[#F6F8F6] w-full mb-2 dark:bg-[#F6F8F6]" />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0 mx-0 sm:mx-4 mt-1 mb-0">
        <div className="flex items-center scale-[1.2] ml-3 sm:ml-4 mt-4 sm:mt-[12px]">
          <a
            href="https://www.acmvit.in/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/ACM.svg"
              alt="ACM logo"
              width={90}
              height={90}
              className="scale-[1.350] hover:opacity-80 cursor-pointer transition-opacity"
            />
          </a>
        </div>

        <div className="flex justify-center items-center gap-2">
          {/* social icons */}
        </div>
      </div>
    </div>
  );
}
