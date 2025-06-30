"use client";

import style from "./layout.module.css";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { publishForm } from "@/app/action/Publish";
// import { Link } from "lucide-react";
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";


export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id: formId } = useParams();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // ✅ Define this inside the component
  const handlePublish = () => {
  if (!formId || typeof formId !== "string") {
    alert("Form ID is missing or invalid");
    return;
  }

  startTransition(async () => {
    const result = await publishForm(formId);

    if (result.success) {
      alert("✅ Form published successfully!");
      router.push("/dashboard"); // ✅ Navigate to dashboard
    } else {
      alert(`❌ Failed to publish form: ${result.error}`);
    }
  });
};

  const handleWorkspace = () => {
    router.push("/dashboard"); // ✅ Navigate to dashboard
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full h-[75px] bg-[#494949] text-white px-8 flex flex-row justify-between items-center text-lg z-50">
        {/* Left: Back Button */}
        <div className="flex-1">
          <button onClick={handleWorkspace}>
            &lt; Back to Workspace
          </button>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <h2 className="font-semibold">Draft Name</h2>
        </div>

        {/* Right: Controls */}
        <div className="flex-1 flex flex-row justify-end items-center space-x-4">
          <ToggleSwitch />
          <button className="px-3">Setting</button>
          <button onClick={handlePublish} disabled={isPending}>
            {isPending ? "Publishing..." : "Publish"}
          </button>
        </div>
      </nav>

      <div className="h-screen overflow-hidden pt-[75px] bg-neutral-600">
        <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
