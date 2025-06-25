
import Image from 'next/image'
import { TbShare3} from "react-icons/tb";
import { GrDocument } from "react-icons/gr";
import { FaRegStar } from "react-icons/fa";
import { LuTrash2 } from "react-icons/lu";
import { CiCirclePlus } from "react-icons/ci";
import Searchbar from "./Searchbar";

export default function Sidebar(){
    return (
        <div className="bg-[#56A37D] w-64 h-screen flex flex-col px-6 py-6">
            
            <div className='flex items-center gap-3 mb-8'>
                <Image src="/main-icon.png" alt='icon' width={33} height={33}/>
                <h1 className="text-white text-2xl font-bold">F.O.R.M</h1>
            </div>
            
            <div className="mb-6">
                <p className="text-white text-lg font-semibold mb-4">My workspace</p>
                
                <div className="bg-[#D9D9D9] rounded-lg mb-4 px-4 py-3">
                    <Searchbar />
                </div>
                
                <div className="bg-[#D9D9D9] rounded-lg mb-4">
                    <button className="w-full text-left px-4 py-3 text-black flex items-center gap-3 text-lg">
                        <CiCirclePlus size={24} />
                        New label
                    </button>
                </div>
            </div>
            
            <div className="flex-1 space-y-2">
                <button className="w-full text-left px-4 py-3 text-white flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded">
                    <TbShare3 size={20} />
                    Shared with me
                </button>
                
                <button className="w-full text-left px-4 py-3 text-white flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded">
                    <GrDocument size={20} />
                    Drafts
                </button>
                
                <button className="w-full text-left px-4 py-3 text-white flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded">
                    <FaRegStar size={20} />
                    Starred
                </button>
                
                <button className="w-full text-left px-4 py-3 text-white flex items-center gap-3 text-lg hover:bg-[#4a9470] rounded">
                    <LuTrash2 size={20} />
                    Trash
                </button>
            </div>
        </div>
    );
}