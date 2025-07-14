"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { Form, FormResponse } from "@/lib/interface";

/** Form coming from the client may already have a Mongo _id */
type FormWithId = Form & { _id?: string };

export async function saveFormToDB(form: FormWithId) {
  try {
    const { db, dbClient }    = await connectToDB();
    const collection          = db.collection<Form>("forms");

    /* strip _id so it isn’t re-inserted/updated */
   const { _id, ...safeForm } = form;
void _id;  

    const existing = await collection.findOne({ form_ID: form.form_ID });

    if (existing) {
      await collection.updateOne(
        { form_ID: form.form_ID },
        { $set: safeForm }
      );
    } else {
      await collection.insertOne(safeForm);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (error) {
    console.error("❌ Save Form Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function saveFormResponse(
  response: FormResponse & { _id?: string }
): Promise<boolean> {
  try {
    const { db, dbClient } = await connectToDB();
    const collection       = db.collection<FormResponse>("response");

    /* strip _id before upsert */
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...responseToSave } = response;
void _id; 

    const result = await collection.updateOne(
      { form_ID: response.form_ID, userId: response.userId },
      {
        $set: {
          ...responseToSave,
          submittedAt: new Date(),
        },
      },
      { upsert: true }
    );

    if (!result.acknowledged) {
      throw new Error("Database operation was not acknowledged");
    }

    await disconnectFromDB(dbClient);
    return true;
  } catch (error) {
    console.error("❌ Error saving form response:", error);
    return false;
  }
}
