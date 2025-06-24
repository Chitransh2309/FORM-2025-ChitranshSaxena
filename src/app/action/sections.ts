// /app/action/sections.ts
'use server';

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";

interface Section {
  section_ID: string;
  form_ID: string;
  title: string;
  description?: string;
}

export async function createOrUpdateSection(section: Section) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("sections");

    const existing = await collection.findOne({ section_ID: section.section_ID });

    if (existing) {
      await collection.updateOne(
        { section_ID: section.section_ID },
        { $set: section }
      );
    } else {
      await collection.insertOne(section);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function getSectionsByFormId(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("sections");

    const sections = await collection.find({ form_ID }).toArray();

    await disconnectFromDB(dbClient);
    return { success: true, data: sections };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function deleteSection(section_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const result = await db.collection("sections").deleteOne({ section_ID });

    await disconnectFromDB(dbClient);
    return {
      success: result.deletedCount === 1,
      message: result.deletedCount === 1 ? "Section deleted" : "Not found",
    };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}

export async function saveSectionsToDB(sections: Section[]) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("sections");

    const operations = sections.map(async (section) => {
      const existing = await collection.findOne({ section_ID: section.section_ID });
      if (existing) {
        return await collection.updateOne(
          { section_ID: section.section_ID },
          { $set: section }
        );
      } else {
        return await collection.insertOne(section);
      }
    });

    await Promise.all(operations);
    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Save Sections Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}