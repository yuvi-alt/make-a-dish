import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStepData, putStepData } from "@/lib/s3";
import type { EntityTypePayload } from "@/lib/schemas";
import type { EntityType } from "@/lib/steps";
import { REGISTRATION_COOKIE } from "@/lib/constants";
import type { StepFileKey } from "@/lib/steps";
import { sendAdminNotification, sendUserConfirmation } from "@/lib/email";

const detailSteps: Record<EntityType, StepFileKey> = {
  "sole-trader": "sole-trader",
  partnership: "partnership",
  "limited-company": "limited-company",
  organisation: "organisation",
};

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);

  if (
    !payload ||
    typeof payload.registrationId !== "string" ||
    !payload.registrationId
  ) {
    return NextResponse.json(
      { message: "registrationId is required" },
      { status: 400 },
    );
  }

  const [postcodeData, entityTypeData] = await Promise.all([
    getStepData<{ email: string; postcode: string; addressLine1: string; addressLine2?: string; city: string; county: string; country: string }>({
      registrationId: payload.registrationId,
      step: "postcode",
    }),
    getStepData<EntityTypePayload>({
      registrationId: payload.registrationId,
      step: "entity-type",
    }),
  ]);

  if (!postcodeData) {
    return NextResponse.json(
      { message: "Postcode step is missing" },
      { status: 400 },
    );
  }

  if (!postcodeData.email) {
    return NextResponse.json(
      { message: "Email address is required" },
      { status: 400 },
    );
  }

  if (!entityTypeData) {
    return NextResponse.json(
      { message: "Entity type step is missing" },
      { status: 400 },
    );
  }

  const detailStep = detailSteps[entityTypeData.entityType as EntityType];

  const detailData = detailStep
    ? await getStepData({
        registrationId: payload.registrationId,
        step: detailStep,
      })
    : null;

  if (!detailData) {
    return NextResponse.json(
      { message: "Business details are incomplete" },
      { status: 400 },
    );
  }

  const submittedAt = new Date().toISOString();
  
  const finalPayload = {
    registrationId: payload.registrationId,
    submittedAt,
    email: postcodeData.email,
    postcode: postcodeData.postcode,
    addressLine1: postcodeData.addressLine1,
    addressLine2: postcodeData.addressLine2,
    city: postcodeData.city,
    county: postcodeData.county,
    country: postcodeData.country,
    entityType: entityTypeData,
    detailStep,
    detailData,
  };

  await putStepData({
    registrationId: payload.registrationId,
    step: "final",
    data: finalPayload,
  });

  // Send emails - await to ensure they complete on serverless (Vercel)
  // Use Promise.allSettled to wait for both without failing if one fails
  try {
    await Promise.allSettled([
      sendAdminNotification({
        ...finalPayload,
        entityType: entityTypeData.entityType,
      }),
      sendUserConfirmation(postcodeData.email, {
        registrationId: payload.registrationId,
        postcode: postcodeData.postcode,
        addressLine1: postcodeData.addressLine1,
        addressLine2: postcodeData.addressLine2,
        city: postcodeData.city,
        county: postcodeData.county,
        country: postcodeData.country,
        entityType: entityTypeData.entityType,
        submittedAt,
        detailData,
      }),
    ]).then((results) => {
      // Log results for debugging
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          const emailType = index === 0 ? "admin" : "user";
          console.error(`❌ Failed to send ${emailType} email:`, result.reason);
          if (index === 0) {
            // Log configuration status for admin email failures
            console.error("Email config check:", {
              hasHost: !!process.env.EMAIL_HOST,
              hasUser: !!process.env.EMAIL_USER,
              hasPass: !!process.env.EMAIL_PASS,
              adminNotificationEmail: process.env.ADMIN_NOTIFICATION_EMAIL ? "Set" : "NOT SET",
              adminEmail: process.env.ADMIN_EMAIL ? "Set (fallback)" : "NOT SET",
            });
          }
        } else {
          const emailType = index === 0 ? "admin" : "user";
          console.log(`✅ ${emailType} email sent successfully`);
        }
      });
    });
  } catch (error) {
    // Catch any unexpected errors in the promise handling
    console.error("Unexpected error sending emails:", error);
    // Don't fail the request - emails are best effort
  }

  const cookieStore = await cookies();
  cookieStore.delete(REGISTRATION_COOKIE);

  return NextResponse.json({ ok: true, final: finalPayload });
}

