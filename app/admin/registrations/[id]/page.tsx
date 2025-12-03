import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStepData, loadAllSteps } from "@/lib/s3";
import { ReviewCard } from "@/components/review-card";
import { DeleteRegistrationButton } from "./delete-button";

export default async function AdminRegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  const allSteps = await loadAllSteps(id);
  const finalData = await getStepData<{
    registrationId: string;
    email?: string;
    postcode?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    county?: string;
    country?: string;
    entityType?: { entityType: string };
    detailData?: unknown;
    submittedAt?: string;
  }>({
    registrationId: id,
    step: "final",
  });

  if (!finalData) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
          <h1 className="text-3xl font-semibold text-brand-charcoal">Registration Not Found</h1>
          <p className="mt-4 text-lg text-brand-charcoal/70">
            The registration you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/admin/registrations"
            className="mt-6 inline-block text-brand-tangerine underline underline-offset-4"
          >
            ← Back to all registrations
          </Link>
        </div>
      </div>
    );
  }

  const addressItems = [
    { label: "Address Line 1", value: finalData.addressLine1 },
    { label: "Address Line 2", value: finalData.addressLine2 },
    { label: "City", value: finalData.city },
    { label: "County", value: finalData.county },
    { label: "Country", value: finalData.country },
    { label: "Postcode", value: finalData.postcode },
  ].filter((item) => item.value);

  const detailItems: Array<{ label: string; value: string | null }> = [];
  
  if (finalData.detailData && typeof finalData.detailData === "object") {
    Object.entries(finalData.detailData as Record<string, unknown>).forEach(([key, value]) => {
      if (value !== null && value !== undefined) {
        let displayValue: string;
        if (typeof value === "object" && !Array.isArray(value)) {
          displayValue = JSON.stringify(value, null, 2);
        } else if (Array.isArray(value)) {
          displayValue = value.map((v) => (typeof v === "object" ? JSON.stringify(v) : String(v))).join(", ");
        } else {
          displayValue = String(value);
        }
        detailItems.push({
          label: key
            .replace(/([A-Z])/g, " $1")
            .replace(/^./, (str) => str.toUpperCase())
            .trim(),
          value: displayValue,
        });
      }
    });
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/registrations"
            className="text-brand-tangerine underline underline-offset-4"
          >
            ← Back to all registrations
          </Link>
          <Link
            href="/admin/logout"
            className="text-sm font-semibold text-brand-tangerine underline underline-offset-4"
          >
            Logout
          </Link>
        </div>

        <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
          <h1 className="mb-8 text-3xl font-semibold text-brand-charcoal">
            Registration Details
          </h1>
          <p className="mb-6 text-sm text-brand-charcoal/70">
            Registration ID: {finalData.registrationId}
          </p>

          <div className="space-y-6">
            <ReviewCard
              title="Contact Information"
              items={[
                { label: "Email", value: finalData.email || null },
                { label: "Submitted", value: finalData.submittedAt ? new Date(finalData.submittedAt).toLocaleString() : null },
              ]}
            />

            <ReviewCard
              title="Address"
              items={addressItems}
            />

            <ReviewCard
              title="Legal Entity"
              items={[
                { label: "Entity Type", value: finalData.entityType?.entityType || null },
              ]}
            />

            {detailItems.length > 0 && (
              <ReviewCard
                title="Business Details"
                items={detailItems}
              />
            )}

            <div className="glass-surface rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft">
              <h3 className="mb-4 text-xl font-semibold text-brand-charcoal">Raw Data</h3>
              <pre className="overflow-auto rounded-lg bg-brand-cream/30 p-4 text-xs">
                {JSON.stringify(allSteps, null, 2)}
              </pre>
            </div>
          </div>

          <div className="mt-8 border-t border-brand-charcoal/10 pt-6">
            <DeleteRegistrationButton registrationId={id} />
          </div>
        </div>
      </div>
    </div>
  );
}

