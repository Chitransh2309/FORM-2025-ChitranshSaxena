"use server";

import { connectToDB, disconnectFromDB } from "../../lib/mongodb";
import { Question } from "../../lib/interface";

// Save or update an array of questions to the database
export async function saveQuestionsToDB(questions: Question[]) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("ques");

    const operations = questions.map(async (question) => {
      const existing = await collection.findOne({
        question_ID: question.question_ID,
      });

      if (existing) {
        return await collection.updateOne(
          { question_ID: question.question_ID },
          { $set: question }
        );
      } else {
        return await collection.insertOne(question);
      }
    });

    await Promise.all(operations);
    await disconnectFromDB(dbClient);

    return { success: true };
  } catch (err) {
    console.error("❌ Save Questions Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Delete a question from the database
export async function deleteQuestionFromDB(question_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const result = await db.collection("ques").deleteOne({ question_ID });

    await disconnectFromDB(dbClient);
    return { success: result.deletedCount === 1 };
  } catch (err) {
    console.error("❌ Delete Question Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

// Get all sections and their questions for a given form
export async function getSectionsAndQuestions(form_ID: string) {
  try {
    console.log("🔥 Fetching for form_ID:", form_ID);

    const { db, dbClient } = await connectToDB();

    const sections = await db
      .collection("sections")
      .find({ form_ID })
      .toArray();

    const questions = await db.collection("ques").find({ form_ID }).toArray();

    await disconnectFromDB(dbClient);

    const sectionsWithQuestions = sections.map((section) => ({
      section_ID: section.section_ID,
      form_ID: section.form_ID,
      title: section.title,
      description: section.description,
      questions: questions
        .filter((q) => q.section_ID === section.section_ID)
        .map((q) => ({
          id: parseInt(q.question_ID.replace("q-", "")), // extract number
          content: q.questionText,
          required: q.isRequired,
          label: "", // add label later if needed
        })),
    }));
    console.log("🧾 Sections found:", sections);

    return { success: true, data: sectionsWithQuestions };
  } catch (err) {
    console.error("❌ Fetch Error:", err);
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}
