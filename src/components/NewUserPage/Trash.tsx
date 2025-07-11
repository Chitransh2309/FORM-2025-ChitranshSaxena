import { auth } from '../../../auth';
import { getTrashedForms, deleteFormPermanently } from '@/app/action/forms';
import { redirect } from 'next/navigation';

export default async function TrashPage() {
  const session = await auth();
  if (!session?.user?.email) redirect('/');

  const userId = session.user.id || session.user.email; // Use 'id' or fallback to 'email' if 'id' does not exist
  const trashedForms = await getTrashedForms(userId);

  return (
    <section className="p-6 text-black dark:text-white">
      <h1 className="text-2xl font-bold mb-4">Trashed Forms</h1>

      {trashedForms.length === 0 && (
        <p className="text-gray-600">No discarded forms.</p>
      )}

      <div className="grid grid-cols-2 gap-4">
        {trashedForms.map((form) => (
          <div key={form.form_ID} className="p-4 border rounded-lg bg-white dark:bg-[#2a2a2a]">
            <p className="font-semibold">{form.title || 'Untitled Form'}</p>

            <div className="flex justify-end gap-2 mt-4">
              <form
                action={async () => {
                  'use server';
                  await deleteFormPermanently(form.form_ID);
                }}
              >
                <button className="text-red-600 hover:underline text-sm">
                  Delete Permanently
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
