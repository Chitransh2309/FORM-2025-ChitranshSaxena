import Footer from "../components/Landing_Page/Footer";
import Hero from "../components/Landing_Page/Hero";
import Navbar from "../components/Landing_Page/Navbar";
import { insertUser } from "./action/user";
import Image from 'next/image';

export default async function Home() {
  await insertUser();
  return (
    <div className="w-screen h-screen bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />
      <div className="w-full h-full p-6 flex flex-col">
        <p className="text-center text-2xl mt-15 mb-10 font-bold text-[#3D3D3D] dark:text-[#ffffff]">
          Build Forms Like Never Before
        </p>
        <div className="flex-1 flex items-center justify-center">
            <Image
            src="form builder-dark mode.svg"
            height={700}
            width={700}
            alt="form-builder"
            />
        </div>
      </div>
      <div className="w-full h-full flex flex-col">
        <p className="text-center text-2xl mt-25 font-bold text-[#3D3D3D] dark:text-[#ffffff]">
          Features That Make You Come Back
        </p>
        <div className="flex-1 flex items-center justify-center gap-5 dark:bg-[#191719] ">
          <div className="h-80 w-70 bg-[#61A986] rounded-xl text-white flex flex-col items-center gap-8 dark:bg-[#E1F4E6]">
            <div className="h-50 w-60 bg-[#F8F8F6] mt-5 rounded-xl dark:text-#61A986 dark:bg-[#61A986]"></div>
            <p className="text-2xl text-#F4EAE1 mr-30 font-bold dark:text-[#61A986]">
              FEATURE
            </p>
          </div>
          <div className="h-80 w-70 bg-[#E6AD00] rounded-xl text-white flex flex-col items-center gap-8 dark:bg-[#F8F5EA]">
            <div className="h-50 w-60 bg-[#F6F8F6] mt-5 rounded-xl dark:bg-[#C69D1F]"></div>
            <p className="text-2xl text-#F6F8F6 mr-30 font-bold dark:text-[#E6AD00]">
              FEATURE
            </p>
          </div>
          <div className="h-80 w-70 bg-[#3D3D3D] rounded-xl text-white flex flex-col items-center gap-8 dark:bg-[#E9E6E9]">
            <div className="h-50 w-60 bg-[#F4F3F4] mt-5 rounded-xl dark:bg-[#3D3D3D]"></div>
            <p className="text-2xl text-#F4F3F4 mr-30 font-bold  dark:text-[#3D3D3D]">
              FEATURE
            </p>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}
