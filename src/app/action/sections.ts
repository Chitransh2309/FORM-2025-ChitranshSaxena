"use server";

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
    const sectionsWithFormId = sections.map((section) => ({
      ...section,
      form_ID: formId, // Ensure form_ID is included
      updatedAt: new Date(),
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

export async function renameSectionTitle(
  formId: string,
  sectionId: string,
  newTitle: string
): Promise<{ success: boolean; error?: string }> {
  let dbClient;
  try {
    const { db, dbClient: client } = await connectToDB();
    dbClient = client;

    const result = await db.collection("forms").updateOne(
      { form_ID: formId },
      {
        $set: {
          "sections.$[s].title": newTitle,
        },
      },
      {
        arrayFilters: [{ "s.section_ID": sectionId }],
      }
    );

    if (result.modifiedCount === 0) {
      return { success: false, error: "Section not found or unchanged" };
    }

    return { success: true };
  } catch (err) {
    console.error("Rename error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  } finally {
    if (dbClient) await disconnectFromDB(dbClient);
  }
}
