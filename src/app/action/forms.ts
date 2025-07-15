"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { Form, FormSettings } from "@/lib/interface";

// Define types for better type safety
type UserFormReference = string | { form_ID: string };
type MongoQuery = {
  form_ID: { $in: string[] };
  createdBy: string;
  isDeleted?: { $ne: boolean };
};

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
        publishedAt: new Date(),
        isActive: false,
        share_url: "",
        isStarred: false
      };

      await collection.insertOne(newForm);
    }

    await disconnectFromDB(dbClient);
    return { success: true };
  } catch (error) {
    console.error("❌ Create Form Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getFormsForUser(includeDeleted = false) {
  let dbClient: Awaited<ReturnType<typeof connectToDB>>["dbClient"] | null =
    null;

  try {
    const { db, dbClient: client } = await connectToDB();
    dbClient = client;

    /* ── 1. who’s logged in? ────────────────────────────────────────── */
    const session = await auth();
    const email = session?.user?.email;
    if (!email) return [];

    /* ── 2. look up the user doc (stores form refs) ─────────────────── */
    const userDoc = await db.collection("user").findOne({ email });
    if (!userDoc?.user_ID || !Array.isArray(userDoc.forms)) return [];

    const userID = userDoc.user_ID;
    const formIDs = userDoc.forms.map((f: UserFormReference) =>
      typeof f === "string" ? f : f.form_ID,
    );
    if (formIDs.length === 0) return [];

    /* ── 3. build query ─────────────────────────────────────────────── */
    const query: MongoQuery = { form_ID: { $in: formIDs }, createdBy: userID };
    if (!includeDeleted) query.isDeleted = { $ne: true };

    /* ── 4. aggregate + count responses in one round trip ───────────── */
    const raw = await db
      .collection("forms")
      .aggregate([
        { $match: query },
        {
          $lookup: {
            from: "responses",
            localField: "form_ID",
            foreignField: "form_ID",
            pipeline: [{ $count: "n" }],
            as: "resp",
          },
        },
        {
          $addFields: {
            responseCount: { $ifNull: [{ $arrayElemAt: ["$resp.n", 0] }, 0] },
          },
        },
        { $project: { resp: 0 } }, // drop helper array
      ])
      .toArray();

    /* ── 5. normalise for the client (no ObjectId, no Date) ─────────── */
    const forms = raw.map((f) => ({
      ...f,
      _id:        String(f._id),                 // ObjectId → string
      createdAt:  f.createdAt?.toISOString?.() ?? null,
      updatedAt:  f.updatedAt?.toISOString?.() ?? null,
      // add more field conversions if you store nested ObjectIds / Dates
    }));

    return forms;
  } catch (err) {
    console.error("❌ getFormsForUser error:", err);
    return [];
  } finally {
    if (dbClient) await disconnectFromDB(dbClient);
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

    console.log("🗑 Attempting to delete form:", form_ID);

    const result = await db.collection("forms").updateOne(
      { form_ID },
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

// ✅ Toggle starred form
export async function toggleStarForm(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const form = await db.collection("forms").findOne({ form_ID });

    if (!form) throw new Error("Form not found");

    const newStarStatus = !form.isStarred;
    console.log("⭐ Toggling star status for form:", form_ID, "to", newStarStatus);
    await db.collection("forms").updateOne(
      { form_ID },
      { $set: { isStarred: newStarStatus } }
    );

    await disconnectFromDB(dbClient);
    return { success: true, isStarred: newStarStatus };
  } catch (error) {
    console.error("❌ toggleStarForm Error:", error);
    return { success: false };
  }
}

// ✅ Restore form from trash
export async function restoreForm(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const result = await db.collection("forms").updateOne(
      { form_ID },
      { $set: { isDeleted: false } }
    );
    await disconnectFromDB(dbClient);
    return {
      success: result.modifiedCount === 1,
      message: "Form restored successfully",
    };
  } catch (error) {
    console.error("❌ restoreForm Error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to restore form" 
    };
  }
}

// ✅ Permanently delete form
export async function permanentlyDeleteForm(form_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const result = await db.collection("forms").deleteOne({ form_ID });
    await disconnectFromDB(dbClient);
    return {
      success: result.deletedCount === 1,
      message: "Form permanently deleted",
    };
  } catch (error) {
    console.error("❌ permanentlyDeleteForm Error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to delete form" 
    };
  }
}
