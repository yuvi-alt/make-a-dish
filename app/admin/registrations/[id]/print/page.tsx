import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getStepData, loadAllSteps } from "@/lib/s3";
import { PrintButton } from "./print-button";

export default async function PrintRegistrationPage({
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
      <div className="mx-auto w-full max-w-4xl px-4 py-12">
        <h1 className="text-2xl font-semibold">Registration Not Found</h1>
        <p className="mt-4">The registration doesn&apos;t exist.</p>
      </div>
    );
  }

  const addressParts = [
    finalData.addressLine1,
    finalData.addressLine2,
    finalData.city,
    finalData.county,
    finalData.country,
    finalData.postcode,
  ].filter(Boolean);

  const detailItems: Array<{ label: string; value: string }> = [];

  if (finalData.detailData && typeof finalData.detailData === "object") {
    Object.entries(finalData.detailData as Record<string, unknown>).forEach(
      ([key, value]) => {
        if (value !== null && value !== undefined) {
          let displayValue: string;
          if (typeof value === "object" && !Array.isArray(value)) {
            displayValue = JSON.stringify(value, null, 2);
          } else if (Array.isArray(value)) {
            displayValue = value
              .map((v) =>
                typeof v === "object" ? JSON.stringify(v) : String(v),
              )
              .join(", ");
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
      },
    );
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
        }
      `}</style>
      <div className="mx-auto w-full max-w-4xl px-8 py-12 print:p-0">
        <div className="no-print mb-4">
          <PrintButton />
        </div>
        <div className="bg-white p-8">
          <h1 className="mb-8 text-3xl font-bold">Registration Details</h1>

          <div className="mb-6 space-y-4">
            <div>
              <h2 className="mb-2 text-lg font-semibold">Registration ID</h2>
              <p className="font-mono">{finalData.registrationId}</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">
                Contact Information
              </h2>
              <p>Email: {finalData.email || "Not provided"}</p>
              <p>
                Submitted:{" "}
                {finalData.submittedAt
                  ? new Date(finalData.submittedAt).toLocaleString()
                  : "Not available"}
              </p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Address</h2>
              <p className="whitespace-pre-line">{addressParts.join("\n")}</p>
            </div>

            <div>
              <h2 className="mb-2 text-lg font-semibold">Legal Entity</h2>
              <p>{finalData.entityType?.entityType || "Not provided"}</p>
            </div>

            {detailItems.length > 0 && (
              <div>
                <h2 className="mb-2 text-lg font-semibold">Business Details</h2>
                <dl className="space-y-2">
                  {detailItems.map((item) => (
                    <div key={item.label} className="flex gap-4">
                      <dt className="font-semibold">{item.label}:</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
