"use client";

import { useState } from "react";
import Sidebar   from "./Sidebar";
import Formlist  from "./FormList";
import BottomNav from "./bottomNav";

export default function ClientHome() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selected, setSelected] = useState<
    "myForms" | "shared" | "starred" | "trash"
  >("myForms");

  return (
    <div className="min-h-screen w-screen overflow-x-hidden font-[Outfit]">
      {/* ─────────── Desktop ─────────── */}
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
          <Formlist
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
      </div>

      {/* ─────────── Mobile ─────────── */}
      <div className="block xl:hidden h-screen flex flex-col">
        <div className="flex-1 overflow-y-auto">
          <Formlist
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>

        <div className="fixed bottom-0 w-full z-50">
          <BottomNav selected={selected} setSelected={setSelected} />
        </div>
      </div>
    </div>
  );
}
