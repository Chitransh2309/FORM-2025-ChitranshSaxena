import About from "@/components/LandingPage/About";
import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import Image from "next/image";

export default async function Home() {
  return (
    <div className="font-[Outfit] min-h-screen w-full bg-[#F6F8F6] dark:bg-[#191719] text-black dark:text-white overflow-x-hidden">
      <Navbar />
      <main className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 md:px-10 lg:px-16 xl:px-20 2xl:px-24">
        <section className="py-5 sm:py-5 md:py-14 lg:py-10">
          <Hero />
        </section>
      </main>

      {/* About Section */}
      <section
        id="about"
        className="py-8 sm:py-10 md:py-14 lg:py-10 flex flex-col items-center"
      >
        <About />
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-10 sm:py-12 md:py-16 lg:py-10 text-center"
      >
        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold text-[#3D3D3D] dark:text-white mb-12">
          Features That Make You Come Back
        </h2>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-3 max-w-[1600px] 2xl:max-w-[1800px] w-fit place-items-center px-2 sm:px-4">
            {[
              {
                title: "Real Time Analytics",
                color: "#5B5B99",
                image: "/rta2.svg",
                gradient:
                  "from-[#000000] dark:from-[#F6F8F6] via-[#6C6C9F] to-[#5B5B99]",
                shadow: "inset 0 0 25px 8px rgba(91, 91, 153, 0.6)",
              },
              {
                title: "Conditional Logic",
                color: "#617DA9",
                image: "/cl2.svg",
                gradient:
                  "from-[#000000] dark:from-[#F6F8F6] via-[#6B88B0] to-[#617DA9]",
                shadow: "inset 0 0 25px 8px rgba(97, 125, 169, 0.6)",
              },
              {
                title: "Easy & Flexible",
                color: "#C36D81",
                image: "/ef2.svg",
                gradient:
                  "from-[#000000] dark:from-[#F6F8F6] via-[#B85C70] to-[#C36D81]",
                shadow: "inset 0 0 25px 8px rgba(195, 109, 129, 0.6)",
              },
            ].map((card, i) => (
              <div
                key={i}
                className={`w-full min-h-[300px]  xl:min-h-[320px] 2xl:min-h-[340px] border-2  rounded-[25px] hover:scale-[1.05] transition-transform duration-300 cursor-pointer px-4 sm:px-6 pt-6 pb-4 flex flex-col justify-between`}
                style={{
                  boxShadow: card.shadow,
                  borderColor: card.color,
                }}
              >
                <div
                  className={`text-base sm:text-lg md:text-xl xl:text-2xl font-semibold bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent mb-4`}
                >
                  {card.title}
                </div>
                <Image
                  src={card.image}
                  alt={card.title}
                  width={360}
                  height={360}
                  className="self-center w-full h-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
