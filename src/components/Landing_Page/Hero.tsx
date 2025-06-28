import React from 'react'
import AuthBtn from './AuthBtn'
import { Tilt_Warp } from 'next/font/google';

const tilt = Tilt_Warp({ subsets: ['latin'], weight: ['400'] });

export default function Hero() {
  return (
    <div className={`min-h-screen flex items-center w-full ${tilt.className} dark:bg-[#191719] px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto w-full">
        {/* Mobile Layout */}
        <div className="flex flex-col lg:hidden space-y-8">
          {/* Mobile Hero Text */}
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#61A986] leading-tight">
              EFFORTLESS<br />
              FORMS,<br />
              EVERY TIME
            </h1>
            <div className="mt-8">
              <AuthBtn pos={"hero"} />
            </div>
          </div>

          {/* Mobile Grid - Simplified */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 aspect-square">
            <div className="aspect-square">
              <div className="w-full h-full border-4 sm:border-6 border-[#61A986] rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col">
              </div>
            </div>
            <div className="aspect-square">
              <div className="w-full h-full border-4 sm:border-6 border-[#3D3D3D] rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col dark:border-[#A9A8A9]">
              </div>
            </div>
            <div className="aspect-square">
              <div className="w-full h-full border-4 sm:border-6 border-[#E6AD00] rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col">
              </div>
            </div>
            <div className="aspect-square">
              <div className="w-full h-full border-4 sm:border-6 border-[#61A986] rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex flex-col">
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:flex lg:items-center lg:space-x-12 xl:space-x-16">
          {/* Desktop Hero Text */}
          <div className="flex-1 max-w-2xl">
            <h1 className="text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-[#61A986] leading-tight xl:leading-normal">
              EFFORTLESS<br />
              FORMS,<br />
              EVERY TIME
            </h1>
            <div className="mt-8 xl:mt-12">
              <AuthBtn pos={"hero"} />
            </div>
          </div>

          {/* Desktop Grid */}
          <div className="flex-1 max-w-2xl">
            <div className="grid grid-cols-2 grid-rows-8 gap-4 xl:gap-6 h-[600px] xl:h-[700px] 2xl:h-[800px]">
              <div className="col-span-1 row-span-2">
                <div className="w-full h-full border-6 xl:border-8 border-[#61A986] rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-4">
                <div className="w-full h-full border-6 xl:border-8 border-[#3D3D3D] rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col dark:border-[#A9A8A9]">
                </div>
              </div>
              <div className="col-span-1 row-span-4">
                <div className="w-full h-full border-6 xl:border-8 border-[#E6AD00] rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-3">
                <div className="w-full h-full border-6 xl:border-8 border-[#61A986] rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-1">
                <div className="w-full h-full border-6 xl:border-8 border-[#3D3D3D] rounded-2xl xl:rounded-3xl p-3 xl:p-4 flex flex-col dark:border-[#A9A8A9]">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}