"use client";

import { useParams, usePathname, useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { publishForm } from "@/app/action/publish";
import ToggleSwitch from "@/components/LandingPage/ToggleSwitch";
import FormPublishModal from "./FormPublish";
import FormSettings from "./FormSettings";
import { Form, FormSettings as FormSettingsType } from "@/lib/interface";
import { Settings } from "lucide-react";

export default function FormHeader({
  children,
  form,
}: {
  children: React.ReactNode;
  form: Form;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [formLink, setFormLink] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);

  const isResponsePage = pathname.endsWith("/response");

  const handlePublish = () => {
    if (!form.form_ID || typeof form.form_ID !== "string") {
      alert("Form ID is missing or invalid");
      return;
    }

    startTransition(async () => {
      const result = await publishForm(form.form_ID);
      if (result.success && result.formLink) {
        setFormLink(result.formLink);
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
  const [formSettings, setFormSettings] = useState<FormSettingsType>(
    form.settings
  );
  return (
    <div className="font-[Outfit]">
      {!isResponsePage && (
        <nav className="fixed top-0 left-0 w-full h-[75px] overflow-hidden min-h-0 bg-neutral-600 text-white px-8 flex justify-between items-center text-lg z-50">
          <div className="flex-1 hidden md:block">
            <button onClick={handleWorkspace}>&lt; Back to Workspace</button>
          </div>

          <div className="flex flex-row items-center space-x-1">
            <div className="md:hidden">
              <button onClick={handleWorkspace}>&lt;</button>
            </div>
            <div className="flex-1 text-center">
              <h2 className="font-semibold"> Draft Name</h2>
            </div>
          </div>

          <div className="flex-1 flex justify-end items-center space-x-0 md:space-x-4">
            <ToggleSwitch />
            <button onClick={() => setShowSettings(true)} className="px-3">
              <Settings />
            </button>
            {showSettings && (
              <FormSettings
                formId={form.form_ID}
                formSettings={formSettings}
                setFormSettings={setFormSettings}
                onClose={() => setShowSettings(false)}
              />
            )}

            <button
              onClick={handlePublish}
              disabled={isPending}
              className={`h-7 w-25 rounded-md text-white font-semibold transition duration-200 ${
                isPending
                  ? "bg-[#61A986] cursor-not-allowed"
                  : "bg-[#61A986] hover:bg-[#43755d]"
              }`}
            >
              {isPending ? "Publishing..." : "Publish"}
            </button>
          </div>
        </nav>
      )}

      <div
        className={`h-screen overflow-hidden ${
          !isResponsePage ? "pt-[75px]" : ""
        } bg-neutral-600`}
      >
        <div className="bg-neutral-100 text-black w-screen h-screen flex">
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>

      {formLink && (
        <FormPublishModal formLink={formLink} onClose={handleCloseModal} />
      )}
    </div>
  );
}
