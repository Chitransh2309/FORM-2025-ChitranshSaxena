import { TbShare3 } from "react-icons/tb";
import { GrDocument } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import Image from "next/image";

interface SidebarProps {
  searchTerm: string;
  setSearchTerm: (t: string) => void;
  selected: "myForms" | "shared" | "starred" | "trash";
  setSelected: (s: "myForms" | "shared" | "starred" | "trash") => void;
}

export default function Sidebar({
  searchTerm,
  setSearchTerm,
  selected,
  setSelected,
}: SidebarProps) {
  /* helper: returns hover class or active class */
  const linkClass = (key: SidebarProps["selected"]) =>
    `w-full text-left px-4 py-3 flex items-center gap-3 text-lg rounded ${
      selected === key
        ? "bg-[#4a9470] text-white dark:bg-[#333333]"
        : "hover:bg-[#4a9470] dark:hover:bg-[#333333]"
    }`;

  return (
    <div className="bg-[#56A37D] w-full h-screen flex flex-col px-6 py-6 dark:text-white dark:bg-[#414141]">
      {/* ─── logo ─── */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo-component.svg"
          alt="LOGO"
          width={32}
          height={32}
          className="h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10"
        />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">FormSpace</h1>
      </div>

      {/* ─── search ─── */}
      <div className="mb-6">
        <p className="text-xl font-semibold mb-8">My workspace</p>
        <div className="bg-[#D9D9D9] rounded-lg mb-2 px-4 py-3 dark:bg-[#2B2A2A]">
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-white"
          />
        </div>
      </div>

      {/* ─── nav buttons ─── */}
      <div className="flex-1 space-y-2">
        <button
          className={linkClass("myForms")}
          onClick={() => setSelected("myForms")}
        >
          <GrDocument size={20} />
          My Forms
        </button>

        <button
          className={linkClass("shared")}
          onClick={() => setSelected("shared")}
        >
          <TbShare3 size={20} />
          Shared with me
        </button>

        <button
          className={linkClass("starred")}
          onClick={() => setSelected("starred")}
        >
          <FaRegStar size={20} />
          Starred
        </button>

        <button
          className={linkClass("trash")}
          onClick={() => setSelected("trash")}
        >
          <LuTrash2 size={20} />
          Trash
        </button>
      </div>
    </div>
  );
}
