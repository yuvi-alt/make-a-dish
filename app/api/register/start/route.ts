import { randomUUID } from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { REGISTRATION_COOKIE } from "@/lib/constants";

export async function POST() {
  const id = randomUUID();
  const cookieStore = await cookies();
  cookieStore.set(REGISTRATION_COOKIE, id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ registrationId: id });
}

