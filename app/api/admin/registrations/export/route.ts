import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getAllRegistrations } from "@/lib/s3";

function convertToCSV(registrations: Array<Record<string, unknown>>): string {
  if (registrations.length === 0) {
    return "No registrations found";
  }

  // Extract headers from first registration
  const headers = [
    "Registration ID",
    "Email",
    "Postcode",
    "Business Type",
    "Submitted Date",
  ];

  // Create CSV rows
  const rows = registrations.map((reg: any) => {
    const postcode = typeof reg.postcode === "string" ? reg.postcode : "";
    const email = typeof reg.email === "string" ? reg.email : "";
    const entityType = reg.entityType?.entityType || reg.entityType || "";
    const submittedAt = reg.submittedAt
      ? new Date(reg.submittedAt).toLocaleString()
      : "";

    return [
      reg.registrationId || "",
      email,
      postcode,
      entityType,
      submittedAt,
    ];
  });

  // Escape CSV values
  const escapeCSV = (value: string) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n")) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  };

  // Build CSV string
  const csvLines = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) => row.map(escapeCSV).join(",")),
  ];

  return csvLines.join("\n");
}

export async function GET(request: Request) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    const registrations = await getAllRegistrations();
    const csv = convertToCSV(registrations);

    const filename = `registrations-${new Date().toISOString().split("T")[0]}.csv`;

    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("Error exporting registrations:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to export registrations",
        success: false,
      },
      { status: 500 },
    );
  }
}

