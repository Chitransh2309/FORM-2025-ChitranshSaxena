"use client";

import style from "./layout.module.css";
import { useTransition } from "react";
import { useParams } from "next/navigation";
import { publishForm } from "@/app/action/publish";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id: formId } = useParams();
  const [isPending, startTransition] = useTransition();

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
      } else {
        alert(`❌ Failed to publish form: ${result.error}`);
      }
    });
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 w-full h-[75px] bg-neutral-600 text-white px-8 flex flex-row justify-between items-center text-lg z-50">
        {/* Left: Back Button */}
        <div className="flex-1">
          <h2 className="font-semibold">&lt; Back to Workspace</h2>
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center">
          <h2 className="font-semibold">Draft Name</h2>
        </div>

        {/* Right: Controls */}
        <div className="flex-1 flex flex-row justify-end items-center space-x-4">
          <label className={style.switch}>
            {/* Toggle UI */}
            <input type="checkbox" className={style.input} />
            <span className={style.slider}></span>
          </label>
          <button className="px-3">Setting</button>
          <button onClick={handlePublish} disabled={isPending}>
            {isPending ? "Publishing..." : "Publish"}
          </button>
        </div>
      </nav>

      <div className="pt-[75px] bg-neutral-600">
        <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>
    </div>
  );
}
