"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { Form } from "@/lib/interface";
import { v4 as uuidv4 } from "uuid";

export default async function getFormObject(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();

    const form = await db.collection("forms").findOne({ form_ID });

    await disconnectFromDB(dbClient);

    if (!form) {
      return { success: false, error: "Form not found" };
    }

    // ✅ Convert MongoDB document to plain object
    const plainForm: any = {
      ...form,
      _id: form._id?.toString(), // convert ObjectId
      createdAt: form.createdAt?.toString() || null,
      publishedAt: form.publishedAt?.toString() || null,
    };

    return { success: true, data: plainForm };
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
