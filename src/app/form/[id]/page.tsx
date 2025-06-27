import { redirect } from "next/navigation";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import CenterNav from "@/components/FormPage/CenterNav";
import { auth } from "../../../../auth";

export default async function FormPage(props: { params: { id: string } }) {
  const { params } = props;
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

  if (!form || form.createdBy !== userID) {
    return (
      <div className="text-center mt-20 text-xl text-red-600 font-bold">
        🚫 Access Denied: You don't own this form.
      </div>
    );
  }

  return (
    <div className="bg-[#e8ede8]">
      <CenterNav formId={formId} />
    </div>
  );
}
