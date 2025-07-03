"use server"
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";

export async function getUser(){
  const { db, dbClient } = await connectToDB();
  const session = await auth();
  if (session && session.user) {
    const { name, email,image} = session.user;
    if(email&&name&&image)
      {
        await disconnectFromDB(dbClient);
        return {
        email: email,
        name: name,
        image: image,
      }
      }
  }
  await disconnectFromDB(dbClient);
}