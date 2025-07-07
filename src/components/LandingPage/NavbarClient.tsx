// app/components/NavbarClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Grip } from "lucide-react";

// 🍔 Mobile-only hamburger and dropdown
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="sm:hidden z-20" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <X size={24} className="dark:text-white" />
        ) : (
          <Grip size={24} className="dark:text-white" />
        )}
      </div>

      <div
        className={`sm:hidden flex-col items-start gap-4 ${
          isOpen
            ? "flex absolute top-16 left-0 w-full bg-[#F6F8F6] dark:bg-[#191719] p-4 shadow-md z-10"
            : "hidden"
        }`}
      >
        <Links />
      </div>
    </>
  );
}

// 🧭 Navigation links
export function Links() {
  return (
    <>
      <Link href="#home">
        <span className="dark:text-white">Home</span>
      </Link>
      <Link href="/dashboard">
        <span className="dark:text-white">Dashboard</span>
      </Link>
      <Link href="#features">
        <span className="dark:text-white">Features</span>
      </Link>
      <Link href="#contact">
        <span className="dark:text-white">Contact</span>
      </Link>
    </>
  );
}
