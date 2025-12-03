import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/admin-auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required", success: false },
        { status: 400 },
      );
    }

    const success = await setAdminSession(email);

    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: "This email is not authorized for admin access", success: false },
        { status: 401 },
      );
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed", success: false },
      { status: 500 },
    );
  }
}

