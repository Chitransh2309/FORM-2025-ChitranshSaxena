import Footer from '../components/LandingPage/Footer';
import Hero from '../components/LandingPage/Hero';
import Navbar from '../components/LandingPage/Navbar';
import Image from 'next/image';

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
            <div className="w-[344.35px] h-[375px] relative hover:scale-[1.05] transition-transform duration-300 cursor-pointer">
              <Image
                src="/rta.svg"
                alt="rta"
                width={344.35}
                height={375}
                className="w-[344.35px] h-[375px] "
              />
              <Image
                src="/rta1.svg"
                alt="rta1"
                width={303}
                height={229}
                className="absolute w-[303px] h-[229px] top-30 left-1/2 transform -translate-x-1/2"
              />
            </div>

            <div className="w-[344.35px] h-[375px] hover:scale-[1.05] transition-transform duration-300 cursor-pointer">
              <Image
                src="/cl.svg"
                alt="cl"
                width={344.35}
                height={375}
                className="w-[344.35px] h-[375px]"
              />
            </div>

            <div className="w-[344.35px] h-[375px] hover:scale-[1.05] transition-transform duration-300 cursor-pointer">
              <Image
                src="/ef.svg"
                alt="ef"
                width={344.35}
                height={375}
                className="w-[344.35px] h-[375px]"
              />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
