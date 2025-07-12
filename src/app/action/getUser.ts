"use server";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";

export async function getUser() {
  const { db, dbClient } = await connectToDB();
  const session = await auth();

  if (session && session.user) {
    const { name, email, image } = session.user;

    if (email && name && image) {
      // Fetch full user document from DB to access sharedForms
      const userDoc = await db.collection("user").findOne({ email });

      await disconnectFromDB(dbClient);

      return {
        email,
        name,
        image,
        sharedForms: userDoc?.sharedForms || [], // Add sharedForms here
      };
    }
  }

  await disconnectFromDB(dbClient);
  return null;
}
