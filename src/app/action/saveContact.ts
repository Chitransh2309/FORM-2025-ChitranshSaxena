"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { randomUUID } from "crypto";

export interface Contact {
  contact_ID: string;
  user_ID: string;
  createdAt: Date;
  name: string;
  email: string;
  message: string;
}

export async function saveContact(
  user_ID: string,
  name: string,
  email: string,
  message: string
): Promise<{ success: boolean; message: string }> {
  const client: MongoClient | null = null;

  try {
    const connection = await connectToDB();
    const db = connection.db;

    const contact: Contact = {
      contact_ID: randomUUID(),
      user_ID,
      createdAt: new Date(),
      name,
      email,
      message,
    };

    const contactsCollection = db.collection("contacts");
    await contactsCollection.insertOne(contact);

    return { success: true, message: "Contact saved successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  } finally {
    if (client) await disconnectFromDB(client);
  }
}
