import React from 'react';
import Link from 'next/link';
import { Copyright, LinkedinIcon, InstagramIcon } from 'lucide-react';
import { Outfit } from 'next/font/google';
import Image from 'next/image';

const out_fit = Outfit({ subsets: ['latin'], weight: ['400', '800'] });

export default function Footer() {
  return (
    <div className="min-h-40 w-full p-3 sm:p-6 bg-[#61A986]" id="contact">
      {/* Main content section */}
      <div className="flex flex-col lg:flex-row lg:justify-between gap-4 lg:gap-0">
        {/* Left section - Brand and links */}
        <div className="flex-1 max-w-none lg:max-w-2xl">
          <p
            className={`text-lg sm:text-xl lg:text-2xl text-[#F6F8F6] font-bold ${out_fit.className} dark:text-[#000000] leading-tight`}
          >
            "Forms that hustle, so you don't have to."
          </p>
          <p
            className={`text-lg sm:text-xl font-bold mt-2 sm:mt-4 ${out_fit.className} text-[#F6F8F6] dark:text-[#000000]`}
          >
            F.O.R.M
          </p>
          {/* Navigation links */}
          <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm mt-2 text-[#F6F8F6] dark:text-[#000000]">
            <Link href="/" className="hover:underline">
              Product
            </Link>
            <Link href="/" className="hover:underline">
              Contact Us
            </Link>
            <Link href="/" className="hover:underline">
              Privacy Policy
            </Link>
            <Link href="/" className="hover:underline">
              About Us
            </Link>
          </div>
        </div>

       
      </div>

      {/* Divider */}
      <hr className="mt-4 sm:mt-6 border border-[#F6F8F6] mx-0 sm:mx-4 mb-3 dark:border-[#191719]" />

      {/* Bottom section - Copyright and social icons */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0 mx-0 sm:mx-4">
        {/* Copyright */}
        <div className="flex items-center">
          <Copyright className="w-4 h-4 sm:w-5 sm:h-5 text-[#F6F8F6] dark:stroke-[#000000]" />
          <span className="ml-1 text-xs sm:text-sm text-[#F6F8F6] dark:text-[#000000]">
            2025 F.O.R.M
          </span>
        </div>

        {/* Social icons */}
        <div className="flex justify-center gap-4 sm:gap-5">
          <InstagramIcon className="w-5 h-5 sm:w-6 sm:h-6 text-[#F6F8F6] dark:stroke-[#000000] hover:opacity-80 cursor-pointer transition-opacity" />
          <Image
            src="/twitter.svg"
            alt="X icon"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 stroke-none fill-[#F6F8F6] dark:stroke-none dark:fill-[#000000] hover:opacity-80 cursor-pointer transition-opacity"
          />
          <Image
            src="/linkedin.svg"
            alt="LinkedIn icon"
            width={24}
            height={24}
            className="w-5 h-5 sm:w-6 sm:h-6 stroke-none dark:stroke-none dark:fill-[#000000] hover:opacity-80 cursor-pointer transition-opacity"
          />
        </div>
      </div>
    </div>
  );
}
