"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { Form, FormSettings } from "@/lib/interface";

// Ensures a form exists by form_ID
export async function createFormIfNotExists(form_ID: string, name?: string) {
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

    const collection = db.collection("forms");

    const existing = await collection.findOne({ form_ID });
    if (!existing) {
      const newForm: Form = {
        form_ID,
        title: name || "Untitled Form",
        description: "",
        createdAt: new Date(),
        createdBy: userID,
        version: 1.0,
        sections: [],
      };

      await collection.insertOne(newForm);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (err) {
    console.error("❌ Create Form Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// ✅ Fetch all forms created by the logged-in user
export async function getFormsForUser() {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    if (!session?.user?.email) {
      await disconnectFromDB(dbClient);
      return [];
    }

    // Step 1: Fetch user
    const userDoc = await db
      .collection("user")
      .findOne({ email: session.user.email });

    if (!userDoc || !userDoc.user_ID || !Array.isArray(userDoc.forms)) {
      await disconnectFromDB(dbClient);
      return [];
    }

    const userID = userDoc.user_ID;
    const formIDs = userDoc.forms.map((form: any) =>
      typeof form === "string" ? form : form.form_ID
    );

    if (formIDs.length === 0) {
      await disconnectFromDB(dbClient);
      return [];
    }

    // Step 2: Fetch forms by ID from 'forms' collection
    const forms = await db
      .collection("forms")
      .find({
        form_ID: { $in: formIDs },
        createdBy: userID,
      })
      .toArray();

    await disconnectFromDB(dbClient);

    // Step 3: Normalize and return
    const plainForms = forms.map((form) => ({
      form_ID: form.form_ID,
      title: form.title || "Untitled",
      description: form.description || "",
      createdAt: form.createdAt?.toString() || null,
      publishedAt: form.publishedAt?.toString() || null,
      isActive: form.isActive || false,
    }));

    return plainForms;
  } catch (error) {
    console.error("❌ getFormsForUser error:", error);
    return [];
  }
}

export async function updateFormSettings(
  formId: string,
  settings: FormSettings
) {
  console.log("Updating form settings for formId:", formId);
  const { db, dbClient } = await connectToDB();

  try {
    // Step 1: Find the existing form
    console.log("Fetching existing form with ID:", formId);
    const existingForm = await db
      .collection("forms")
      .findOne({ form_ID: formId });

    if (!existingForm) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    // Step 2: Add or update the settings field
    const updatedForm = {
      ...existingForm,
      settings, // overwrite or add the settings field
    };

    // Step 3: Update the entire document
    await db.collection("forms").replaceOne({ form_ID: formId }, updatedForm);

    return {
      data: updatedForm,
    };
  } finally {
    await disconnectFromDB(dbClient);
  }
}
