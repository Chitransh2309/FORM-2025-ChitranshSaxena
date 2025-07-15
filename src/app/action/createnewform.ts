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
      isActive: false,
      publishedAt: null,
      share_url:"",
      isDeleted: false,
      isStarred: false,
      settings: {
        maxResponses: 0,
        startDate: new Date(),
        endDate: undefined,
        tab_switch_count: false,
        timer: 0,
        autoSubmit: false,
        cameraRequired: false,
        copy_via_email: false,
        timingEnabled: false,
      },
    };


    // Insert the form into the collection
    await db.collection("forms").insertOne(newForm);

    // Add form_ID to user's formIDs array
    if (userID !== "anonymous") {
      await db.collection("user").updateOne(
        { user_ID: userID },
        { $addToSet: { forms: form_ID } } // 👈 add form_ID to user
      );
    }

    await disconnectFromDB(dbClient);
    return form_ID;
  } catch (err) {
    console.error("❌ Error creating form:", err);
    return null;
  }
}
