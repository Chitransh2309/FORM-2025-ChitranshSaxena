import React from 'react';
import AuthBtn from './AuthBtn';
import { Tilt_Warp } from 'next/font/google';
import Image from 'next/image';

const tilt = Tilt_Warp({ subsets: ['latin'], weight: ['400'] });

interface GridBoxesProps {
  large?: boolean;
}

export default function Hero() {
  return (
    <div
      id="home"
      className={` w-full flex items-center justify-center ${tilt.className} dark:bg-[#191719]`}
    >
      <div className="w-full max-w-[1440px]">

        <div className="flex flex-col lg:hidden items-center gap-10 px-4">
          <div className="w-full max-w-[555px]">
            <div className="relative w-full h-[431px] backdrop-blur-sm">
              <h1 className="absolute w-full h-[324px] font-tilt text-[64px] sm:text-[72px] md:text-[90px] leading-[1.2] tracking-[-0.02em] text-black dark:text-white whitespace-pre-line">
                FORMS{"\n"}THAT FIT{"\n"}EVERY
              </h1>
              <div className="absolute top-[324px] w-full h-[107px]">
                <h2 className="text-[64px] sm:text-[72px] md:text-[90px] leading-[1.2] tracking-[-0.02em] font-tilt bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
                  SPACE
                </h2>
              </div>
            </div>
          </div>
          <GridBoxes />
        </div>

        <div className="hidden lg:flex items-center justify-between px-8">

          <div className="flex-1 max-w-[555px]">
            <div className="relative w-full h-[431px] backdrop-blur-sm">
              <h1 className="absolute w-full h-[324px] font-tilt text-[90px] leading-[1.2] tracking-[-0.02em] text-black dark:text-white whitespace-pre-line">
                FORMS{"\n"}THAT FIT{"\n"}EVERY
              </h1>
              <div className="absolute top-[324px] w-full h-[107px]">
                <h2 className="text-[90px] leading-[1.2] tracking-[-0.02em] font-tilt bg-gradient-to-r from-[#617DA9] via-[#61A986] to-[#61A986] bg-clip-text text-transparent">
                  SPACE
                </h2>
              </div>
            </div>

          </div>

          <div className="flex-1">
            <GridBoxes large />
          </div>
        </div>
      </div>
    </div>
  );
}

function GridBoxes({ large = false }: GridBoxesProps) {


  return (
    <div className={`flex items-center justify-center w-full mt-20`}>

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
