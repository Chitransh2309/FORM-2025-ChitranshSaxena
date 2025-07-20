"use client";

import {
  useState,
  useEffect,
  useTransition,
  useRef,
  useLayoutEffect,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";
import { FaChevronDown, FaSearch } from "react-icons/fa";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import { FaRegCircleUser } from "react-icons/fa6";

import Navbar from "./NavBar";
import Formsorter from "./FormSorter";
import Drafts from "./Drafts";
import Published from "./Published";
import ToggleSwitch from "../LandingPage/ToggleSwitch";
import Profile from "./Profile";
import FAQs from "./FAQs";

import { getFormsForUser } from "@/app/action/forms";
import { createNewForm } from "@/app/action/createnewform";
import { getUser } from "@/app/action/getUser";
import type { Form } from "@/lib/interface";
import Loader from "@/components/Loader";

export default function Workspace({
  searchTerm,
  setSearchTerm,
}: {
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
}) {
  /* ───────── state ───────── */
  const router = useRouter();
  const pathname = usePathname();
  const [isPending] = useTransition();

  const [forms, setForms] = useState<Form[]>([]);
  const [loading, setLoading] = useState(true);

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [creatingFile, setCreatingFile] = useState(false);

  const [showFaq, setShowFaq] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [email, setEmail] = useState("");

  const [isWorkspaceDropdownOpen, setWorkspaceDropdownOpen] = useState(false);
  const workspaceDropdownRef = useRef<HTMLDivElement>(null);

  /* ───────── fetch forms + user ───────── */
  useEffect(() => {
    (async () => {
      const [rawForms, user] = await Promise.all([
        getFormsForUser(),
        getUser(),
      ]);

      setName(user?.name ?? "");
      setEmail(user?.email ?? "");
      setImage(user?.image ?? "");

      setForms(
        rawForms.map((f) => ({ ...(f as unknown as Form) })) // strip extra props
      );
      setLoading(false);
    })();
  }, []);

  /* ───────── auto-fold mobile dropdown when click outside ───────── */
  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (
        workspaceDropdownRef.current &&
        !workspaceDropdownRef.current.contains(e.target as Node)
      ) {
        setWorkspaceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ───────── keep overlay until new route mounts ───────── */
  useEffect(() => {
    if (creatingFile && pathname.startsWith("/form/") && !isPending) {
      const t = setTimeout(() => setCreatingFile(false), 300);
      return () => clearTimeout(t);
    }
  }, [pathname, creatingFile, isPending]);

  /* ───────── auto-grow textarea ───────── */
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const autosize = () => {
    const el = descRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };
  useLayoutEffect(autosize, [description, showDialog]);

  /* ───────── helpers ───────── */
  const resetDialog = () => {
    setFormName("");
    setDescription("");
    setShowDialog(false);
  };

  async function handleCreate() {
    if (!formName.trim()) {
      alert("Please enter a form name");
      return;
    }
    setCreatingFile(true);

    const id = await createNewForm(formName.trim(), description.trim());

    // if server action redirects, the code below never runs
    if (id) router.push(`/form/${id}`);
  }

  /* ───────── derived sets ───────── */
  const drafts = forms.filter((f) => f.publishedAt === null && !f.isDeleted);
  const published = forms.filter((f) => f.publishedAt !== null && !f.isDeleted);
  const isEmpty = !loading && drafts.length === 0 && published.length === 0;

  /* ───────── UI ───────── */
  return (
    <>
      {/* overlay */}
      {(creatingFile || isPending) && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F7F5] dark:bg-[#2B2A2A]">
          <Loader />
          <h3 className="mt-4 font-[Outfit] text-xl font-semibold text-black dark:text-white">
            Creating a form for you…
          </h3>
        </div>
      )}

      <div className="min-h-screen flex flex-col">
        {/* ───── Navbar (mobile) ───── */}
        <Navbar image={image} name={name} email={email} />

        {/* ───── top-right controls (desktop) ───── */}
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
                  width={26}
                  height={26}
                  alt="profile"
                  className="rounded-full"
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

        {/* ───── sorter (desktop) ───── */}
        <div className="hidden xl:block">
          <Formsorter />
        </div>

        {/* ───── mobile header (search + create) ───── */}
        <div className="xl:hidden w-full bg-white border-b px-4 py-3 dark:bg-[#2B2A2A] dark:border-gray-500">
          <div className="flex items-center gap-2">
            {/* workspace dropdown (placeholder) */}
            <div className="relative" ref={workspaceDropdownRef}>
              <button
                onClick={() => setWorkspaceDropdownOpen((p) => !p)}
                className="flex items-center gap-1 bg-[#56A37D] text-black text-xs px-4 py-2 rounded-lg dark:text-white"
              >
                My Workspace{" "}
                <FaChevronDown
                  size={12}
                  className={`transition-transform ${
                    isWorkspaceDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isWorkspaceDropdownOpen && (
                <div className="absolute top-full mt-2 w-full bg-white rounded-md shadow-lg z-10 dark:bg-gray-800 border dark:border-gray-700">
                  <div className="py-2 text-xs text-center text-gray-500 cursor-not-allowed dark:text-gray-400">
                    Coming soon
                  </div>
                </div>
              )}
            </div>

            {/* search */}
            <div className="flex flex-1 min-w-0 items-center rounded-lg bg-[#3D3D3D] px-3 py-2">
              <FaSearch size={14} className="flex-shrink-0 text-white" />
              <input
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm?.(e.target.value)}
                className="ml-2 flex-1 bg-transparent text-xs text-white outline-none placeholder-white"
              />
            </div>

            {/* create */}
            <button
              onClick={() => setShowDialog(true)}
              className="whitespace-nowrap rounded-lg bg-[#3D3D3D] px-4 py-2 text-xs text-white"
            >
              + New Form
            </button>
          </div>
        </div>

        {/* ───── modal dialog ───── */}
        {showDialog && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-xl rounded-xl border-2 border-gray-800 bg-white p-8 shadow-2xl dark:border-gray-500 dark:bg-[#353434]">
              <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
                Create New Form
              </h2>

              {/* title */}
              <input
                className="mb-8 w-full rounded-lg border-2 border-gray-300 px-5 py-4 text-lg text-black placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#61A986] dark:bg-[#353434] dark:text-white dark:placeholder-white"
                placeholder="Enter form name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
              />

              {/* description */}
              <textarea
                ref={descRef}
                rows={1}
                style={{
                  maxHeight: "calc(1.5rem * 8)",
                  overflow: "hidden",
                  resize: "none",
                }}
                className="mb-8 w-full rounded-lg border-2 border-gray-300 px-5 py-4 text-lg text-black placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#61A986] dark:bg-[#353434] dark:text-white dark:placeholder-white"
                placeholder="Enter description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleCreate();
                  }
                }}
              />

              <div className="mt-2 flex justify-end gap-4">
                <button
                  onClick={resetDialog}
                  className="rounded-lg border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 shadow-sm transition-all hover:bg-gray-100 dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreate}
                  disabled={!formName.trim()}
                  className="rounded-lg bg-[#61A986] px-6 py-3 text-lg font-medium text-white shadow-md transition-all hover:bg-[#4d8a6b] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Create
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ───── main content ───── */}
        <div className="flex-1 h-full px-4 pb-4 md:px-6">
          {loading ? (
            <div className="flex h-[90%] items-center justify-center">
              <div className="flex h-[80%] w-[80%] items-center justify-center border border-dashed border-black text-black dark:border-white dark:text-white">
                Loading&hellip;
              </div>
            </div>
          ) : isEmpty ? (
            /* empty states condensed for brevity */
            <div className="flex h-[90%] flex-col items-center justify-center">
              <div className="flex flex-col items-center gap-6 border border-dashed border-black px-8 py-12 dark:border-white lg:w-[80%]">
                <p className="text-center text-gray-600 dark:text-white md:text-3xl">
                  You have not created any forms yet.
                </p>
                <h2 className="text-center text-2xl font-semibold text-gray-800 dark:text-white md:text-5xl">
                  Create Your First Form Today!
                </h2>
                <button
                  onClick={() => setShowDialog(true)}
                  className="rounded-lg bg-[#56A37D] px-6 py-3 text-white md:text-2xl"
                >
                  Create Now
                </button>
              </div>
            </div>
          ) : (
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col gap-4 lg:flex-row">
                <Drafts forms={drafts} setForms={setForms} />
                <Published forms={published} setForms={setForms} />
              </div>
            </div>
          )}
        </div>

        {/* FAQ */}
        {showFaq && <FAQs showFaq={showFaq} setShowFaq={setShowFaq} />}
      </div>
    </>
  );
}
