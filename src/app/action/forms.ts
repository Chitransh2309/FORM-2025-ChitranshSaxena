// 📁 app/action/form.ts
'use server';

import { connectToDB, disconnectFromDB } from '../../lib/mongoDB';

interface Form {
  form_ID: string;
  title: string;
  createdAt?: Date;
}

export async function createFormIfNotExists(form_ID: string, title = "Untitled Form") {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("forms");

    const existing = await collection.findOne({ form_ID });
    if (!existing) {
      await collection.insertOne({
        form_ID,
        title,
        createdAt: new Date(),
      });
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Create Form Error:", err);
    return { success: false, error: err instanceof Error ? err.message : "Unknown error" };
  }
}