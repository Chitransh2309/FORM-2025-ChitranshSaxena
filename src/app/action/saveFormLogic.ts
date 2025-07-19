// /app/action/saveFormLogic.ts
"use server";
import { connectToDB, disconnectFromDB } from "@/lib/mongodb";
import { Section } from "@/lib/interface";
import { LogicRule } from "@/lib/interface";
export async function saveFormLogic(form_ID: string, logicRules: LogicRule[]) {
  try {
    const { db, dbClient } = await connectToDB();

    const form = await db.collection("forms").findOne({ form_ID });
    if (!form) {
      throw new Error("Form not found");
    }

    const updatedSections = form.sections.map((section: Section) => {
      const logicForThisSection = logicRules.filter(
        (rule: LogicRule) => rule.targetSectionId === section.section_ID
      );

      return {
        ...section,
        logic: logicForThisSection.length > 0 ? logicForThisSection : [],
      };
    });

    const result = await db
      .collection("forms")
      .updateOne({ form_ID }, { $set: { sections: updatedSections } });

    await disconnectFromDB(dbClient);
    return { success: true, modifiedCount: result.modifiedCount };
  } catch (error) {
    console.error("❌ Failed to save logic:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
