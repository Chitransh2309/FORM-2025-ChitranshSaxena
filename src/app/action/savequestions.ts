'use server';

import { connectToDB, disconnectFromDB } from '../../lib/mongodb';

interface Question {
  question_ID: string;
  order: number;
  section_ID: string;
  type: string;
  questionText: string;
  isRequired: boolean;
}

export async function saveQuestionsToDB(questions: Question[]) {
  try {
    const { db, dbClient } = await connectToDB();
    const collection = db.collection("ques");

    const operations = questions.map(async (question) => {
      const existing = await collection.findOne({ question_ID: question.question_ID });

      if (existing) {
        // If question exists, update it
        return await collection.updateOne(
          { question_ID: question.question_ID },
          { $set: question }
        );
      } else {
        // If question doesn't exist, insert it
        return await collection.insertOne(question);
      }
    });

    await Promise.all(operations);
    await disconnectFromDB(dbClient);

    return {
      success: true,
      message: "Questions processed successfully",
    };
  } catch (error) {
    console.error("❌ DB Save Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
