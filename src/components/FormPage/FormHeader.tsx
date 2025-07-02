'use client';

import { useParams, usePathname, useRouter } from 'next/navigation';
import { useTransition, useState } from 'react';
import { publishForm } from '@/app/action/publish';
import ToggleSwitch from '@/components/LandingPage/ToggleSwitch';
import FormPublishModal from './FormPublish';
import FormSettings from './FormSettings';
import { Form } from '@/lib/interface';
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

  const isResponsePage = pathname.endsWith('/response');

  const handlePublish = () => {
    if (!form.form_ID || typeof form.form_ID !== 'string') {
      alert('Form ID is missing or invalid');
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
    router.push('/dashboard');
  };

  const handleCloseModal = () => {
    setFormLink(null);
    router.push('/dashboard');
  };

  return (
    <div>
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
            <button onClick={() => setShowSettings(true)} className="px-3">
              Setting
            </button>
            {showSettings && (
              <FormSettings
                formId={form.form_ID}
                initialSettings={form.settings}
                onClose={() => setShowSettings(false)}
              />
            )}

            <button onClick={handlePublish} disabled={isPending}>
              {isPending ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </nav>
      )}

      <div
        className={`h-screen overflow-hidden ${
          !isResponsePage ? 'pt-[75px]' : ''
        } bg-neutral-600`}
      >
        <div className="bg-neutral-100 text-black w-screen h-[92vh] flex">
          <div className="w-full h-full overflow-auto">{children}</div>
        </div>
      </div>

      {formLink && (
        <FormPublishModal formLink={formLink} onClose={handleCloseModal} />
      )}
    </div>
  );
}
