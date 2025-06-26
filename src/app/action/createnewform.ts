"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { v4 as uuidv4 } from "uuid";
import { Form } from "@/lib/interface";

export async function createNewForm(name: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    let userID = "anonymous";

    if (session?.user?.email) {
      const userDoc = await db
        .collection("user")
        .findOne({ email: session.user.email });
      if (userDoc && userDoc.user_ID) {
        userID = userDoc.user_ID;
      }
    }

    const form_ID = uuidv4();

    const newForm: Form = {
      form_ID,
      title: name || "Untitled Form",
      description: "",
      createdAt: new Date(),
      createdBy: userID,
      version: 1.0,
      sections: [],
    };

    await db.collection("forms").insertOne(newForm);
    await disconnectFromDB(dbClient);
    return form_ID;
  } catch (err) {
    console.error("❌ Error creating form:", err);
    return null;
  }
}
