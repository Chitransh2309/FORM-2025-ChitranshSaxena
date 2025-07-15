"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";

import Navbar from "./NavBar";
import Formsorter from "./FormSorter";
import Drafts from "./Drafts";
import Published from "./Published";
import Image from "next/image";
import { getFormsForUser } from "@/app/action/forms";
import { createNewForm } from "@/app/action/createnewform";
import { Form } from "@/lib/interface";
import Profile from "./Profile";
import { getUser } from "@/app/action/getUser";
import FAQs from "./FAQs";
import ToggleSwitch from "../LandingPage/ToggleSwitch";

export default function Workspace({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
}) {
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [showFaq, setShowFaq] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
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
    /* fetch everything in parallel */
    const [rawForms, user] = await Promise.all([
      getFormsForUser(), // returns { …Form, responseCount, _id }
      getUser(),
    ]);

    /* profile info */
    setName(user?.name ?? "");
    setEmail(user?.email ?? "");
    setImage(user?.image ?? "");

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cleaned = rawForms.map(({ _id, ...form }) => form as unknown as Form);

setForms(cleaned);
setLoading(false);

  })();
}, []);


  const drafts = forms.filter((f) => !f.isActive);
  const published = forms.filter((f) => f.isActive);

  const isEmpty = !loading && drafts.length === 0 && published.length === 0;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Green Header for mobile */}
      <Navbar image={image} name={name} email={email} />

      {/* Desktop Topbar */}
      <div className="hidden xl:flex items-center justify-between px-6 py-4 ml-auto">
        <div className="flex items-center gap-4">
          <ToggleSwitch />
          <button onClick={() => setShowFaq(true)}>
            <HiOutlineQuestionMarkCircle
              size={26}
              className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
            />
          </button>
          <button onClick={() => setShowProfile(!showProfile)}>
            {image !== "" ? (
              <Image
                src={image}
                width={26}
                height={26}
                alt="profile_image"
                className="text-black rounded-full hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              />
            ) : (
              <FaRegCircleUser
                size={22}
                className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              />
            )}
          </button>
        </div>
        {showProfile && <Profile name={name} email={email} />}
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
              value={searchTerm}
              onChange={(e) => setSearchTerm?.(e.target.value)}
              className="flex-1 bg-transparent outline-none placeholder-white text-xs ml-2 text-white"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="bg-white border-2 border-gray-800 rounded-xl shadow-2xl w-[42rem] max-w-full p-8 animate-pop-in dark:bg-[#353434] dark:border-gray-500">
            <label className="text-gray-950 mb-6 font-bold text-3xl flex items-center justify-center dark:text-white">
              Create New Form
            </label>
            <input
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-8 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white"
              placeholder="Enter form name"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              autoFocus
            />
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDialog(false)}
                className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-200 text-lg font-medium transition-all duration-200 border-2 border-gray-300 hover:border-gray-400 shadow-sm hover:shadow-md"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-lg font-medium transition-all duration-200 hover:shadow-md"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 pb-4 h-full">
        {loading ? (
          <div className="flex-1 flex flex-col justify-center items-center h-[90%]">
            <div className="h-[80%] w-[80%] border border-dashed text-black dark:text-white border-black flex items-center justify-center mx-auto dark:border-white">
              Loading…
            </div>
          </div>
        ) : isEmpty ? (
          <div className="flex-1 flex flex-col justify-center items-center h-[90%]">
            {/* Mobile Empty State */}
            <div className="lg:hidden h-[80%] w-[80%] border border-dashed border-black mx-auto flex flex-col justify-center items-center gap-6 px-8 bg-transparent dark:border-white">
              <p className="text-gray-600 text-center dark:text-white md:text-3xl">
                You have not created any forms yet.
              </p>
              <h2 className="text-2xl font-semibold text-gray-800 text-center dark:text-white md:text-5xl md:leading-20">
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
            <div className="hidden lg:flex h-[80%] border w-[80%] flex items-center justify-center border-dashed border-black mx-auto flex-col gap-6 px-8 bg-transparent dark:border-white">
              <h4 className="text-xl text-gray-600 dark:text-white text-center">
                You have not created any forms yet.
              </h4>
              <h2 className="text-3xl font-semibold text-gray-800 dark:text-white text-center">
                Create Your First Form Today!
              </h2>
              <button
                onClick={() => setShowDialog(true)}
                className="bg-[#61A986] px-6 py-3 text-white text-lg rounded-lg cursor-pointer hover:bg-[#4d8a6b] transition-colors dark:text-black"
              >
                Create Now
              </button>
            </div>
          </div>
        ) : (
          <div className="h-full border-black mx-auto flex flex-col justify-center items-center gap-6 px-8 bg-transparent dark:border-white overflow-y-auto">
            <div className="flex flex-col lg:flex-row flex-1 w-full gap-4">
              <Drafts forms={forms} />
              <Published forms={forms} />
            </div>
          </div>
        )}
      </div>

      {/* FAQ Modal */}
      {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}
