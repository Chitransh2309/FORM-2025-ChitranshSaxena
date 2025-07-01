// app/components/Navbar.tsx
import Link from "next/link";
import AuthBtn from "./AuthBtn";
import NavbarClient from "./NavbarClient";
import { Outfit } from "next/font/google";

const out_font = Outfit({ subsets: ["latin"], weight: ["400", "800"] });

export default function Navbar() {
  return (
    <header
      className={`px-9 py-6 text-black text-2xl font-bold bg-[#F6F8F6] ${out_font.className} dark:bg-[#191719] dark:text-#ffffff`}
    >
      <nav className="flex items-center justify-between px-4 py-2 bg-none relative">
        <Link href="/">
          <p className="dark:text-white text-xl font-bold">F.O.R.M</p>
        </Link>

        {/* Client Part */}
        <NavbarClient>
          <AuthBtn pos="nav" />
        </NavbarClient>
      </nav>
    </header>
  );
}
