import { redirect } from "next/navigation";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../../auth";
import CenterNav from "@/components/FormPage/CenterNav";
import FormWrapper from "@/components/FormPage/FormHeader";

export default async function FormPage({ params }: { params: { id: string } }) {
  const formId = params.id;

  const session = await auth();
  if (!session?.user?.email) {
    redirect("/");
  }

  const { dbClient, db } = await connectToDB();

  const user = await db
    .collection("user")
    .findOne({ email: session.user.email });
  const userID = user?.user_ID;

  const form = await db.collection("forms").findOne({ form_ID: formId });

  await disconnectFromDB(dbClient);

  if (!form) {
    return (
      <div className="text-center mt-20 text-xl text-red-600 font-bold">
        🚫 Access Denied: You don't own this form.
      </div>
    );
  }

  if (form.createdBy !== userID) {
    redirect(`/form/${formId}/response`);
  }

  return (
    <FormWrapper formId={formId}>
      <div className="bg-[#e8ede8]">
        <CenterNav formId={formId} />
      </div>
    </FormWrapper>
  );
}
