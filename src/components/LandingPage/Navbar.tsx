// app/components/Navbar.tsx
import Link from "next/link";
import AuthBtn from "./AuthBtn";
import { MobileMenu, Links } from "./NavbarClient";
import NavbarToggle from "./NavbarToggle";
import { Outfit } from "next/font/google";
import Image from "next/image";

const out_font = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Navbar() {
  return (
    <header
      className={`px-4 sm:px-6 md:px-10 lg:px-16 py-3 sm:py-4 bg-[#F6F8F6] dark:bg-[#191719] text-black dark:text-white ${out_font.className}`}
    >
      <nav className="flex items-center justify-between w-full">
        {/* LEFT: Logo + Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-1 sm:gap-2">
            <Image
              src="/logoform.svg"
              alt="LOGO"
              width={32}
              height={32}
              className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10"
            />
            <span className="text-lg sm:text-xl md:text-2xl font-bold">
              FormSpace
            </span>
          </Link>
        </div>

        {/* CENTER: Nav Links for Desktop */}
        <div className="hidden lg:flex gap-4 xl:gap-6">
          <Links />
        </div>

        {/* RIGHT: Toggle + Auth Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          <NavbarToggle />
          <AuthBtn pos="nav" />
        </div>
      </nav>
    </header>
  );
}
