"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import Newuser from "./NewUser";
import Navbar from "./NavBar";
import Formsorter from "./FormSorter";
import Drafts from "./Drafts";
import Published from "./Published";
import Image from "next/image";
import { getFormsForUser } from "@/app/action/forms";
import { createNewForm } from "@/app/action/createnewform";
import { Form } from "@/lib/interface";
import ToggleSwitch from "../LandingPage/ToggleSwitch";
import FAQs from "./FAQs";


export default function Workspace() {
 const router = useRouter();
 const [forms, setForms] = useState<Form[]>([]);
 const [loading, setLoading] = useState(true);
 const [showDialog, setShowDialog] = useState(false);
 const [formName, setFormName] = useState("");
 const [showFaq, setShowFaq] = useState(false);


 const handleCreate = async () => {
   if (!formName.trim()) return alert("Please enter a form name");
   const res = await createNewForm(formName);
   if (res) {
     router.push(`/form/${res}`);
   } else {
     alert("Failed to create a new form. Try again.");
   }
 };


 useEffect(() => {
   (async () => {
     const res = await getFormsForUser();
     setForms(res);
     setLoading(false);
   })();
 }, []);


 const drafts = forms.filter((f) => !f.isActive);
 const published = forms.filter((f) => f.isActive);
 const isEmpty = drafts.length === 0 && published.length === 0;


 return (
   <div className="min-h-screen flex flex-col">
     {/* Green Header for mobile */}
     <Navbar />


     {/* Desktop Topbar */}
     <div className="hidden xl:flex items-center justify-between px-6 py-4">
       <div className="flex items-center gap-2">
         <Image
           src="/main-icon.png"
           alt="F.O.R.M logo"
           width={24}
           height={24}
           className="w-6 h-6 opacity-80 flex-shrink-0"
         />
         <span className="font-bold text-lg text-black dark:text-white">
           F.O.R.M
         </span>
       </div>


       <div className="flex items-center gap-4">
         <ToggleSwitch />
         <button onClick={() => setShowFaq(true)}>
           <HiOutlineQuestionMarkCircle
             size={26}
             className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
           />
         </button>
         <FaRegCircleUser
           size={22}
           className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
         />
       </div>
     </div>


     {/* Desktop Sorter */}
     <div className="hidden xl:block">
       <Formsorter />
     </div>


     {/* Mobile Top Buttons */}
     <div className="xl:hidden w-full bg-white border-b px-4 py-3 dark:bg-[#2B2A2A] dark:border-gray-500">
       <div className="flex items-center gap-2">
         <button className="flex items-center gap-1 bg-[#56A37D] text-black text-xs px-4 py-2 rounded-lg dark:text-white">
           My Workspace <FaChevronDown size={12} />
         </button>


         <div className="flex items-center bg-[#3D3D3D] rounded-lg px-3 py-2 flex-1 min-w-0">
           <FaSearch size={14} className="text-white flex-shrink-0" />
           <input
             placeholder="Search"
             className="flex-1 bg-transparent outline-none placeholder-white text-xs ml-2"
           />
         </div>


         <button
           onClick={() => setShowDialog(true)}
           className="bg-[#3D3D3D] text-white text-xs px-4 py-2 rounded-lg whitespace-nowrap"
         >
           + New Form
         </button>
       </div>
     </div>


     {/* Create Form Dialog */}
     {showDialog && (
       <div className="fixed inset-0 z-50 flex items-center justify-center px-4 sm:px-0">
         <div className="bg-white border-2 border-gray-800 rounded-xl shadow-2xl w-full max-w-lg p-6 sm:p-8 dark:bg-[#353434] dark:border-gray-500">
           <label className="text-gray-950 mb-6 font-bold text-2xl sm:text-3xl flex items-center justify-center dark:text-white">
             Create New Form
           </label>
           <input
             className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-6 text-black placeholder-gray-500 text-base focus:outline-none focus:ring-2 focus:ring-[#61A986] dark:text-white dark:placeholder-white"
             placeholder="Enter form name"
             value={formName}
             onChange={(e) => setFormName(e.target.value)}
             autoFocus
           />
           <div className="flex gap-4 justify-end">
             <button
               onClick={() => setShowDialog(false)}
               className="px-5 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-200 text-base font-medium border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
             >
               Cancel
             </button>
             <button
               onClick={handleCreate}
               className="px-5 py-2 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-base font-medium transition-all hover:shadow-md"
             >
               Create
             </button>
           </div>
         </div>
       </div>
     )}


     {/* Main Content */}
     <div className="flex-1 overflow-y-auto px-4 md:px-6 pb-4">
       {loading ? (
         <div className="flex items-center justify-center h-full">Loading…</div>
       ) : isEmpty ? (
         <>
           {/* Mobile Empty State */}
           <div className="xl:hidden flex flex-col items-center justify-center h-full text-center">
             <p className="text-gray-600 mb-2 dark:text-white md:text-3xl">
               You have not created any forms yet.
             </p>
             <h2 className="text-2xl font-semibold text-gray-800 mb-4 dark:text-white md:text-5xl md:leading-20">
               Create Your First Form Today!
             </h2>
             <button
               onClick={() => setShowDialog(true)}
               className="bg-[#56A37D] text-white px-6 py-3 rounded-lg md:text-2xl"
             >
               Create Now
             </button>
           </div>


           {/* Desktop Empty State */}
           <div className="hidden lg:block h-full">
             <Newuser />
           </div>
         </>
       ) : (
         <div className="flex flex-col lg:flex-row flex-1 overflow-hidden gap-4">
           <Drafts forms={drafts} />
           <Published forms={published} />
         </div>
       )}
     </div>


     {/* FAQ Modal */}
     {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
   </div>
 );
}



