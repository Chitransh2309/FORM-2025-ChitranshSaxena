"use server";

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { auth } from "../../../auth";
import { User, Form } from "@/lib/interface";
import { ObjectId } from "mongodb";
import { MongoClient } from "mongodb";

export async function addEditor(form_ID: string, email_ID: string) {
  try {
    let client: MongoClient | null = null;
    const connection = await connectToDB();
    client = connection.client;
    const db = connection.db;

    // Get the Users and Forms collections
    const usersCollection = await db.collection("user");
    const formsCollection = await db.collection("forms");

    // Step 1: Find the user by email
    const user = await usersCollection.findOne({ email: email_ID });

    if (!user) {
      throw new Error(`User with email ${email_ID} not found.`);
    }
    console.log("!");
    const userID = user.user_ID;

    // Step 2: Find the form by form_ID
    const form = await formsCollection.findOne({ form_ID });

    if (!form) {
      throw new Error(`Form with ID ${form_ID} not found.`);
    }
    console.log("2");
    await formsCollection.updateOne(
      { form_ID },
      { $addToSet: { editorID: userID } } // addToSet prevents duplicates
    );

    await usersCollection.updateOne(
      { user_ID: userID },
      { $addToSet: { sharedForms: form_ID } }
    );

    return { success: true, message: "Editor added successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function addViewer(form_ID: string, email_ID: string) {
  try {
    let client: MongoClient | null = null;
    const connection = await connectToDB();
    client = connection.client;
    const db = connection.db;

    const usersCollection = await db.collection("user");
    const formsCollection = await db.collection("forms");

    const user = await usersCollection.findOne({ email: email_ID });

    if (!user) {
      throw new Error(`User with email ${email_ID} not found.`);
    }
    console.log("!");
    const userID = user.user_ID;

    const form = await formsCollection.findOne({ form_ID });

    if (!form) {
      throw new Error(`Form with ID ${form_ID} not found.`);
    }
    console.log("2");
    await formsCollection.updateOne(
      { form_ID },
      { $addToSet: { viewerID: userID } }
    );

    await usersCollection.updateOne(
      { user_ID: userID },
      { $addToSet: { sharedForms: form_ID } }
    );

    return { success: true, message: "Viewer added successfully." };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
