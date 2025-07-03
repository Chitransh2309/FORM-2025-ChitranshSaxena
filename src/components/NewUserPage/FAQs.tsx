import React, { useState } from "react";
import { HiPlus, HiMinus } from "react-icons/hi";


const FAQs = ({
 showFaq,
 setShowFaq,
}: {
 showFaq: boolean;
 setShowFaq: (val: boolean) => void;
}) => {
 if (!showFaq) return null;


 const [activeIndex, setActiveIndex] = useState<number | null>(0);


 const faqData = [
   {
     question: "Can I build multi-page or multi-step forms?",
     answer: "Yes, you can create multi-step forms by adding sections. Each step can have unique fields, improving user experience and making long forms easier to complete.",
   },
   {
     question: "How do I preview a form before publishing it?",
     answer: "Click the Preview button in the editor to see how your form looks and behaves, including conditional logic and validations, before making it live. It is available for both desktop and mobile screen.",
   },
   {
     question: "How does conditional logic work in this form builder?",
     answer: "Conditional logic lets you show, hide, or change fields based on user input, helping create personalized form experiences without writing any code.",
   },
   {
     question: "Can I show or hide fields based on user responses?",
     answer: "Yes, you can easily set rules to show or hide specific fields when certain answers are selected, allowing for dynamic and responsive forms.",
   },
   {
     question: "Is it possible to validate dates, numbers, or specific input ranges?",
     answer: "Absolutely. You can set validations for dates, numbers, or ranges—for example, minimum/maximum age or future dates only—ensuring users enter valid data.",
   },
 ];


 const toggleFAQ = (index: number) => {
   setActiveIndex(activeIndex === index ? null : index);
 };


 return (
   <div className="fixed inset-0 z-[100] bg-black/40 flex items-center justify-center px-4 py-6 sm:py-12 overflow-y-auto dark:bg-white/10 backdrop-blur-[3px]">
     <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-800 text-black dark:text-white rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-200 dark:border-neutral-700">
       {/* Modal Header */}
       <div className="text-center mb-6">
         <h2 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
           Frequently Asked Questions
         </h2>
         <p className="text-sm text-gray-600 dark:text-gray-300">
           Everything you need to know about our product.
         </p>
         <button
           onClick={() => setShowFaq(false)}
           aria-label="Close FAQ"
           className="absolute top-4 right-4 text-gray-500 dark:text-gray-300 hover:text-black dark:hover:text-white text-2xl sm:text-xl font-semibold"
         >
           ×
         </button>
       </div>


       {/* Accordion-style FAQ list */}
       <div className="space-y-2">
         {faqData.map((faq, index) => {
           const isActive = activeIndex === index;
           return (
             <div
               key={index}
               className={`border rounded-lg overflow-hidden transition-shadow duration-300 ${
                 isActive ? 'shadow-[0_0_25px_rgba(0,0,0,0.85)] dark:shadow-[0_0_25px_rgba(255,255,255,0.5)]': ''
               }`}
             >
               <button
                 onClick={() => toggleFAQ(index)}
                 className={`w-full flex justify-between items-center px-4 py-3 text-left ${
                   isActive
                     ? "bg-black text-white dark:bg-white dark:text-black"
                     : "bg-white text-black dark:bg-neutral-800 dark:text-white"
                 }`}
               >
                 <span className="font-medium">{faq.question}</span>
                 <span className="bg-[#61A986] text-white rounded-full p-1.5 flex items-center justify-center">
                   {isActive ? (
                     <HiMinus className="w-4 h-4" />
                   ) : (
                     <HiPlus className="w-4 h-4" />
                   )}
                 </span>
               </button>
               {isActive && (
                 <div className="px-4 py-3 bg-black text-white dark:bg-white dark:text-black text-sm">
                   {faq.answer}
                 </div>
               )}
             </div>
           );
         })}
       </div>
     </div>
   </div>
 );
};


export default FAQs;



