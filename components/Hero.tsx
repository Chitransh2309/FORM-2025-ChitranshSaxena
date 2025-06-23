import React from 'react'
import AuthBtn from './AuthBtn'
import { Tilt_Warp } from 'next/font/google';

const tilt= Tilt_Warp({subsets: ['latin'],weight:['400']});
export default function Hero() {
  return (
    <div className={`flex items-center h-full w-full ${tilt.className}`}>
        <div className='w-1/2 ml-20 mb-30'>
            <p className='text-7xl font-extrabold text-[#61A986] leading-normal text-justify'>
                EFFORTLESS <br /> 
                FORMS, <br />
                EVERY TIME
            </p>
            <AuthBtn pos={"hero"}/>
        </div>
        <div className="w-1/2 grid grid-cols-2 grid-rows-8 gap-5 h-full p-4 mr-15">
            <div className="col-span1 row-span-2">
                <div className='w-full h-full min-h-0 border-8 border-[#61A986] rounded-3xl p-4 flex flex-col gap-5'>

                </div>
            </div>
            <div className="col-span-1 row-span-4">
                <div className="w-full h-full min-h-0 border-8 border-[#3D3D3D] rounded-3xl p-4 flex flex-col gap-5">
                </div>
            </div>
            <div className="col-span-1 row-span-4">
                <div className="w-full h-full min-h-0 border-8 border-[#E6AD00] rounded-3xl p-4 flex flex-col gap-5">
                </div>
            </div>
            <div className="col-span-1 row-span-3">
                <div className="w-full h-full min-h-0 border-8 border-[#61A986] rounded-3xl p-4 flex flex-col gap-5">
                </div>
            </div>
            <div className="col-span-1 row-span-1">
                <div className="w-full h-full min-h-0 border-8 border-[#3D3D3D] rounded-3xl p-4 flex flex-col gap-5">
                </div>
            </div>
        </div>

    </div>
  )
}
