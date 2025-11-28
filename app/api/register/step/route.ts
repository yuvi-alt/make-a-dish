import { NextResponse } from "next/server";
import { putStepData } from "@/lib/s3";
import type { StepFileKey } from "@/lib/steps";

const ALLOWED_STEPS: StepFileKey[] = [
  "postcode",
  "entity-type",
  "sole-trader",
  "partnership",
  "limited-company",
  "organisation",
];

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

  if (
    typeof payload.step !== "string" ||
    !ALLOWED_STEPS.includes(payload.step as StepFileKey)
  ) {
    return NextResponse.json(
      { message: "step is not supported" },
      { status: 400 },
    );
  }

  const step = payload.step as StepFileKey;

  await putStepData({
    registrationId: payload.registrationId,
    step,
    data: payload.data ?? {},
  });

  return NextResponse.json({ ok: true });
}

