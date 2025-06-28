import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import { insertUser } from "./action/user";
import Image from 'next/image';

export default async function Home() {
  await insertUser();
  return (
    <div className="min-h-screen w-full bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />

      <div className="w-full px-4 py-10 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8">
          Build Forms Like Never Before
        </p>
        <div className="w-full flex justify-center">
          <Image
            src="/form builder-dark mode.svg"
            height={700}
            width={700}
            alt="form-builder"
            className="w-full max-w-[600px] h-auto"
          />
        </div>
      </div>

      <div className="w-full px-4 py-10 flex flex-col items-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8 text-center">
          Features That Make You Come Back
        </p>

        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <div className="w-full md:w-1/3 max-w-sm bg-[#61A986] dark:bg-[#E1F4E6] rounded-xl p-6 text-white dark:text-[#61A986] flex flex-col items-center">
            <div className="w-full h-40 bg-[#F8F8F6] dark:bg-[#61A986] rounded-xl mb-4"></div>
            <p className="text-xl font-bold">FEATURE</p>
          </div>

          <div className="w-full md:w-1/3 max-w-sm bg-[#E6AD00] dark:bg-[#F8F5EA] rounded-xl p-6 text-white dark:text-[#E6AD00] flex flex-col items-center">
            <div className="w-full h-40 bg-[#F6F8F6] dark:bg-[#C69D1F] rounded-xl mb-4"></div>
            <p className="text-xl font-bold">FEATURE</p>
          </div>

          <div className="w-full md:w-1/3 max-w-sm bg-[#3D3D3D] dark:bg-[#E9E6E9] rounded-xl p-6 text-white dark:text-[#3D3D3D] flex flex-col items-center">
            <div className="w-full h-40 bg-[#F4F3F4] dark:bg-[#3D3D3D] rounded-xl mb-4"></div>
            <p className="text-xl font-bold">FEATURE</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
