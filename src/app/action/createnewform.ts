"use server";

import { v4 as uuidv4 } from "uuid";
import { createFormIfNotExists } from "./forms";

export async function createNewForm(): Promise<string | null> {
  const form_ID = uuidv4();
  const res = await createFormIfNotExists(form_ID);
  return res.success ? form_ID : null;
}
