// app/components/NavbarClient.tsx
"use client";

import Link from "next/link";
import ToggleSwitch from "./ToggleSwitch";
import { useState } from "react";
import { Menu, X, Grip } from "lucide-react";

export default function NavbarClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Hamburger Menu */}
      <div className="sm:hidden z-20" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <X size={24} className="dark:text-white" />
        ) : (
          //<Menu size={24} className="dark:text-white" />
          <Grip size={24} className="dark:text-white" />
        )}
      </div>

      {/* Links */}
      <div
        className={`flex-col sm:flex-row items-center gap-4 sm:gap-5 sm:flex ${
          isOpen
            ? "flex absolute top-14 left-0 w-full bg-white dark:bg-black p-4 shadow-md z-10"
            : "hidden"
        }`}
      >
        <Link href="/dashboard">
          <span className="dark:text-white">Home</span>
        </Link>
        <Link href="/about">
          <span className="dark:text-white">About</span>
        </Link>
        <Link href="/features">
          <span className="dark:text-white">Features</span>
        </Link>
        <Link href="/contact">
          <span className="dark:text-white">Contact</span>
        </Link>
        {/* Mobile Right */}
        <div className="sm:hidden flex flex-col items-start gap-3 p-4">
          <ToggleSwitch />
          {children}
        </div>
      </div>

      {/* Right side for desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <ToggleSwitch />
        {children}
      </div>
    </>
  );
}
