// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { saveContact } from "@/app/action/saveContact";

export async function POST(req: NextRequest) {
  try {
    const { user_ID, name, email, message } = await req.json();

    if (!user_ID || !name || !email || !message) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    const result = await saveContact(user_ID, name, email, message);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error("Error in /api/contact:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
