"use server";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { nanoid } from "nanoid";

export async function insertUser() {
  const { db, dbClient } = await connectToDB();
  const session = await auth();
  if (session && session.user) {
    const { name, email, id, image } = session.user;
    const existingUser = await db.collection("user").findOne({ email });
    if (!existingUser) {
      await db.collection("user").insertOne({
        user_ID: nanoid(),
        email: email,
        googleID: id,
        name: name,
        image: image,
        forms: [],
      });
    }
  }
  await disconnectFromDB(dbClient);
}
