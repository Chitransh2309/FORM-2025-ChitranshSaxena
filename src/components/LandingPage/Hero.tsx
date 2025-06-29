import React from 'react'
import AuthBtn from './AuthBtn'
import { Tilt_Warp } from 'next/font/google';

const tilt = Tilt_Warp({ subsets: ['latin'], weight: ['400'] });

export default function Hero() {
  return (
    <div className={`min-h-screen flex items-center w-full ${tilt.className} dark:bg-[#191719] px-4 sm:px-6 lg:px-8`}>
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col lg:hidden space-y-6 sm:space-y-8">
          <div className="text-left ml-4 sm:ml-6 md:ml-8 -mt-4 sm:-mt-8 md:-mt-12">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-[#61A986]">
              EFFORTLESS<br />
              FORMS,<br />
              EVERY TIME
            </h1>
            <div className="mt-6 sm:mt-8">
              <AuthBtn pos={"hero"} />
            </div>
          </div>
          <div className="px-2 sm:px-4">
            <div className="grid grid-cols-2 grid-rows-8 gap-2 sm:gap-3 md:gap-4 h-[350px] sm:h-[450px] md:h-[550px]">
              <div className="col-span-1 row-span-2">
                <div className="w-full h-full border-5 sm:border-6 md:border-8 border-[#61A986] rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-4">
                <div className="w-full h-full border-5 sm:border-6 md:border-8 border-[#3D3D3D] rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 flex flex-col dark:border-[#A9A8A9]">
                </div>
              </div>
              <div className="col-span-1 row-span-4">
                <div className="w-full h-full border-5 sm:border-6 md:border-8 border-[#E6AD00] rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-3">
                <div className="w-full h-full border-5 sm:border-6 md:border-8 border-[#61A986] rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 flex flex-col">
                </div>
              </div>
              <div className="col-span-1 row-span-1">
                <div className="w-full h-full border-5 sm:border-6 md:border-8 border-[#3D3D3D] rounded-xl sm:rounded-2xl md:rounded-3xl p-2 sm:p-3 flex flex-col dark:border-[#A9A8A9]">
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="hidden lg:flex lg:items-center lg:space-x-12 xl:space-x-16">
          <div className="flex-1 max-w-2xl ml-8 xl:ml-12 lg:-mt-12 xl:-mt-16 2xl:-mt-20">
            <h1 className="text-7xl xl:text-8xl 2xl:text-9xl font-extrabold text-[#61A986] leading-tight xl:leading-normal">
              EFFORTLESS<br />
              FORMS,<br />
              EVERY TIME
            </h1>
            <div className="mt-8 xl:mt-12">
              <AuthBtn pos={"hero"} />
            </div>
          </div>
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