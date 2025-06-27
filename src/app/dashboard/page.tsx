import Sidebar from "../../components/NewUserPage/Sidebar";
import Formlist from "../../components/NewUserPage/FormList";


export default function Home() {
<<<<<<< HEAD
   return (
    <div className="flex h-screen w-screen overflow-x-hidden  min-h-screen">
    <aside className=" w-1/5 h-full"><Sidebar/></aside>
    <div className="w-screen h-screen"> <Formlist/></div>
   
  </div>
   );
=======
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
>>>>>>> 46f7001 (Made the casing everywhere as PascalCasing, made the publish and back to workspace button redirect back to dashboard)
}
