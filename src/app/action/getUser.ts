"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";

export async function getUser() {
  const { db, dbClient } = await connectToDB();
  const session = await auth();

  if (session && session.user) {
    const { name, email, image } = session.user;

    if (email && name && image) {
      // Fetch full user document from DB to access user_ID
      const userDoc = await db.collection("user").findOne({ email });

      await disconnectFromDB(dbClient);

      if (userDoc) {
        return {
          email,
          name,
          image,
          user_ID: userDoc.user_ID || null,
          sharedForms: userDoc.sharedForms || [],
        };
      }
    }
  }

  await disconnectFromDB(dbClient);
  return null;
}
