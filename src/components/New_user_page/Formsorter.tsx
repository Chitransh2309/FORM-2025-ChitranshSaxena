import { FaChevronDown } from "react-icons/fa";
import Link from 'next/link'

function Formsorter(){
    return (
        <div className="bg-[#FFFFFF] px-8 py-6">
            <div className="flex justify-between items-center">
                <button className="flex gap-2 items-center bg-[#61A986] text-lg px-4 py-2 text-white rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors">
                    My Workspace  
                    <FaChevronDown size={12} /> 
                </button>
                
                <button className="bg-[#61A986] px-4 py-2 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors">
                    <Link href="/form">+ New Form</Link>
                </button>
            </div>
        </div>
    );
}

export default Formsorter;