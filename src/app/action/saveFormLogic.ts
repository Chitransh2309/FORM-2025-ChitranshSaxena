// /app/action/saveFormLogic.ts
"use server";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";

export async function saveFormLogic(form_ID: string, logicRules: any[]) {
  try {
    console.log("📨 Saving logic for:", form_ID);
    console.log("🧠 Rules:", JSON.stringify(logicRules, null, 2));

    const { db, dbClient } = await connectToDB();

    const result = await db
      .collection("forms")
      .updateOne({ form_ID }, { $set: { logic: logicRules } });

    await disconnectFromDB(dbClient);
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error("❌ Failed to save logic:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
