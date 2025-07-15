// app/components/NavbarClient.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { X, Grip } from "lucide-react";
import Loader from "../Loader";

// 🍔 Mobile-only hamburger and dropdown
export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden z-20" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? (
          <X size={24} className="dark:text-white" />
        ) : (
          <Grip size={24} className="dark:text-white" />
        )}
      </div>

      <div
        className={`lg:hidden flex-col items-start gap-4 ${
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
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
  }

  return (
    <>
      {loading && (
        <div className="z-50">
          <Loader />
        </div>
      )}

      <div className="flex gap-16">
        <Link href="#home">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Home
          </span>
        </Link>
        <Link href="dashboard" onClick={handleClick}>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Dashboard
          </span>
        </Link>
        <Link href="#features">
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Features
          </span>
        </Link>
      </div>
    </>
  );
}
