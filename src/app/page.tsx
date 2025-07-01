import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />

      <div className="w-full px-4 py-10 flex flex-col items-center text-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8">
          Build Forms Like Never Before
        </p>
        <div className="w-full flex justify-center">
          <>
            {/* Desktop - Light Mode */}
            <Image
              src="/form builder -default 1.svg"
              alt="light mode"
              height={1063}
              width={750}
              className="w-full max-w-[1063px] dark:hidden h-auto block hidden md:block"
            />

            {/* Desktop - Dark Mode */}
            <Image
              src="/form builder-dark mode.svg"
              height={1063}
              width={750}
              alt="form-builder"
              className="w-full max-w-[1063px] h-auto hidden dark:md:block "
            />

            {/* Mobile only */}
            <Image
              src="/iPhone 15 Green.svg"
              alt="mobile view"
              height={700}
              width={700}
              className="w-full max-w-[345px] h-auto block md:hidden"
            />
          </>
        </div>
      </div>

      <div className="w-full px-4 py-10 flex flex-col items-center">
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8 text-center">
          Features That Make You Come Back
        </p>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full place-items-center">
            <div className="w-full max-w-[345px] bg-[#61A986] dark:bg-[#E1F4E6] rounded-xl p-6 text-white dark:text-[#61A986] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F8F8F6] dark:bg-[#61A986] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>

            <div className="w-full max-w-[345px] bg-[#E6AD00] dark:bg-[#F8F5EA] rounded-xl p-6 text-white dark:text-[#E6AD00] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F6F8F6] dark:bg-[#C69D1F] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>

            <div className="w-full max-w-[345px] bg-[#3D3D3D] dark:bg-[#E9E6E9] rounded-xl p-6 text-white dark:text-[#3D3D3D] flex flex-col items-center">
              <div className="w-full max-w-[303px] h-40 bg-[#F4F3F4] dark:bg-[#3D3D3D] rounded-xl mb-4"></div>
              <p className="text-xl font-bold">FEATURE</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
