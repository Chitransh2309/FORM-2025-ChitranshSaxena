import { CiCirclePlus } from "react-icons/ci";
import { TbShare3 } from "react-icons/tb";
import { GrDocument } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import Image from "next/image";

export default function Sidebar({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}) {
  return (
    <div className="bg-[#56A37D] w-full h-screen overflow-hidden flex flex-col px-6 py-6 dark:text-white dark:bg-[#414141]">
      <div className="flex items-center gap-3 mb-8">
        <Image src="/main-icon.png" alt="icon" width={33} height={33} />
        <h1 className=" text-2xl font-bold">F.O.R.M</h1>
      </div>

      <div className="mb-6">
        <p className=" text-lg font-semibold mb-4">My workspace</p>

        <div className="bg-[#D9D9D9] rounded-lg mb-4 px-4 py-3 dark:bg-[#2B2A2A]">
          <input
            type="text"
            placeholder="Search forms..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent outline-none text-black dark:text-white placeholder:text-gray-600 dark:placeholder:text-white"
          />
        </div>

        <div className="bg-[#D9D9D9] rounded-lg mb-4 dark:bg-[#2B2A2A]">
          <button className="w-full text-left px-4 py-3 text-black flex items-center gap-3 text-lg dark:text-[#61A986] text-center">
            <CiCirclePlus size={24} />
            New label
          </button>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <button className="w-full text-left px-4 py-3 flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded dark:hover:bg-[#333333]">
          <TbShare3 size={20} />
          Shared with me
        </button>

        <button className="w-full text-left px-4 py-3 flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded dark:hover:bg-[#333333]">
          <GrDocument size={20} />
          Drafts
        </button>

        <button className="w-full text-left px-4 py-3 flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded dark:hover:bg-[#333333]">
          <FaRegStar size={20} />
          Starred
        </button>

        <button className="w-full text-left px-4 py-3 flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded dark:hover:bg-[#333333]">
          <LuTrash2 size={20} />
          Trash
        </button>
      </div>
    </div>
  );
}
