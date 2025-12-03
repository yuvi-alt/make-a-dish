import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { sendAdminNotification } from "@/lib/email";

export async function POST() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      { error: "Unauthorized", success: false },
      { status: 401 },
    );
  }

  // Check email configuration
  const emailHost = process.env.EMAIL_HOST;
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  const adminEmail = process.env.ADMIN_EMAIL;

  const configStatus = {
    EMAIL_HOST: emailHost ? "✅ Set" : "❌ Missing",
    EMAIL_USER: emailUser ? "✅ Set" : "❌ Missing",
    EMAIL_PASS: emailPass ? "✅ Set" : "❌ Missing",
    ADMIN_EMAIL: adminEmail ? `✅ Set (${adminEmail})` : "❌ Missing",
    EMAIL_PORT: process.env.EMAIL_PORT || "587 (default)",
  };

  // Try to send a test email
  try {
    await sendAdminNotification({
      registrationId: "TEST-" + Date.now(),
      email: "test@example.com",
      postcode: "TEST123",
      addressLine1: "123 Test Street",
      city: "Test City",
      county: "Test County",
      country: "UK",
      entityType: "Test",
      detailData: { test: true },
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      message: "Test email sent successfully! Check your inbox.",
      config: configStatus,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
        config: configStatus,
        message: "Failed to send test email. Check the error and configuration above.",
      },
      { status: 500 },
    );
  }
}

