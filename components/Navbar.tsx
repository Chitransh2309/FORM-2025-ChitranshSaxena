import Link from 'next/link'
import React from 'react'
import ToggleSwitch from './ToggleSwitch'
import AuthBtn from './AuthBtn'


export default async function Navbar() {

  return (
    <header className='px-9 py-6 text-black text-2xl font-bold sticky top-0 absolute'>
      <nav className='flex justify-between items-center h-9'>
        <Link href="/">
            <p className="px-8">F.O.R.M</p>
        </Link>
        <div className='flex items-center gap-5 text-black'>
            <Link href='/'>
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
