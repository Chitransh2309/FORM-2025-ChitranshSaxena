'use server';

import { connectToDB, disconnectFromDB } from '@/lib/mongodb';

export async function updateFormInfo(formId: string, title: string, description: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("forms"); // adjust to your actual form collection name

    const result = await collection.updateOne(
      { form_ID: formId },
      { $set: { title, description } }
    );

    await disconnectFromDB(dbClient);

    if (result.modifiedCount === 0) {
      return {
        success: false,
        message: "No document was updated. Form may not exist.",
      };
    }

    return {
      success: true,
      message: "Form updated successfully",
    };
  } catch (error) {
    console.error("❌ DB Update Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
