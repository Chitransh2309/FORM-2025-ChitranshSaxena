// 📁 app/action/form.ts
"use server";

import { connectToDB, disconnectFromDB } from "../../lib/mongodb";
import { auth } from '../../../auth';
import {Form} from "../../lib/interface"

export async function createFormIfNotExists(
  form_ID: string,
  title = "Untitled Form",
  description = "",
  version = 0,
  share_url = `/form/${form_ID}/share`,
  sections = []
) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("forms");

    const existing = await collection.findOne({ form_ID });
    if (!existing) {
      await collection.insertOne({
        form_ID,
        title,
        description,
        createdAt: new Date(),
        version,
        share_url,
        sections
        
      });
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Create Form Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
