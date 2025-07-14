// app/response/[id]/page.tsx
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import ClientResponseViewer from "@/components/ResponseViewerPage/ClientResponseViewer";
import { auth } from "../../../../auth";
import { redirect } from "next/navigation";

/* ✅ 1. Updated prop type for Next.js 15 - params is now a Promise */
export type PageProps = {
  params: Promise<{ id: string }>;
};

/* ✅ 2. Use that type for the default export */
export default async function ResponsePage({ params }: PageProps) {
  try {
    const formId = (await params).id;
    const session = await auth();
    if (!session?.user?.email) redirect("/");

    const { db, dbClient } = await connectToDB();

    const form = await db.collection("forms").findOne({ form_ID: formId });
    const user = await db.collection("user").findOne({ email: session.user.email });
    const userID = user?.user_ID;
    const responses = await db
      .collection("response")
      .find({ form_ID: formId })
      .toArray();

    await disconnectFromDB(dbClient);

    if (!form || responses.length === 0) {
      return (
        <div className="text-center mt-20 text-lg text-black">
          Loading or no responses found.
        </div>
      );
    }
    if (userID !== form.createdBy) {
      return (
        <div className="text-center mt-20 text-lg text-black">
          You don&apos;t own this form.
        </div>
      );
    }

    // Safely serialise Mongo docs for the client component
    return (
      <ClientResponseViewer
        form={JSON.parse(JSON.stringify(form))}
        responses={JSON.parse(JSON.stringify(responses))}
      />
    );
  } catch (err) {
    console.error("🚨 MongoDB Fetch Error:", err);
    return (
      <div className="text-center mt-20 text-red-600 dark:text-red-400">
        Failed to load responses. Please try again later.
      </div>
    );
  }
}