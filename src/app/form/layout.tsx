"use client";

import style from "./layout.module.css";
import { useTransition, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { publishForm } from "@/app/action/publish";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";
import FormPublishModal from "@/components/FormPage/FormPublish";

export default function FormLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { id: formId } = useParams();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [formLink, setFormLink] = useState<string | null>(null);
  const router = useRouter();

  const isResponsePage = pathname.endsWith("/response");

  const handlePublish = () => {
    if (!formId || typeof formId !== "string") {
      alert("Form ID is missing or invalid");
      return;
    }

    startTransition(async () => {
      const result = await publishForm(formId);

      if (result.success && result.formLink) {
        setFormLink(result.formLink); // Show modal
      } else {
        alert(`❌ Failed to publish form: ${result.error}`);
      }
    });
  };

  const handleWorkspace = () => {
    router.push("/dashboard");
  };

  const handleCloseModal = () => {
    setFormLink(null);
    router.push("/dashboard");
  };

export default function FormLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {/* Navigation Bar */}
      {!isResponsePage && (
        <nav className="fixed top-0 left-0 w-full h-[75px] bg-neutral-600 text-white px-8 flex justify-between items-center text-lg z-50">
          <div className="flex-1">
            <button onClick={handleWorkspace}>&lt; Back to Workspace</button>
          </div>

          <div className="flex-1 text-center">
            <h2 className="font-semibold">Draft Name</h2>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-4">
            <ToggleSwitch />
            <button className="px-3">Setting</button>
            <button onClick={handlePublish} disabled={isPending}>
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        </nav>
      )}

      {/* Main content area */}
      <div className={`h-screen overflow-hidden ${!isResponsePage ? "pt-[75px]" : ""} bg-neutral-600`}>
        <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
          <div className="w-full h-full overflow-auto">
            {children}
          </div>
        </div>
      </div>

      {/* Modal after publish */}
      {formLink && (
        <FormPublishModal formLink={formLink} onClose={handleCloseModal} />
      )}
    </div>
  );
}