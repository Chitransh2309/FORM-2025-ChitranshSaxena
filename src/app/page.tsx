import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="min-h-screen w-full bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />

      <div
        className="w-full px-4 py-10 flex flex-col items-center text-center"
        id="features"
      >
        <p className="text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8">
          Build Forms Like Never Before
        </p>
        <div className="w-full flex justify-center">
          <>
            {/* Desktop - Light Mode */}
            <Image
              src="/form builder-dark mode.svg"
              alt="light mode"
              height={1063}
              width={750}
              className="w-full max-w-[1063px] dark:hidden h-auto block hidden md:block"
            />

            {/* Desktop - Dark Mode */}
            <Image
              src="/form builder -default 1.svg"
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
            <div
              className="w-[344.35px] h-[375px] border-[2px] border-[#5B5B99] rounded-[25px] relative hover:scale-[1.05] transition-transform duration-300 cursor-pointer px-8 pb-8 pt-4 flex flex-col justify-between"
              style={{
                boxShadow: "inset 0 0 25px 8px rgba(91, 91, 153, 0.6)", // Matches #5B5B99
              }}
            >
              <div
                className="text-[24px] font-semibold self-center pt-8
               bg-gradient-to-r from-[#000000] dark:from-[#F6F8F6] via-[#6C6C9F] to-[#5B5B99] 
               bg-clip-text text-transparent"
              >
                Real Time Analytics
              </div>
              <Image
                src="/rta2.svg"
                alt="rta"
                width={300}
                height={300}
                className="self-center"
              />
            </div>

            <div
              className="w-[344.35px] h-[375px] border-[2px] border-[#617DA9] rounded-[25px] relative hover:scale-[1.05] transition-transform duration-300 cursor-pointer px-8 pb-8 pt-4 flex flex-col justify-between"
              style={{
                boxShadow: "inset 0 0 25px 8px rgba(97, 125, 169, 0.6)",
              }}
            >
              <div
                className="text-[24px] font-semibold self-center pt-8
               bg-gradient-to-r from-[#000000] dark:from-[#F6F8F6] via-[#8C6E85] to-[#617DA9]
               bg-clip-text text-transparent"
              >
                Conditional Logic
              </div>
              <Image
                src="/cl2.svg"
                alt="rta"
                width={300}
                height={300}
                className="self-center"
              />
            </div>
            <div
              className="w-[344.35px] h-[375px] border-[2px] border-[#C36D81] rounded-[25px] relative hover:scale-[1.05] transition-transform duration-300 cursor-pointer px-8 pb-8 pt-4 flex flex-col justify-between"
              style={{
                boxShadow: "inset 0 0 25px 8px rgba(195, 109, 129, 0.6)",
              }}
            >
              <div
                className="text-[24px] font-semibold self-center pt-8
               bg-gradient-to-r from-[#000000] dark:from-[#F6F8F6] via-[#B85C70] to-[#C36D81] 
               bg-clip-text text-transparent"
              >
                Easy & Flexible
              </div>
              <Image
                src="/ef2.svg"
                alt="rta"
                width={300}
                height={300}
                className="self-center"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
