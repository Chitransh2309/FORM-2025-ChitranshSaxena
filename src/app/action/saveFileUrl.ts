"use server";

/* -------------------------------------------------------------------------- *
 * app/action/pushFileAnswer.ts – save / update a file-upload answer
 * -------------------------------------------------------------------------- */

import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { v4 as uuidv4 } from "uuid";
import { auth } from "../../../auth"; // ← adjust relative path if needed
import { FormResponse } from "@/lib/interface";

export async function pushFileAnswer(opts: {
  formId: string;
  questionId: string;
  url: string;
}) {
  const { formId, questionId, url } = opts;

  const { db, dbClient } = await connectToDB();

  try {
    let userId = "anonymous";

    const session = await auth();
    if (session?.user?.email) {
      const userDoc = await db
        .collection<{ user_ID: string }>("user")
        .findOne({ email: session.user.email });

      if (userDoc?.user_ID) userId = userDoc.user_ID;
    }

    const responses = db.collection<FormResponse>("response");

    // Step 1: Ensure draft response exists
    await responses.updateOne(
      { form_ID: formId, userId },
      {
        $setOnInsert: {
          response_ID: uuidv4(),
          form_ID: formId,
          userId,
          startedAt: new Date(),
          version: 1,
          status: "draft", // Ensure status is set to draft
          answers: [],
        },
      },
      { upsert: true }
    );

    // Step 2: Try to overwrite existing answer if it exists
    const overwrite = await responses.updateOne(
      {
        form_ID: formId,
        userId,
        "answers.question_ID": questionId,
      },
      {
        $set: {
          "answers.$.value": url,
          "answers.$.updatedAt": new Date(),
        },
      }
    );

    // Step 3: If no existing answer, push new answer
    if (overwrite.modifiedCount === 0) {
      await responses.updateOne(
        { form_ID: formId, userId },
        {
          $push: {
            answers: {
                answer_ID: uuidv4(),
                question_ID: questionId,
                value: url,
                updatedAt: new Date(),
            },
          },
        }
      );
    }

    // Step 4: Fetch the final updated response
    const updatedResponse = await responses.findOne({
      form_ID: formId,
      userId,
    });

    console.log("✅ File answer saved successfully:", {
      uploadedUrl: url,
      response: updatedResponse?.answers.find(
        (ans) => ans.question_ID === questionId
        ),
    });

    return { ok: true };
  } catch (err) {
    console.error("❌ pushFileAnswer error:", err);
    return { ok: false, error: "internal_server_error" };
  } finally {
    await disconnectFromDB(dbClient);
  }
}
