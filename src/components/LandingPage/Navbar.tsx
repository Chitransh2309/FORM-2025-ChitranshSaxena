// app/components/Navbar.tsx
import Link from "next/link";
import AuthBtn from "./AuthBtn";
import { MobileMenu, Links } from "./NavbarClient"; // ✅ named imports
import NavbarToggle from "./NavbarToggle";
import { Outfit } from "next/font/google";
import Image from "next/image";

const out_font = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Navbar() {
  return (
    <header
      className={`py-4 text-black text-2xl font-bold bg-[#F6F8F6] ${out_font.className} dark:bg-[#191719] dark:text-white`}
    >
      <nav className="flex items-center justify-between relative flex-wrap gap-x-4">
        {/* LEFT: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/" className="flex items-center gap-2 lg:pl-20 md:pl-5">
            <Image
              src="/FormLogo.svg"
              alt="LOGO"
              width={40}
              height={40}
              className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12"
            />

            <span className="text-xl sm:text-2xl md:text-3xl font-bold dark:text-white">
              FormSpace
            </span>
          </Link>
        </div>

        {/* CENTER: Links (visible only on desktop) */}
        <div className="hidden lg:flex gap-6">
          <Links />
        </div>

        {/* RIGHT: Toggle + Auth */}
        <div className="flex items-center gap-2 sm:gap-3 pr-2 sm:pr-4 md:pr-5">
          <NavbarToggle />
          <AuthBtn pos="nav" />
        </div>
      </nav>
    </header>
  );
}
