// ✅ Updated createNewForm.ts

"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { Form } from "@/lib/interface";
import { v4 as uuidv4 } from "uuid";

export async function createNewForm(): Promise<string | null> {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    const email = session?.user?.email ?? "anonymous";
    const userDoc = await db.collection("user").findOne({ email });
    const userID = userDoc?.user_ID ?? "anonymous";

    const form_ID = uuidv4();

    const newForm: Form = {
      form_ID,
      title: "Untitled Form",
      description: "",
      createdAt: new Date(),
      createdBy: userID,
      version: 1,
      sections: [],
    };

    await db.collection("forms").insertOne(newForm);
    await disconnectFromDB(dbClient);

    return form_ID; // ✅ Return just the string
  } catch (error) {
    console.error("❌ Error creating new form:", error);
    return null;
  }
}
