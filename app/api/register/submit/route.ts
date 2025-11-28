import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getStepData, putStepData } from "@/lib/s3";
import type { EntityTypePayload } from "@/lib/schemas";
import type { EntityType } from "@/lib/steps";
import { REGISTRATION_COOKIE } from "@/lib/constants";
import type { StepFileKey } from "@/lib/steps";

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

  const [postcode, entityTypeData] = await Promise.all([
    getStepData<{ postcode: string }>({
      registrationId: payload.registrationId,
      step: "postcode",
    }),
    getStepData<EntityTypePayload>({
      registrationId: payload.registrationId,
      step: "entity-type",
    }),
  ]);

  if (!postcode) {
    return NextResponse.json(
      { message: "Postcode step is missing" },
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

  const finalPayload = {
    registrationId: payload.registrationId,
    submittedAt: new Date().toISOString(),
    postcode,
    entityType: entityTypeData,
    detailStep,
    detailData,
  };

  await putStepData({
    registrationId: payload.registrationId,
    step: "final",
    data: finalPayload,
  });

  const cookieStore = await cookies();
  cookieStore.delete(REGISTRATION_COOKIE);

  return NextResponse.json({ ok: true, final: finalPayload });
}

