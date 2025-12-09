import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REGISTRATION_COOKIE } from "@/lib/constants";

const cookieSettings = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24,
};

export async function GET(request: Request) {
  const cookieStore = await cookies();
  
  // Clear any existing registration cookie to ensure fresh start
  cookieStore.delete(REGISTRATION_COOKIE);
  
  // Create a new registration ID
  const newId = randomUUID();
  cookieStore.set(REGISTRATION_COOKIE, newId, cookieSettings);

  const url = new URL(request.url);
  url.pathname = "/register/start";
  url.search = "";

  return NextResponse.redirect(url);
}

