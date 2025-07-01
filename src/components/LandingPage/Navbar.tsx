// app/components/Navbar.tsx
import Link from "next/link";
import AuthBtn from "./AuthBtn";
import { MobileMenu, Links } from "./NavbarClient"; // ✅ named imports
import NavbarToggle from "./NavbarToggle";
import { Outfit } from "next/font/google";

const out_font = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Navbar() {
  return (
    <header
      className={`px-4 py-4 text-black text-2xl font-bold bg-[#F6F8F6] ${out_font.className} dark:bg-[#191719] dark:text-white`}
    >
      <nav className="flex items-center justify-between relative">
        {/* LEFT: Hamburger + Logo */}
        <div className="flex items-center gap-3">
          <MobileMenu />
          <Link href="/">
            <p className="text-xl font-bold dark:text-white">F.O.R.M</p>
          </Link>
        </div>

        {/* CENTER: Links (visible only on desktop) */}
        <div className="hidden sm:flex gap-6">
          <Links />
        </div>

        {/* RIGHT: Toggle + Auth */}
        <div className="flex items-center gap-3">
          <NavbarToggle />
          <AuthBtn pos="nav" />
        </div>
      </nav>
    </header>
  );
}
