import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { REGISTRATION_COOKIE } from "./constants";

export async function ensureRegistrationId() {
  const cookieStore = await cookies();
  const existing = cookieStore.get(REGISTRATION_COOKIE)?.value;
  if (existing) {
    return existing;
  }

  redirect("/register/start/init");
}

export async function requireRegistrationId() {
  const cookieStore = await cookies();
  const registrationId = cookieStore.get(REGISTRATION_COOKIE)?.value;

  if (!registrationId) {
    redirect("/register/start");
  }

  return registrationId;
}

