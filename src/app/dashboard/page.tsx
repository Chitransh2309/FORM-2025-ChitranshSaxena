"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";

// External Components
import Sidebar from "../../components/NewUserPage/Sidebar";
import BottomNav from "../../components/NewUserPage/bottomNav";
import Navbar from "../../components/NewUserPage/NavBar";
import Formsorter from "../../components/NewUserPage/FormSorter";
import Drafts from "../../components/NewUserPage/Drafts";
import Published from "../../components/NewUserPage/Published";
import Trash from "../../components/NewUserPage/Trash";
import Profile from "../../components/NewUserPage/Profile";
import FAQs from "../../components/NewUserPage/FAQs";
import ToggleSwitch from "../../components/NewUserPage/ToggleSwitch";
import TrashPage from "../../components/NewUserPage/Trash";
import Shared from "../../components/NewUserPage/Shared";

// Actions & Types
import { getFormsForUser } from "@/app/action/forms";
import { createNewForm } from "@/app/action/createnewform";
import { getUser } from "@/app/action/getUser";
import { Form } from "@/lib/interface";

function Workspace({
  searchTerm,
  setSearchTerm,
  selected,
}: {
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
  selected: "myForms" | "starred" | "shared" | "trash";
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

  useEffect(() => {
    (async () => {
      try {
        const [formsRes, user] = await Promise.all([
          getFormsForUser(true),
          getUser(),
        ]);
        setForms(formsRes);
        setName(user?.name || "");
        setEmail(user?.email || "");
        setImage(user?.image || "");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const drafts = forms.filter((f) => !f.isActive && !f.isDeleted);
  const published = forms.filter((f) => f.isActive && !f.isDeleted);
  const trash = forms.filter((f) => f.isDeleted);

  const filterBySearch = (forms: Form[]) =>
    !searchTerm
      ? forms
      : forms.filter((form) =>
          form.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const filteredDrafts = filterBySearch(drafts);
  const filteredPublished = filterBySearch(published);
  const filteredTrash = filterBySearch(trash);

  const isEmpty = !loading && drafts.length === 0 && published.length === 0;

  const handleCreate = async () => {
    if (!formName.trim()) return alert("Please enter a form name");
    const res = await createNewForm(formName);
    if (res) router.push(`/form/${res}`);
    else alert("Failed to create a new form. Try again.");
  };

  const wrapperStyles =
    "w-[80%] h-[60vh] border border-dashed mx-auto flex flex-col justify-center items-center gap-6 bg-transparent";

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar image={image} name={name} email={email} />

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
            {image ? (
              <Image
                src={image}
                width={28}
                height={28}
                alt="profile_image"
                className="rounded-full"
              />
            ) : (
              <FaRegCircleUser
                size={24}
                className="text-black hover:text-gray-700 dark:text-white dark:hover:text-gray-300"
              />
            )}
          </button>
        </div>
        {showProfile && <Profile name={name} email={email} />}
      </div>

      <div className="hidden xl:block">
        <Formsorter />
      </div>

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

      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#353434] border-2 dark:border-gray-500 border-gray-800 rounded-xl shadow-2xl w-full max-w-xl p-8 animate-pop-in">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
              Create New Form
            </h2>
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
                className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 text-lg font-medium border border-gray-300 shadow-sm transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-lg font-medium shadow-md transition-all"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 px-4 md:px-6 pb-4 h-full flex items-center justify-center">
        {selected === "myForms" ? (
          loading ? (
            <div className={wrapperStyles + " text-black dark:text-white"}>
              Loading…
            </div>
          ) : isEmpty ? (
            <div className={wrapperStyles + " dark:border-white"}>
              <p className="text-lg md:text-2xl text-center text-gray-600 dark:text-gray-200">
                You have not created any forms yet.
              </p>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-center text-gray-800 dark:text-white">
                Create Your First Form Today!
              </h2>
              <button
                onClick={() => setShowDialog(true)}
                className="mt-2 px-8 py-4 bg-[#61A986] text-lg sm:text-xl text-white rounded-lg hover:bg-[#4d8a6b] transition-colors"
              >
                Create Now
              </button>
            </div>
          ) : (
            <div className="w-full h-full overflow-y-auto flex flex-col items-center">
              <div className="flex flex-col lg:flex-row flex-1 w-full max-w-7xl gap-6 px-4">
                <Drafts forms={filteredDrafts} />
                <Published forms={filteredPublished} />
              </div>
            </div>
          )
        ) : selected === "trash" ? (
          <div className="w-full h-full flex items-center justify-center bg-blue-500 text-white text-2xl font-bold rounded-lg">
            <TrashPage forms={filteredTrashed} />
          </div>
        ) : selected === "shared" ? (
          <>
            <Shared />
          </>
        ) : null}
      </div>

      {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
    </div>
  );
}

export default function CombinedWorkspacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<
    "myForms" | "starred" | "shared" | "trash"
  >("myForms");

  return (
    <div className="min-h-screen w-screen overflow-x-hidden font-[Outfit]">
      <div className="hidden xl:flex h-screen">
        <aside className="fixed top-0 left-0 h-screen w-[15%] z-40">
          <Sidebar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selected={selected}
            setSelected={setSelected}
          />
        </aside>

        <div className="ml-[15%] w-[85%] h-screen overflow-y-auto">
          <Workspace
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selected={selected}
          />
        </div>
      </div>

      <div className="block xl:hidden h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Workspace
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selected={selected}
          />
        </div>
        <div className="fixed bottom-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
