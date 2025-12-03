import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { deleteRegistration } from "@/lib/s3";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  try {
    const { id } = await params;

    if (!id || typeof id !== "string") {
      return NextResponse.json(
        { error: "Registration ID is required", success: false },
        { status: 400 },
      );
    }

    await deleteRegistration(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting registration:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to delete registration",
        success: false,
      },
      { status: 500 },
    );
  }
}

