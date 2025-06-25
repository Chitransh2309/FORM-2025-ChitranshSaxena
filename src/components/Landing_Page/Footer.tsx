import React from 'react'
import AuthBtn from './AuthBtn'
import Link from 'next/link'
import { Copyright, FacebookIcon, InstagramIcon, TwitterIcon } from 'lucide-react'
import { Outfit } from 'next/font/google';
const out_fit=Outfit({subsets:['latin'], weight:['400','800']});
export default function Footer() {
  return (
    <div className='h-40 w-full p-3 bg-[#61A986]'>
      <div className='flex justify-between'>
        <div className='ml-10'>
          <p className={`text-2xl text-#F6F8F6 font-bold ${out_fit.className}`}>
            "Forms that hustle, so you don't have to."
          </p>
          <p className={`text-xl text-#F6F8F6 font-bold mt-4 ${out_fit.className}`}>
            F.O.R.M
          </p>
          <div className='flex justify-start text-sm gap-3'>
              <Link href="/">Product</Link>
              <Link href="/">Contact Us</Link>
              <Link href="/">Privacy Policy</Link>
              <Link href="/">About Us</Link>
          </div>
        </div>
        <div className='mr-12 mt-7'>
          <AuthBtn pos='footer'/>
        </div>
      </div>
      <hr className='mt-3 align-center border border-1 mx-8 mb-2 dark:stroke-[#000000]' />
      <div className='flex justify-between mx-9'>
        <div>
          <Copyright className='dark:stroke-[#000000]'/>
        </div>
        <div className='flex justify-between gap-5'>
          <InstagramIcon />
          <TwitterIcon className='stroke-none fill-white' />
          <FacebookIcon className='stroke-none fill-white' />
        </div>
      </div>
    </div>
  )
}
