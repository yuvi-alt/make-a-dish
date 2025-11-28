import { NextResponse } from "next/server";
import { getStepData } from "@/lib/s3";
import type { StepFileKey } from "@/lib/steps";

const LOADABLE_STEPS: StepFileKey[] = [
  "postcode",
  "entity-type",
  "sole-trader",
  "partnership",
  "limited-company",
  "organisation",
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const registrationId = searchParams.get("registrationId");
  const step = searchParams.get("step");

  if (
    !registrationId ||
    !step ||
    !LOADABLE_STEPS.includes(step as StepFileKey)
  ) {
    return NextResponse.json(
      { message: "registrationId and valid step are required" },
      { status: 400 },
    );
  }

  const typedStep = step as StepFileKey;

  const data = await getStepData({
    registrationId,
    step: typedStep,
  });

  return NextResponse.json({ data });
}

