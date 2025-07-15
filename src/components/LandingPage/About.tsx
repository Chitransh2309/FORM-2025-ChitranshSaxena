import React from 'react';

export default function About() {
  return (
    <div className="w-full px-16 sm:px-18 lg:px-32 pt-32 dark:bg-[#191719] mx-0">
      <div className="flex flex-col lg:flex-row items-center lg:items-start gap-10 mx-0">
        {/* LEFT: Text Content */}
        <div className="w-full lg:w-1/2">
          <h1 className="font-outfit font-extrabold text-[48px] sm:text-[60px] leading-tight text-black dark:text-white mb-2">
            About Us
          </h1>
          <p className="font-outfit font-semibold text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed sm:leading-8 text-black dark:text-white">
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
