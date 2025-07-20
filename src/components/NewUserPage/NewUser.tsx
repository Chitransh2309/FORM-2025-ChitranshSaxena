/* app/(dashboard)/newuser/page.tsx ---------------------------------------- */
"use client";

import { useState, useRef, useLayoutEffect, useTransition } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createNewForm } from "@/app/action/createnewform";
import Loader from "@/components/Loader";

export default function Newuser() {
  /* ───────── state + router helpers ───────── */
  const router = useRouter();
  const pathname = usePathname();
  const [isPending] = useTransition();

  const [showDialog, setShowDialog] = useState(false);
  const [formName, setFormName] = useState("");
  const [description, setDescription] = useState("");
  const [creatingFile, setCreatingFile] = useState(false);

  /* ───────── auto-grow textarea ───────── */
  const descRef = useRef<HTMLTextAreaElement | null>(null);
  const autosize = () => {
    const el = descRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };
  useLayoutEffect(autosize, [description, showDialog]);

  /* ───────── keep overlay until new route mounts ───────── */
  useLayoutEffect(() => {
    if (creatingFile && pathname.startsWith("/form/")) {
      // tiny timeout lets the new page paint before we unmount overlay
      const t = setTimeout(() => setCreatingFile(false), 300);
      return () => clearTimeout(t);
    }
  }, [pathname, creatingFile]);

  /* ───────── actions ───────── */
  const closeDialog = () => {
    setShowDialog(false);
    setFormName("");
    setDescription("");
  };

  async function handleCreate() {
    if (!formName.trim()) return alert("Please enter a form name");

    setCreatingFile(true);

    const id = await createNewForm(formName.trim(), description.trim());
    // -- if the server action redirects, the code below never executes
    if (id) router.push(`/form/${id}`);
  }

  /* ───────── UI ───────── */
  return (
    <>
      {/* loader overlay / transition guard */}
      {(creatingFile || isPending) && (
        <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#F5F7F5] dark:bg-[#2B2A2A]">
          <Loader />
          <h3 className="mt-4 font-[Outfit] text-xl font-semibold text-black dark:text-white">
            Creating a form for you…
          </h3>
        </div>
      )}

      {/* main splash */}
      <div
        className="flex-full mx-auto flex h-screen flex-col items-center justify-center gap-6 border border-dashed border-black px-8 py-12 text-center dark:border-white"
        style={{ visibility: creatingFile ? "hidden" : "visible" }}
      >
        <h4 className="text-xl text-gray-600 dark:text-white">
          You have not created any forms yet.
        </h4>
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white">
          Create Your First Form Today!
        </h2>
        <button
          className="rounded-lg bg-[#61A986] px-6 py-3 text-lg text-white transition-colors hover:bg-[#4d8a6b] dark:text-black"
          onClick={() => setShowDialog(true)}
        >
          Create Now
        </button>
      </div>

      {/* modal */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-xl rounded-xl border-2 border-gray-800 bg-white p-8 shadow-2xl dark:border-gray-500 dark:bg-[#353434]">
            <h2 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
              Create New Form
            </h2>

            {/* name */}
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
              className="mb-8 w-full resize-none overflow-hidden rounded-lg border-2 border-gray-300 px-5 py-4 text-lg text-black placeholder-gray-500 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[#61A986] dark:bg-[#353434] dark:text-white dark:placeholder-white"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleCreate();
                }
              }}
              style={{ maxHeight: "calc(1.5rem * 8)" }}
            />

            <div className="mt-2 flex justify-end gap-4">
              <button
                onClick={closeDialog}
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
    </>
  );
}
