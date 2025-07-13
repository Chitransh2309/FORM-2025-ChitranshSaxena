"use server";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { Form } from "@/lib/interface";

// Define a type for serialized form (with string dates instead of Date objects)
type SerializedForm = Omit<Form, '_id' | 'createdAt' | 'publishedAt'> & {
  _id: string;
  createdAt: string | null;
  publishedAt: string | null;
};

export default async function getFormObject(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const form = await db.collection("forms").findOne({ form_ID });
    await disconnectFromDB(dbClient);
    
    if (!form) {
      return { success: false, error: "Form not found" };
    }
    
    // ✅ Convert MongoDB document to plain object with proper typing
    const plainForm: SerializedForm = {
      ...form,
      _id: form._id?.toString(), // convert ObjectId
      createdAt: form.createdAt?.toString() || null,
      publishedAt: form.publishedAt?.toString() || null,
    } as SerializedForm;
    
    return { success: true, data: plainForm };
  } catch (error) {
    console.error("❌ Fetch Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}