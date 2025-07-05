"use client";

import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";
import ResponseNavigator from "@/components/ResponseViewerPage/ResponseNavigator";
import ViewModeDropdown from "@/components/ResponseViewerPage/ViewModeDropdown";
import Link from "next/link";

interface HeaderProps {
  currentIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  userName: string;
  submittedAt: Date;
  onUserChange: (index: number) => void;
  onViewModeChange: (mode: "Individual response" | "Grouped response") => void;
  viewMode: "Individual response" | "Grouped response";
  activeTab: "Individual" | "Analytics";
  onActiveTabChange: (mode : "Individual" | "Analytics")=>void;
}

export default function HeaderSection({
  currentIndex,
  total,
  onPrev,
  onNext,
  userName,
  submittedAt,
  onUserChange,
  onViewModeChange,
  viewMode,
  activeTab,
  onActiveTabChange,
}: HeaderProps) {

  return (
    <>
      <div className="flex justify-between pt-5 items-center">
        <Link href='/dashboard' className="lg:text-xl text-md text-black dark:text-white">
        <button>
          Back to Dashboard
        </button></Link>
        <ToggleSwitch />
      </div>

      <div className="mb-5 flex justify-center mt-6 px-4 sm:px-0">
        <div className="flex justify-between items-center w-full max-w-[480px] h-[58px] rounded-[10px] dark:bg-[#414141] shadow-[0px_0px_4px_rgba(0,0,0,0.5)] bg-[#91C4AB]/45 px-2 sm:px-4">
          {["Individual", "Analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => onActiveTabChange(tab as "Individual" | "Analytics")}
              className={`flex-1 mx-1 text-[15px] sm:text-[16px] py-2 rounded-[7px] transition-colors duration-200 ${
                activeTab === tab
                  ? "bg-[#61A986] text-black dark:text-white"
                  : "text-black dark:text-white hover:bg-[#b9d9c8] dark:hover:bg-[#353434]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
      
      {activeTab==="Individual"&&<>
      <div className="mb-5 flex justify-between items-center px-4">
        <h2 className="text-xl font-semibold">Responses: {total}</h2>
        <ViewModeDropdown
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>

      {viewMode === "Individual response" ? (
        <ResponseNavigator
          currentIndex={currentIndex}
          total={total}
          onPrev={onPrev}
          onNext={onNext}
          userName={userName}
          submittedAt={submittedAt}
          onUserChange={onUserChange}
        />
      ) : (
        <div className="text-center text-sm text-gray-700 dark:text-gray-300 mb-6 px-4">
          You are viewing all responses to one question together.
        </div>
      )}
      </>}
    </>
  );
}
