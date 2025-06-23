'use server';

import { connectToDB, disconnectFromDB } from '../../lib/mongodb';

export async function deleteQuestionFromDB(question_ID: string) {
  try {
    const { db, dbClient } = await connectToDB();
    const result = await db.collection("ques").deleteOne({ question_ID });

    await disconnectFromDB(dbClient);

    return {
      success: result.deletedCount === 1,
      message: result.deletedCount === 1 ? "Question deleted" : "Question not found",
    };
  } catch (error) {
    console.error("❌ Delete Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
