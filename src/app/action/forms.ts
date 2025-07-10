"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { Form, FormSettings } from "@/lib/interface";

// ✅ Create form if it doesn't exist
export async function createFormIfNotExists(form_ID: string, name?: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    let userID = "anonymous";

    if (session?.user?.email) {
      const userDoc = await db
        .collection("user")
        .findOne({ email: session.user.email });
      if (userDoc?.user_ID) {
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
        settings: {
          startDate: new Date(),
          endDate: new Date(),
          copy_via_email: false,
          cameraRequired: false,
          tab_switch_count: false,
          autoSubmit: false,
          maxResponses: 0,
          timer: 0,
        },
        isDeleted: false,
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

// ✅ Get all forms for the user
export async function getFormsForUser() {
  try {
    const { db, dbClient } = await connectToDB();
    const session = await auth();

    if (!session?.user?.email) {
      await disconnectFromDB(dbClient);
      return [];
    }

    const userDoc = await db
      .collection("user")
      .findOne({ email: session.user.email });

    if (!userDoc?.user_ID || !Array.isArray(userDoc.forms)) {
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

    const forms = await db
      .collection("forms")
      .find({
        form_ID: { $in: formIDs },
        createdBy: userID,
        isDeleted: { $ne: true }, // 🔥 Exclude deleted forms
      })
      .toArray();

    await disconnectFromDB(dbClient);

    return forms.map((form) => ({
      form_ID: form.form_ID,
      title: form.title || "Untitled",
      description: form.description || "",
      createdAt: form.createdAt?.toString() || null,
      publishedAt: form.publishedAt?.toString() || null,
      isActive: form.isActive || false,
    }));
  } catch (error) {
    console.error("❌ getFormsForUser error:", error);
    return [];
  }
}

// ✅ Update form settings
export async function updateFormSettings(
  formId: string,
  settings: FormSettings
) {
  const { db, dbClient } = await connectToDB();

  try {
    const existingForm = await db
      .collection("forms")
      .findOne({ form_ID: formId });

    if (!existingForm) {
      throw new Error(`Form with ID ${formId} not found`);
    }

    const updatedForm = {
      ...existingForm,
      settings,
    };

    await db.collection("forms").replaceOne({ form_ID: formId }, updatedForm);

    return {
      data: updatedForm,
    };
  } finally {
    await disconnectFromDB(dbClient);
  }
}

// ✅ Soft delete form by setting isDeleted: true
export async function deleteFormFromDB(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();

    console.log("🗑️ Attempting to delete form:", form_ID);

    const result = await db.collection("forms").updateOne(
      { form_ID }, // Match on form_ID field
      { $set: { isDeleted: true } }
    );

    console.log("🔍 MongoDB Update Result:", result);

    await disconnectFromDB(dbClient);

    return {
      success: result.modifiedCount === 1,
      message:
        result.modifiedCount === 1 ? "Form marked as deleted" : "Form not found",
    };
  } catch (error) {
    console.error("❌ Delete Form Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
