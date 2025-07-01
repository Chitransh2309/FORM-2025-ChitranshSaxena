import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import ClientResponseViewer from "@/components/ResponseViewerPage/ClientResponseViewer";

export default async function ResponsePage({
  params,
}: {
  params: { id: string };
}) {
  try {
    const formId = params.id;

    const { dbClient, db } = await connectToDB();

    const form = await db.collection("forms").findOne({ form_ID: formId });

    const responses = await db
      .collection("response")
      .find({ form_ID: formId })
      .toArray();

    console.log("Responses:", responses);

    await disconnectFromDB(dbClient);

    if (!form || responses.length === 0) {
      return (
        <div className="text-center mt-20 text-lg text-gray-600 dark:text-gray-300">
          Loading or no responses found.
        </div>
      );
    }

    // Ensure safe serialization of MongoDB documents
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
