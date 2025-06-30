"use client";

import style from "./layout.module.css";
import { useTransition } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { publishForm } from "@/app/action/Publish";
// import { Link } from "lucide-react";
<<<<<<< HEAD
import { useRouter } from "next/navigation";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";
=======
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";

>>>>>>> d58d123a77669eca03d89308e0e02dfbad7ce3f0

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id: formId } = useParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const isResponsePage = pathname.endsWith("/response");

  const handlePublish = () => {
    if (!formId || typeof formId !== "string") {
      alert("Form ID is missing or invalid");
      return;
    }

    startTransition(async () => {
      const result = await publishForm(formId);

      if (result.success) {
        alert("✅ Form published successfully!");
        router.push("/dashboard");
      } else {
        alert(`❌ Failed to publish form: ${result.error}`);
      }
    });
  };

  const handleWorkspace = () => {
    router.push("/dashboard");
  };

  return (
    <div>
      {!isResponsePage && (
        <nav className="fixed top-0 left-0 w-full h-[75px] bg-neutral-600 text-white px-8 flex flex-row justify-between items-center text-lg z-50">
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
      )
    }
      <div className={`h-screen overflow-hidden ${!isResponsePage ? "pt-[75px]" : ""} bg-neutral-600`}>
        <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
      
  );
}
