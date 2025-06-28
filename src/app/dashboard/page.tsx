import "./globals.css";
import Sidebar from "../../components/New_user_page/Sidebar";
import Formlist from "../../components/New_user_page/Formlist";
import BottomNav from "../../components/New_user_page/bottomNav";

export default function Home() {
  return (
    <div className="relative min-h-screen font-[Outfit]">
      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen w-screen overflow-x-hidden">
        <aside className="w-1/5 h-full">
          <Sidebar />
        </aside>
        <div className="flex-1 h-full">
          <Formlist />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="block md:hidden w-full">
import Sidebar from "../../components/NewUserPage/Sidebar";
import Formlist from "../../components/NewUserPage/FormList";

export default function Home() {
  return (
    <div className="flex h-screen w-screen overflow-x-hidden min-h-screen font-[Outfit]">
      <aside className=" w-1/5 h-full">
        <Sidebar />
      </aside>
      <div className="w-screen h-screen">
        {" "}
        <Formlist />

        {/* Bottom Nav */}
        <div className="fixed bottom-0 w-full z-50">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
