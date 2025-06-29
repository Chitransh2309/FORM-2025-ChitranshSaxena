import Link from 'next/link'
import React from 'react'
import ToggleSwitch from './ToggleSwitch'
import AuthBtn from './AuthBtn'
import { Outfit } from 'next/font/google';

const out_font= Outfit({subsets:['latin'],weight:['400','800']})
export default function Navbar() {
  return (
    <header className={`px-9 py-6 text-black text-2xl font-bold bg-[#F6F8F6] ${out_font.className} dark:bg-[#191719] dark:text-#ffffff`}>
      <nav className='flex justify-between items-center h-9 '>
        <Link href="/">
            <p className="px-8 dark:text-[#ffffff]">F.O.R.M</p>
        </Link>
        <div className='flex items-center gap-5 text-black dark:text-[#ffffff]'>
            <Link href='/dashboard'>
                <span>Home</span>
            </Link>
            <Link href='/about'>
                <span>About</span>
            </Link>
            <Link href='/features'>
                <span>Features</span>
            </Link>
            <Link href='/contact'>
                <span>Contact</span>
            </Link>
        </div>
        <div className='flex items-center gap-5 text-black'>
            <ToggleSwitch />
            <AuthBtn pos="nav"/>
        </div>
      </nav>
    </header>
  )
}
