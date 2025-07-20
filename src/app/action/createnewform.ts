"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { v4 as uuidv4 } from "uuid";
import { Form,QuestionType } from "@/lib/interface";
import { redirect } from "next/navigation";
export async function createNewForm(name: string) {
  let form_ID: string;
  let db, dbClient;
  try {
    ({ db, dbClient } = await connectToDB());
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

    form_ID = uuidv4();

   const newForm: Form = {
  form_ID,
  title: name || "Untitled Form",
  description: "",
  createdAt: new Date(),
  createdBy: userID,
  editorID: [],
  viewerID: [],
  version: 1,
  share_url: "",
  isActive: false,
  publishedAt: null,
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

  /* 🔽 Default Section with one TEXT question 🔽 */
  sections: [
    {
      section_ID: uuidv4(),
      title: "Section 1",
      description: "",
      questions: [
        {
          question_ID: uuidv4(),
          order: 1,
          section_ID: uuidv4(),
          type: QuestionType.TEXT,   // "TEXT"
          questionText: "Question 1",
          isRequired: false,
          // leave config / image undefined → matches interface
        },
      ],
      logic: [],
    },
  ],
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
  } catch (err) {
    console.error("❌ Error creating form:", err);
    return null;
  }
  finally {
    if (dbClient) {
      await disconnectFromDB(dbClient);
    }
  }
  redirect(`/form/${form_ID}`);
}
