// app/page.tsx
import About from "@/components/LandingPage/About";
import Footer from "../components/LandingPage/Footer";
import Hero from "../components/LandingPage/Hero";
import Navbar from "../components/LandingPage/Navbar";
import Image from "next/image";
import { auth } from "../../auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen w-full bg-[#F6F8F6] overflow-x-hidden dark:bg-[#191719]">
      <Navbar />
      <Hero />

      <div
        className="w-full px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center"
        id="about"
      >
        <About />
      </div>

      <div
        className="w-full px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center text-center"
        id="features"
      ></div>

      <div
        className="w-full px-4 sm:px-6 lg:px-12 py-10 flex flex-col items-center text-center"
        id="features"
      >
        <p className="text-xl sm:text-2xl font-bold text-[#3D3D3D] dark:text-white mb-8 text-center">
          Features That Make You Come Back
        </p>

        <div className="w-full flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl w-full place-items-center px-2 sm:px-4">
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
                  "from-[#000000] dark:from-[#F6F8F6] via-[#8C6E85] to-[#617DA9]",
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
                className={`w-full max-w-[340px] min-h-[360px] border-2 border-[${card.color}] rounded-[25px] hover:scale-[1.05] transition-transform duration-300 cursor-pointer px-4 sm:px-6 pt-6 pb-4 flex flex-col justify-between`}
                style={{ boxShadow: card.shadow }}
              >
                <div
                  className={`text-base sm:text-lg md:text-xl font-semibold self-center bg-gradient-to-r ${card.gradient} bg-clip-text text-transparent`}
                >
                  {card.title}
                </div>
                <Image
                  src={card.image}
                  alt={card.title}
                  width={240}
                  height={240}
                  className="self-center max-w-full h-auto"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
