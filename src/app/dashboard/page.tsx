import Sidebar from "../../components/NewUserPage/Sidebar";
import Formlist from "../../components/NewUserPage/FormList";
import BottomNav from "../../components/NewUserPage/bottomNav";
import { insertUser } from "../action/user";

export default async function Home() {
  await insertUser();
  return (
    <div className="min-h-screen w-screen overflow-x-hidden font-[Outfit]">
      {/* ---------- Desktop Layout ---------- */}
      <div className="hidden xl:flex h-screen">
        <aside className="w-1/5 h-full">
          <Sidebar />
        </aside>

        <div className="flex-1 h-full">
          <Formlist />
        </div>
      </div>

      {/* ---------- Mobile Layout ---------- */}
      <div className="block xl:hidden h-screen flex flex-col">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">       {/* ← keep or remove as you prefer */}
          <Formlist />
        </div>

        {/* Fixed bottom nav */}
        <div className="fixed bottom-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
