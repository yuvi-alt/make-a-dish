import { NextResponse } from "next/server";
import { sendAdminNotification } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const registrationData = await request.json();

    await sendAdminNotification(registrationData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending admin notification:", error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : "Failed to send admin notification",
      },
      { status: 500 },
    );
  }
}

