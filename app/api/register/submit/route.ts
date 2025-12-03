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

  // Send emails asynchronously (don't block response)
  Promise.all([
    sendAdminNotification({
      ...finalPayload,
      entityType: entityTypeData.entityType,
    }).catch((err) => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Failed to send admin notification:", errorMessage);
      console.error("Error details:", err);
      // Log configuration status
      console.error("Email config check:", {
        hasHost: !!process.env.EMAIL_HOST,
        hasUser: !!process.env.EMAIL_USER,
        hasPass: !!process.env.EMAIL_PASS,
        adminEmail: process.env.ADMIN_EMAIL ? "Set" : "NOT SET",
      });
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
    }).catch((err) => {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error("❌ Failed to send user confirmation:", errorMessage);
      console.error("Error details:", err);
    }),
  ]).catch(() => {
    // Silent fail - emails are best effort
  });

  const cookieStore = await cookies();
  cookieStore.delete(REGISTRATION_COOKIE);

  return NextResponse.json({ ok: true, final: finalPayload });
}

