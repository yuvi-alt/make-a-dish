import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REGISTRATION_COOKIE } from "@/lib/constants";

// Force dynamic rendering to prevent route caching
export const dynamic = "force-dynamic";

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

  const response = NextResponse.redirect(url);
  
  // Add cache control headers to prevent caching of redirect
  response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  
  return response;
}

