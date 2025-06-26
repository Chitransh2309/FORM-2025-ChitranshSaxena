import { connectToDB } from "@/lib/mongodb";
import { disconnectFromDB } from "@/lib/mongodb";
import { Section } from "@/lib/interface";

export async function saveSectionsToDB(formId: string, sections: Section[]) {
  let dbClient;
  try {
    const { db, dbClient: client } = await connectToDB();
    dbClient = client;
    const collection = db.collection("sections");

    // First, remove any existing sections for this form to prevent duplicates
    await collection.deleteMany({ form_ID: formId });

    // Then insert all sections with the form_ID
    const sectionsWithFormId = sections.map(section => ({
      ...section,
      form_ID: formId, // Ensure form_ID is included
      updatedAt: new Date()
    }));

    if (sectionsWithFormId.length > 0) {
      await collection.insertMany(sectionsWithFormId);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Save Sections Error:", err);
    if (dbClient) {
      await disconnectFromDB(dbClient);
    }
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}