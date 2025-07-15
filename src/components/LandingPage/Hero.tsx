import React from "react";
import AuthBtn from "./AuthBtn";
import { Tilt_Warp } from "next/font/google";
import Image from "next/image";

const tilt = Tilt_Warp({ subsets: ["latin"], weight: ["400"] });

interface GridBoxesProps {
  large?: boolean;
}

export default function Hero() {
  return (
    <div
      id="home"
      className={`w-full flex items-center justify-center ${tilt.className} dark:bg-[#191719]`}
    >
      <div className="w-full max-w-[1440px] px-4 lg:px-8">
        {/* Mobile & Tablet View */}
        <div className="flex flex-col lg:hidden items-center gap-10 px-4">
          <HeroText />
          <GridBoxes />
        </div>

        {/* Desktop View: Text left, image right */}
        <div className="hidden lg:flex items-center justify-between">
          <div className="w-full sm:w-1/2">
            <HeroText />
          </div>
          <div className="w-full sm:w-1/2">
            <GridBoxes />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroText() {
  return (
    <h1 className="mt-[50px] text-[40px] sm:text-[56px] md:text-[72px] lg:text-[90px] font-bold leading-tight tracking-[-0.02em] text-left text-black dark:text-white">
      <span className="hidden lg:block whitespace-pre-line">
        FORMS{"\n"}THAT FIT{"\n"}EVERY{"\n"}{" "}
        <span className="bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
          SPACE
        </span>
      </span>

      <span className="lg:hidden flex flex-wrap items-center gap-2">
        <span>FORMS</span>
        <span>THAT</span>
        <span>FIT</span>
        <span>EVERY</span>
        <span className="bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
          SPACE
        </span>
      </span>
    </h1>
  );
}

function GridBoxes({ large = false }: GridBoxesProps) {
  return (
    <div className="flex items-center justify-center w-full mt-12 md:mt-16 lg:mt-20">
      <Image
        src="/formlightmode.svg"
        alt="Form Light Mode"
        width={1600}
        height={1000}
        priority
        className="w-full max-w-[1400px] h-auto object-contain block dark:hidden"
      />

      <Image
        src="/formdarkmode.svg"
        alt="Form Dark Mode"
        width={1600}
        height={1000}
        priority
        className="w-full max-w-[1400px] h-auto object-contain hidden dark:block"
      />
    </div>
  );
}
