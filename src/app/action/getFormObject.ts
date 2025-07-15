"use server";

import { Form } from "@/lib/interface";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";

/**
 * Fetch a form by its form_ID and return it **without** the Mongo `_id`.
 */
export default async function getFormObject(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();

    // raw Mongo document (may include _id and lack strict typing)
    const raw = await db
      .collection<Form>("forms")
      .findOne({ form_ID });

    await disconnectFromDB(dbClient);

    if (!raw) {
      return { success: false, error: "Form not found" };
    }

    // ─── strip _id before sending to client ───
    //        (rest now matches your Form interface)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...formWithoutId } = raw;

    return { success: true, data: formWithoutId };
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
