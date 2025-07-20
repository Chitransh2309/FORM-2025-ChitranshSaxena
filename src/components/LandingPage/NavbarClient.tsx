// app/components/NavbarClient.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
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

import { useRouter, usePathname } from "next/navigation";

export function Links() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // turn the loader off when pathname changes
  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  const handleDashboardClick = (e: React.MouseEvent) => {
    e.preventDefault(); // suppress <Link>’s default to run our logic
    setLoading(true);
    router.push("/dashboard"); // pages-router: Router.push('/dashboard')
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <Loader />
        </div>
      )}

      <nav className="flex gap-16">
        <Link href="#home" onClick={() => setLoading(false)}>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Home
          </span>
        </Link>

        {/* Dashboard uses router.push so we can toggle the loader */}
        <Link href="/dashboard" onClick={handleDashboardClick}>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Dashboard
          </span>
        </Link>

        <Link href="#features" onClick={() => setLoading(false)}>
          <span className="text-base sm:text-lg md:text-xl lg:text-2xl dark:text-white">
            Features
          </span>
        </Link>
      </nav>
    </>
  );
}
