import CenterNav from "./components/center-nav"
import QuestionParent from "./components/question-parent";
import RightNav from "./components/right-nav";
import SectionButton from "./components/sectionbutton";
import "./page.module.css";


export default function BuildPage() {
  return (
    
    <div className="flex bg-[#e8ede8] h-screen overflow-hidden">

      {/* Left Nav */}
      <div className="w-[24vw] h-[92vh] bg-white border-r-2 border-black-200 "></div>
      
      {/* Middle Part */}
      <div className="w-full h-full overflow-auto" >

        <CenterNav />
        
        <div className="text-2xl font-bold ml-[5%] mb-3 mt-9 flex-1 overflow-y-auto p-4">
          Section Name 
        </div>
        
        <QuestionParent />
        <SectionButton />
        </div>

      {/* Right Nav */}
      <div className="w-[34vw] h-[92vh] bg-white border-l-2 border-black-200">
        <RightNav />
      </div>
    </div>
  );
}