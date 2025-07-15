import React from "react";
import { Tilt_Warp } from "next/font/google";
import Image from "next/image";

const tilt = Tilt_Warp({ subsets: ["latin"], weight: ["400"] });

// interface GridBoxesProps {
//   large?: boolean;
// }

export default function Hero() {
  return (
    <div
      id="home"
      className={`w-full flex items-center justify-center ${tilt.className} dark:bg-[#191719]`}
    >
      <div className="px-10 mt-5 md:mt-10 w-full max-w-[1440px]">
        {/* Mobile & Tablet View */}
        <div className="flex flex-col lg:hidden items-center gap-10 px-4">
          <HeroText />
          <GridBoxes />
        </div>

        {/* Desktop View: Text left, image right */}
        <div className="hidden lg:flex items-center justify-between w-full gap-10">
          <div className="flex-1">
            <HeroText />
          </div>
          <div className="flex-1 flex justify-end">
            <GridBoxes />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroText() {
  return (
    <h1
      className=" dark:text-white text-[42px] sm:text-[60px] md:text-[75px] lg:text-[95px] leading-[1.2] tracking-[-0.02em] text-left font-normal"
      style={{ backdropFilter: "blur(2px)" }}
    >
      <span className="hidden lg:block whitespace-pre-line">
        Forms{"\n"}That Fit{"\n"}Every{"\n"}{" "}
        <span className="bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
          Space
        </span>
      </span>

      <span className="lg:hidden flex flex-wrap items-center gap-2">
        <span>Forms</span>
        <span>That</span>
        <span>Fit</span>
        <span>Every</span>
        <span className="bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
          Space
        </span>
      </span>
    </h1>
  );
}

function GridBoxes() {
  return (
    <div className="w-full max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px]">
      <Image
        src="/formlightmode.svg"
        alt="Form Light Mode"
        width={3000}
        height={1600}
        priority
        className="block dark:hidden w-full h-auto object-contain"
      />
      <Image
        src="/formdarkmode.svg"
        alt="Form Dark Mode"
        width={3000}
        height={1600}
        priority
        className="hidden dark:block w-full h-auto object-contain"
      />
    </div>
  );
}
