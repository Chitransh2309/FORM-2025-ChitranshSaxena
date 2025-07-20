"use client";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";
import Loader from "@/components/Loader";

// External Components
import Sidebar from "../../components/NewUserPage/Sidebar";
import BottomNav from "../../components/NewUserPage/bottomNav";
import Navbar from "../../components/NewUserPage/NavBar";
import Formsorter from "../../components/NewUserPage/FormSorter";
import Drafts from "../../components/NewUserPage/Drafts";
import Published from "../../components/NewUserPage/Published";
import Trash from "../../components/NewUserPage/Trash";
import Starred from "../../components/NewUserPage/Starred";
import Profile from "../../components/NewUserPage/Profile";
import FAQs from "../../components/NewUserPage/FAQs";
import ToggleSwitch from "../../components/NewUserPage/ToggleSwitch";
import Shared from "../../components/NewUserPage/Shared";
import { usePathname } from "next/navigation";

// Actions & Types
import { getFormsForUser } from "@/app/action/forms";
import { createNewForm } from "@/app/action/createnewform";
import { getUser } from "@/app/action/getUser";
import type { Form } from "@/lib/interface";

function Workspace({
  searchTerm,
  setSearchTerm,
  selected,
}: {
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
  selected: "myForms" | "starred" | "shared" | "trash";
}) {
  const [isPending] = useTransition();
  const router = useRouter();
  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [description,setDescription]=useState("");
  const [showFaq, setShowFaq] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");
  const [creatingFile, setCreatingFile] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    getUser().then((user) => {
      setName(user?.name || "");
      setEmail(user?.email || "");
      setImage(user?.image || "");
    });
  }, []);

  // Only hide loader when we're actually on a different page
  useEffect(() => {
    if (creatingFile && !pathname.startsWith("/dashboard")) {
      // Add a longer delay to ensure the new page is fully rendered
      const timer = setTimeout(() => {
        setCreatingFile(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [pathname, creatingFile]);

  useEffect(() => {
    (async () => {
      try {
        const [formsRes] = await Promise.all([getFormsForUser(true)]);
        const mappedForms = formsRes.map((form) => ({
          form_ID: form._id.toString(),
          title: "",
          description: "",
          createdBy: "",
          isActive: false,
          version: 0,
          share_url: "",
          settings: {
            maxResponses: 0,
            startDate: new Date(),
            endDate: undefined,
            tab_switch_count: false,
            timer: 0,
            autoSubmit: false,
            cameraRequired: false,
            copy_via_email: false,
            timingEnabled: false,
          },
          sections: [],
          isDeleted: false,
          isStarred: false,
          ...form,
        }));
        setForms(mappedForms);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const now = new Date();
  const published = forms.filter((f) => {
    const startDate = f.settings?.startDate
      ? new Date(f.settings.startDate)
      : null;
    return startDate && now >= startDate && !f.isDeleted;
  });

  const drafts = forms.filter((f) => !f.publishedAt && !f.isDeleted);

  const filterBySearch = (forms: Form[]) =>
    !searchTerm
      ? forms
      : forms.filter((form) =>
          form.title?.toLowerCase().includes(searchTerm.toLowerCase())
        );

  const filteredPublished = filterBySearch(published);
  const filteredDrafts = filterBySearch(drafts);

  const isEmpty = !loading && forms.length === 0 && published.length === 0;

  const handleCreate = async () => {
    if (!formName.trim()) return alert("Please enter a form name");

    const res = await createNewForm(formName,description);
    if (res) {
      router.push(`/form/${res}`);
    } else {
      alert("Failed to create a new form. Try again.");
    }
  };

  const handleRestoreInWorkspace = (formId: string) => {
    setForms((prev) =>
      prev.map((f) => (f.form_ID === formId ? { ...f, isDeleted: false } : f))
    );
  };

  const wrapperStyles =
    "w-[80%] h-[60vh] border border-dashed mx-auto flex flex-col justify-center items-center gap-6 bg-transparent";

  return (
    <>
      {/* Full screen loader overlay */}
      {(creatingFile || isPending) && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#F5F7F5] dark:bg-[#2B2A2A]"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 9999,
          }}
        >
          <div className="flex flex-col items-center gap-4">
            <Loader />
            <h3 className="font-[Outfit] font-semibold text-xl text-black dark:text-white">
              Creating a form for you…
            </h3>
          </div>
        </div>
      )}

      {/* Main content - hidden when creating */}
      <div
        className="min-h-screen flex flex-col"
        style={{
          visibility: creatingFile || isPending ? "hidden" : "visible",
          opacity: creatingFile || isPending ? 0 : 1,
          transition: "opacity 0.2s ease-in-out",
        }}
      >
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
                  src={image || "/placeholder.svg"}
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

        {/* Mobile Header */}
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

        {/* Create Form Modal */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-opacity-50">
            <div className="bg-white dark:bg-[#353434] border-2 dark:border-gray-500 border-gray-800 rounded-xl shadow-2xl w-full max-w-xl p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900 dark:text-white mb-6">
                Create New Form
              </h2>
              <input
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-8 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white dark:bg-[#353434]"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
              />
              <textarea
                className="w-full px-5 py-4 border-2 border-gray-300 rounded-lg mb-8 text-black placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-[#61A986] focus:border-transparent transition-all dark:text-white dark:placeholder-white"
                placeholder="Enter description"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                rows={1}
                style={{ maxHeight: "calc(1.5rem * 8)" }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleCreate();
                  }
                }}
              />
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => {
                    setShowDialog(false);
                    setFormName("");
                  }}
                  className="px-6 py-3 bg-white text-gray-700 rounded-lg hover:bg-gray-100 text-lg font-medium border border-gray-300 shadow-sm transition-all dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!formName.trim()}
                  className="px-6 py-3 bg-[#61A986] text-white rounded-lg hover:bg-[#4d8a6b] text-lg font-medium shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <Drafts forms={filteredDrafts} setForms={setForms} />
                  <Published forms={filteredPublished} setForms={setForms} />
                </div>
              </div>
            )
          ) : selected === "trash" ? (
            <Trash
              forms={forms}
              setForms={setForms}
              searchTerm={searchTerm}
              onRestore={handleRestoreInWorkspace}
            />
          ) : selected === "starred" ? (
            <Starred
              searchTerm={searchTerm}
              forms={forms}
              setForms={setForms}
            />
          ) : selected === "shared" ? (
            <Shared />
          ) : null}
          {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
        </div>
      </div>
    </>
  );
}

export default function CombinedWorkspacePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<
    "myForms" | "starred" | "shared" | "trash"
  >("myForms");

  return (
    <div className="min-h-screen w-screen overflow-x-hidden font-[Outfit]">
      {/* Desktop View */}
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
      {/* Mobile View */}
      <div className="block xl:hidden h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Workspace
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selected={selected}
          />
        </div>
        <div className="fixed bottom-0 w-full z-50">
          <BottomNav selected={selected} setSelected={setSelected} />
        </div>
      </div>
    </div>
  );
}
