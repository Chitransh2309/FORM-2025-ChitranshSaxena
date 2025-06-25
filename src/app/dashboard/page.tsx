import "./globals.css";
import Sidebar from "../../components/New_user_page/Sidebar";
import Formlist from "../../components/New_user_page/Formlist";


export default function Home() {
   return (
    <div className="flex h-screen w-screen overflow-x-hidden  min-h-screen">
    <aside className=" w-1/5 h-full"><Sidebar/></aside>
    <div className="w-screen h-screen"> <Formlist/></div>
   
  </div>
   );
}
