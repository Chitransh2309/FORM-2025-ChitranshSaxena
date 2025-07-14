"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { Form } from "@/lib/interface";
import { MongoClient } from "mongodb";

export async function publishForm(formId: string) {
  if (!formId) {
    return { success: false, error: "Form ID is required" };
  }

  const client: MongoClient | null = null;

  try {
    const connection = await connectToDB();
    const db = connection.db;

    const formsCollection = db.collection<Form>("forms");

    const publishedAt = new Date();
    const formLink = `http://localhost:3000/form/${formId}`;

    const result = await formsCollection.updateOne(
      { form_ID: formId },
      {
        $set: {
          isActive: true,
          publishedAt,
          formLink,
        },
      }
    );

    if (result.modifiedCount === 1) {
      return { success: true, formLink };
    } else {
      return { success: false, error: "No form was updated. Check form_ID." };
    }
  } catch (error) {
    console.error("Error publishing form:", error);
    return {
      success: false,
      error: "An error occurred while publishing the form.",
    };
  } finally {
    if (client) {
      await disconnectFromDB(client);
    }
  }
}
