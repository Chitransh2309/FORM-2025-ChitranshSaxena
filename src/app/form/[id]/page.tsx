import { redirect } from "next/navigation";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../../auth";
import CenterNav from "@/components/FormPage/CenterNav";
import FormWrapper from "@/components/FormPage/FormHeader";
import { Form } from "@/lib/interface";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function FormPage({ params }: PageProps) {
  // Await the params Promise
  const resolvedParams = await params;
  const formId = resolvedParams.id;

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const { dbClient, db } = await connectToDB();
  const user = await db
    .collection("user")
    .findOne({ email: session.user.email });
  const userID = user?.user_ID;

  const form = (await db
    .collection("forms")
    .findOne({ form_ID: formId })) as Form;

  await disconnectFromDB(dbClient);

  if (!form) {
    return (
      <div className="text-center mt-20 text-xl text-red-600 font-bold">
        🚫 Access Denied: You don&apos;t own this form.
      </div>
    );
  }

  // if (form.createdBy !== userID && !form.viewerID && !form.editorID) {
  //   redirect(`/form/${formId}/response`);
  // }

  // ✅ FIX HERE: Convert to plain JSON-safe object
  const safeForm = JSON.parse(JSON.stringify(form));

  return (
    <FormWrapper form={safeForm}>
      <div className="bg-[#e8ede8] h-screen w-screen overflow-y-auto">
        <CenterNav
          form={form}
          currentUserEmail={session.user.email}
          currentUserID={userID}
        />
      </div>
    </FormWrapper>
  );
}
