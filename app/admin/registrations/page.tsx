import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllRegistrations } from "@/lib/s3";
import { AdminRegistrationsClient } from "./client-page";

export default async function AdminRegistrationsPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const adminToken = process.env.ADMIN_DASHBOARD_TOKEN;
  
  // Check token-based access first (if token is provided)
  if (adminToken && params.token) {
    if (params.token !== adminToken) {
      return (
        <div className="mx-auto max-w-2xl px-6 py-24 text-center">
          <h1 className="text-2xl font-semibold text-brand-charcoal mb-4">Not Authorized</h1>
          <p className="text-brand-charcoal/70">Invalid token. Access denied.</p>
        </div>
      );
    }
    // Token is valid, proceed
  } else if (adminToken) {
    // Token is required but not provided
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold text-brand-charcoal mb-4">Access Required</h1>
        <p className="text-brand-charcoal/70">This page requires a valid token parameter. Add ?token=YOUR_TOKEN to the URL.</p>
      </div>
    );
  } else {
    // No token configured, fall back to email-based auth
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      redirect("/admin/login");
    }
  }

  const registrations = await getAllRegistrations();

  return <AdminRegistrationsClient registrations={registrations} />;
}

