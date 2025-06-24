import React from "react";
import Link from 'next/link';

export default function CenterNav(){
    return (
        <div className="w-[36vw] h-[7vh] flex justify-center mx-auto mt-6">
            <div className=" bg-[#91C4AB] rounded-md px-4 py-1 flex flex-row justify-around items-center">
                <ul className="flex space-x-8">
                <li>
                    <button className="bg-[#61A986] text-black font-semibold px-10 py-1 rounded-md">
                    <Link href="/forms">Build</Link>
                    </button>
                </li>
                <li>
                    <button className="bg-transparent text-black font-medium px-6 py-1">
                    <Link href="/forms"></Link>Workflow
                    </button>
                </li>
                <li>
                    <button className="bg-transparent text-black font-medium px-6 py-1">
                    <Link href="/forms">Preview</Link>
                    </button>
                </li>
                </ul>
            </div>
        </div>
    );
}