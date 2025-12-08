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
  try {
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

    try {
      await putStepData({
        registrationId: payload.registrationId,
        step,
        data: payload.data ?? {},
      });
    } catch (error) {
      console.error("Error saving step data:", error);
      
      // Check if it's an AWS/S3 error
      if (error && typeof error === "object" && "name" in error) {
        const errorName = (error as { name?: string }).name;
        
        if (errorName === "CredentialsProviderError" || errorName === "InvalidAccessKeyId") {
          return NextResponse.json(
            { 
              message: "AWS credentials are missing or invalid. Please configure AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in your environment variables."
            },
            { status: 500 },
          );
        }
        
        if (errorName === "NoSuchBucket" || (error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 404) {
          return NextResponse.json(
            { 
              message: "S3 bucket not found. Please check that AWS_S3_BUCKET is set correctly and the bucket exists."
            },
            { status: 500 },
          );
        }
        
        if ((error as { $metadata?: { httpStatusCode?: number } }).$metadata?.httpStatusCode === 403) {
          return NextResponse.json(
            { 
              message: "Access denied to S3 bucket. Please check your AWS credentials have permission to write to the bucket."
            },
            { status: 500 },
          );
        }
      }
      
      // Check if it's a filesystem error (local storage on Vercel)
      if (error && typeof error === "object" && "code" in error) {
        const errorCode = (error as { code?: string }).code;
        if (errorCode === "EACCES" || errorCode === "EROFS") {
          return NextResponse.json(
            { 
              message: "Cannot write to local storage. On Vercel, you must configure AWS S3. Please set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET environment variables."
            },
            { status: 500 },
          );
        }
      }
      
      // Generic error
      const errorMessage = error instanceof Error ? error.message : String(error);
      return NextResponse.json(
        { 
          message: `Unable to save address: ${errorMessage}. Please check your storage configuration.`
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Unexpected error in step route:", error);
    return NextResponse.json(
      { message: "An unexpected error occurred. Please try again." },
      { status: 500 },
    );
  }
}

