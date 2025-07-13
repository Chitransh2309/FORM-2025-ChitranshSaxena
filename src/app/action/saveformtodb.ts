"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { Form, FormResponse } from "@/lib/interface";

export async function saveFormToDB(form: Form) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("forms");

    const existing = await collection.findOne({ form_ID: form.form_ID });

    // ✅ Remove _id field if it exists
    const { _id, ...safeToUpdate } = form as any;

    if (existing) {
      await collection.updateOne(
        { form_ID: form.form_ID },
        { $set: safeToUpdate }
      );
    } else {
      await collection.insertOne(form);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Save Form Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

export async function saveFormResponse(
  response: FormResponse
): Promise<boolean> {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("response");

    const { _id, ...responseToSave } = response as any;

    const result = await collection.updateOne(
      {
        form_ID: response.form_ID,
        userId: response.userId,
      },
      {
        $set: {
          ...responseToSave,
          submittedAt: new Date(),
        }
      },
      {
        upsert: true,
      }
    );

    if (!result.acknowledged) {
      throw new Error("Database operation was not acknowledged");
    }

    await disconnectFromDB(dbClient);

    return true;
  } catch (err) {
    console.error("Error saving form response:", err);
    return false;
  }
}
