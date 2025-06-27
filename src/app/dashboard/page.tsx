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
      </div>
    </div>
  );
}
