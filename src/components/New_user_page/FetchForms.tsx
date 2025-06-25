// 📁 app/action/forms.ts
"use server";
import { auth } from "../../../auth";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";

export async function getFormsByCurrentUser() {
  try {
    const session = await auth();
    const userID = session?.user?.user_ID;

    if (!userID) throw new Error("User not logged in");

    const { db, dbClient } = await connectToDB();
    const forms = await db
      .collection("forms")
      .find({ createdBy: userID })
      .sort({ createdAt: -1 })
      .toArray();
    await disconnectFromDB(dbClient);

    return { success: true, data: forms };
  } catch (err) {
    console.error("❌ Error fetching user forms:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
