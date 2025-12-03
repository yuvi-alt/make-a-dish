import { cookies } from "next/headers";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

export async function isAdminAuthenticated(): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    return false; // No admin email set = no access
  }

  const cookieStore = await cookies();
  const adminEmail = cookieStore.get("admin_email")?.value;
  
  // Check if the stored email matches the admin email
  return adminEmail?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

export async function setAdminSession(email: string): Promise<boolean> {
  if (!ADMIN_EMAIL) {
    return false;
  }

  // Check if provided email matches admin email (case-insensitive)
  if (email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    const cookieStore = await cookies();
    cookieStore.set("admin_email", ADMIN_EMAIL.toLowerCase(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return true;
  }
  return false;
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_email");
}

