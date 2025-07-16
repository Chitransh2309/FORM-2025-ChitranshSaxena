// components/ThankYouPage.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { Pathway_Extreme } from "next/font/google";

const pathway = Pathway_Extreme({ subsets: ["latin"], weight: ["500", "600", "700"] });

export default function ThankYouPage({ formId }: { formId: string }) {
  return (
    <div
      className={`min-h-screen flex flex-col md:flex-row bg-white dark:bg-[#2B2A2A] text-black dark:text-white ${pathway.className}`}
    >
      {/* Left: Illustration */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <Image
            src="/ThankYou.svg"
            height={700}
            width={700}
            alt="Thank You"
            className="w-full"
          />
        </div>
      </div>

      {/* Right: Message + Buttons */}
      <div className="flex-1 bg-[#61A986] dark:bg-[#2B2A2A] text-white flex flex-col items-center justify-center p-10">
        <h2 className="text-lg md:text-xl mb-4 text-center">
          We have received your response.
        </h2>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/">
            <button className="relative px-1 py-1 text-sm font-medium group bg-transparent">
              <span className="absolute inset-0 p-[0.5px] bg-white dark:bg-gradient-to-r from-[#39EBA6] to-[#617DA9] group-hover:opacity-100 transition-opacity"></span>
              <span className="relative z-10 block bg-[#5DAD8D] dark:bg-[#2B2A2A] text-[#61A986] text-white px-6 py-2 group-hover:opacity-90">
                Go Back To Homepage
              </span>
            </button>
          </Link>
          {/*<Link href={`/form/${formId}`}>
            <button className="relative px-1 py-1 text-sm font-medium group bg-transparent">
              <span className="absolute inset-0 p-[1px] bg-white dark:bg-gradient-to-r from-[#39EBA6] to-[#617DA9] group-hover:opacity-100 transition-opacity"></span>
              <span className="relative z-10 block bg-[#5DAD8D] dark:bg-[#2B2A2A] text-[#61A986] text-white  px-6 py-2 group-hover:opacity-90">
                Submit Another Response
              </span>
            </button>
          </Link>*/}
        </div>
      </div>
    </div>
  );
}

