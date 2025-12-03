import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllRegistrations } from "@/lib/s3";
import { AdminRegistrationsClient } from "./client-page";

export default async function AdminRegistrationsPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const registrations = await getAllRegistrations();

  return <AdminRegistrationsClient registrations={registrations} />;
}

