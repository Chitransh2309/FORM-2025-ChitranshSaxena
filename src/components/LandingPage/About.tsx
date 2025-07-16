"use client";

import React from "react";
import Lottie from "lottie-react";

import DarkAnim_2 from "@/lotties/Darkmode_2.json";
import LightAnim from "@/lotties/Lightmode.json";

export default function About() {
  return (
    <div className="w-full px-6 sm:px-10 lg:px-24 xl:px-32 pb-12 dark:bg-[#191719] font-[Outfit]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        {/* Animation LEFT on desktop, BELOW on mobile */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-start lg:-ml-6">
          {/* Light Mode Animation */}
          <div className="block dark:hidden w-full max-w-[500px] h-auto">
            <Lottie animationData={LightAnim} loop autoplay />
          </div>

          {/* Dark Mode Animation */}
          <div className="hidden dark:block w-full max-w-[500px] h-auto">
            <Lottie animationData={DarkAnim_2} loop autoplay />
          </div>
        </div>

        {/* Text RIGHT on desktop, ABOVE on mobile */}
        <div className="order-1 lg:order-2">
          <h1 className="font-extrabold text-[36px] sm:text-[48px] lg:text-[56px] text-black dark:text-white leading-tight mb-4">
            About Us
          </h1>
          <p className="font-medium text-base sm:text-lg md:text-xl lg:text-2xl text-black dark:text-white leading-relaxed sm:leading-8">
            FormSpace, created by ACM-VIT, a leading student organization known
            for driving technological innovation since 2009, reflects our
            ongoing commitment to accessible, impactful technology. Continuing
            that legacy, FormSpace is a powerful, user-friendly platform for
            building smart, dynamic forms. Whether you&apos;re running surveys,
            collecting feedback, or organizing events, FormSpace simplifies the
            way you create, share, and analyze data. With an intuitive
            interface, flexible conditional logic, and real-time analytics,
            FormSpace empowers users to build adaptive forms that perfectly fit
            their purpose.
          </p>
        </div>
      </div>
    </div>
  );
}
