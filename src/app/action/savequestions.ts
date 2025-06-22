// app/action/savequestions.ts
'use server'

import { connectToDB, disconnectFromDB } from '@/lib/mongoDB';

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
    
    const result = await db.collection("ques").insertMany(questions);

    await disconnectFromDB(dbClient);

    return {
      success: true,
      insertedCount: result.insertedCount,
    };
  } catch (error) {
    console.error("❌ DB Save Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
