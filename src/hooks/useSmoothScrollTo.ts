"use client";

import { useRouter } from "next/navigation";

export default function useSmoothScrollTo() {
  const router = useRouter();

  const scrollToSection = (sectionId: string) => {
    if (typeof window === "undefined") return;

    const handleScroll = () => {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    };

    if (window.location.pathname === "/") {
      handleScroll();
    } else {
      router.push("/").then(() => {
        setTimeout(handleScroll, 100);
      });
    }
  };

  return scrollToSection;
}
