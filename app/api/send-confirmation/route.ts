import { NextResponse } from "next/server";
import { sendUserConfirmation } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email, registrationData } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 },
      );
    }

    if (!registrationData) {
      return NextResponse.json(
        { error: "Registration data is required" },
        { status: 400 },
      );
    }

    await sendUserConfirmation(email, registrationData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending user confirmation:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to send confirmation email",
      },
      { status: 500 },
    );
  }
}

