import {
  GetObjectCommand,
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mkdir, readFile, writeFile, readdir, rm } from "fs/promises";
import path from "path";
import { REGISTRATION_PREFIX } from "./constants";
import { STEP_FILE_KEYS, type StepFileKey } from "./steps";

const bucket = process.env.AWS_S3_BUCKET;
const region = process.env.AWS_REGION;
const isVercel = Boolean(process.env.VERCEL);
const useS3 = Boolean(bucket && region);

// On Vercel, S3 is required (filesystem is read-only)
if (isVercel && !useS3) {
  console.error(
    "⚠️ AWS S3 is required on Vercel. Please configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET environment variables."
  );
}

let client: S3Client | null = null;

function getBucket() {
  if (!bucket) {
    throw new Error("AWS_S3_BUCKET env var is required");
  }
  return bucket;
}

function getClient() {
  if (client) {
    return client;
  }

  if (!region) {
    throw new Error("AWS_REGION env var is required");
  }

  // Explicitly use credentials from environment variables
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables are required"
    );
  }

  client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
  
  return client;
}

const toKey = (registrationId: string, step: StepFileKey) =>
  `${REGISTRATION_PREFIX}/${registrationId}/${step}.json`;

const localBase = path.join(process.cwd(), ".data", REGISTRATION_PREFIX);

const toLocalPath = (registrationId: string, step: StepFileKey) =>
  path.join(localBase, registrationId, `${step}.json`);

async function putLocal<T>({
  registrationId,
  step,
  data,
}: {
  registrationId: string;
  step: StepFileKey;
  data: T;
}) {
  // On Vercel, local storage doesn't work - require S3
  if (isVercel) {
    throw new Error(
      "AWS S3 is required on Vercel. The filesystem is read-only. Please configure AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET environment variables in your Vercel project settings."
    );
  }

  const filePath = toLocalPath(registrationId, step);
  try {
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
    // If we can't write to .data, try /tmp as fallback (for local dev)
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      ((error as { code?: string }).code === "EACCES" ||
        (error as { code?: string }).code === "EROFS")
    ) {
      // Try using /tmp as fallback (only for local development)
      if (!isVercel) {
        const tmpBase = path.join("/tmp", REGISTRATION_PREFIX);
        const tmpPath = path.join(tmpBase, registrationId, `${step}.json`);
        await mkdir(path.dirname(tmpPath), { recursive: true });
        await writeFile(tmpPath, JSON.stringify(data, null, 2), "utf8");
        return;
      }
    }
    throw error;
  }
}

async function getLocal<T>({
  registrationId,
  step,
}: {
  registrationId: string;
  step: StepFileKey;
}): Promise<T | null> {
  const filePath = toLocalPath(registrationId, step);
  try {
    const contents = await readFile(filePath, "utf8");
    return JSON.parse(contents) as T;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      (error as { code?: string }).code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
}

export async function putStepData<T>(args: {
  registrationId: string;
  step: StepFileKey;
  data: T;
}) {
  // On Vercel, S3 is mandatory
  if (isVercel && !useS3) {
    throw new Error(
      "AWS S3 configuration is required on Vercel. Please add the following environment variables in Vercel: AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, and AWS_S3_BUCKET. See the setup guide for instructions."
    );
  }

  if (!useS3) {
    return putLocal(args);
  }

  try {
    const command = new PutObjectCommand({
      Bucket: getBucket(),
      Key: toKey(args.registrationId, args.step),
      Body: JSON.stringify(args.data, null, 2),
      ContentType: "application/json",
    });

    await getClient().send(command);
  } catch (error) {
    // Log detailed error for debugging
    console.error("S3 PutObject error:", {
      bucket: getBucket(),
      key: toKey(args.registrationId, args.step),
      region,
      hasAccessKey: !!process.env.AWS_ACCESS_KEY_ID,
      hasSecretKey: !!process.env.AWS_SECRET_ACCESS_KEY,
      error: error instanceof Error ? error.message : String(error),
      errorDetails: error,
    });
    throw error;
  }
}

export async function getStepData<T>(args: {
  registrationId: string;
  step: StepFileKey;
}): Promise<T | null> {
  if (!useS3) {
    return getLocal<T>(args);
  }

  const command = new GetObjectCommand({
    Bucket: getBucket(),
    Key: toKey(args.registrationId, args.step),
  });

  try {
    const response = await getClient().send(command);
    const body = await response.Body?.transformToString();
    if (!body) {
      return null;
    }
    return JSON.parse(body) as T;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "NoSuchKey"
    ) {
      return null;
    }
    if (
      error &&
      typeof error === "object" &&
      "$metadata" in error &&
      (error as { $metadata?: { httpStatusCode?: number } }).$metadata
        ?.httpStatusCode === 404
    ) {
      return null;
    }
    throw error;
  }
}

export async function loadAllSteps(registrationId: string) {
  const entries = await Promise.all(
    STEP_FILE_KEYS.map(async (step) => {
      const data = await getStepData({ registrationId, step });
      return [step, data] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<StepFileKey, unknown>;
}

export async function getAllRegistrations() {
  if (!useS3) {
    // Local storage: read all registration directories
    try {
      const registrationsDir = localBase;
      const entries = await readdir(registrationsDir, { withFileTypes: true });
      
      const registrations = await Promise.all(
        entries
          .filter((entry) => entry.isDirectory())
          .map(async (entry) => {
            const registrationId = entry.name;
            const finalData = await getStepData<{
              registrationId: string;
              email?: string;
              postcode?: string | { postcode?: string; addressLine1?: string; addressLine2?: string; city?: string; county?: string; country?: string };
              entityType?: { entityType: string };
              submittedAt?: string;
            }>({
              registrationId,
              step: "final",
            });
            
            if (!finalData) return null;
            
            // Normalize postcode - handle both string and object formats
            let postcodeStr = "";
            if (typeof finalData.postcode === "string") {
              postcodeStr = finalData.postcode;
            } else if (finalData.postcode && typeof finalData.postcode === "object") {
              postcodeStr = (finalData.postcode as { postcode?: string }).postcode || "";
            }
            
            // Extract entityType safely
            let entityTypeObj: { entityType: string } | undefined;
            if (finalData.entityType) {
              if (typeof finalData.entityType === "object" && finalData.entityType !== null && "entityType" in finalData.entityType) {
                entityTypeObj = { entityType: String(finalData.entityType.entityType) };
              }
            }
            
            // Return only clean, normalized data (no nested objects)
            return { 
              registrationId, 
              email: typeof finalData.email === "string" ? finalData.email : undefined,
              postcode: postcodeStr,
              entityType: entityTypeObj,
              submittedAt: typeof finalData.submittedAt === "string" ? finalData.submittedAt : undefined,
            };
          }),
      );

      return registrations.filter((r): r is NonNullable<typeof r> => r !== null);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "ENOENT"
      ) {
        return [];
      }
      throw error;
    }
  }

  // S3 storage: list all final.json files
  const command = new ListObjectsV2Command({
    Bucket: getBucket(),
    Prefix: `${REGISTRATION_PREFIX}/`,
  });

  try {
    const response = await getClient().send(command);
    const finalFiles =
      response.Contents?.filter((obj) => obj.Key?.endsWith("/final.json")) ||
      [];

    const registrations = await Promise.all(
      finalFiles.map(async (file) => {
        if (!file.Key) return null;
        
        const match = file.Key.match(/\/([^/]+)\/final\.json$/);
        if (!match) return null;
        
        const registrationId = match[1];
        const finalData = await getStepData<{
          registrationId: string;
          email?: string;
          postcode?: string | { postcode?: string; addressLine1?: string; addressLine2?: string; city?: string; county?: string; country?: string };
          entityType?: { entityType: string };
          submittedAt?: string;
        }>({
          registrationId,
          step: "final",
        });

        if (!finalData) return null;
        
        // Normalize postcode - handle both string and object formats
        let postcodeStr = "";
        if (typeof finalData.postcode === "string") {
          postcodeStr = finalData.postcode;
        } else if (finalData.postcode && typeof finalData.postcode === "object") {
          postcodeStr = (finalData.postcode as { postcode?: string }).postcode || "";
        }

        // Extract entityType safely
        let entityTypeObj: { entityType: string } | undefined;
        if (finalData.entityType) {
          if (typeof finalData.entityType === "object" && finalData.entityType !== null && "entityType" in finalData.entityType) {
            entityTypeObj = { entityType: String(finalData.entityType.entityType) };
          }
        }
        
        // Return only clean, normalized data (no nested objects)
        return { 
          registrationId, 
          email: typeof finalData.email === "string" ? finalData.email : undefined,
          postcode: postcodeStr,
          entityType: entityTypeObj,
          submittedAt: typeof finalData.submittedAt === "string" ? finalData.submittedAt : undefined,
        };
      }),
    );

    return registrations.filter((r): r is NonNullable<typeof r> => r !== null);
  } catch (error) {
    console.error("Error listing registrations:", error);
    return [];
  }
}

export async function deleteRegistration(registrationId: string) {
  if (!useS3) {
    // Local storage: delete the entire registration directory
    try {
      const registrationDir = path.join(localBase, registrationId);
      await rm(registrationDir, { recursive: true, force: true });
      return true;
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as { code?: string }).code === "ENOENT"
      ) {
        // Directory doesn't exist, consider it deleted
        return true;
      }
      throw error;
    }
  }

  // S3 storage: delete all files for this registration
  try {
    const command = new ListObjectsV2Command({
      Bucket: getBucket(),
      Prefix: `${REGISTRATION_PREFIX}/${registrationId}/`,
    });

    const response = await getClient().send(command);
    const files = response.Contents || [];

    // Delete all files for this registration
    await Promise.all(
      files.map(async (file) => {
        if (!file.Key) return;
        
        const deleteCommand = new DeleteObjectCommand({
          Bucket: getBucket(),
          Key: file.Key,
        });
        
        await getClient().send(deleteCommand);
      }),
    );

    return true;
  } catch (error) {
    console.error("Error deleting registration:", error);
    throw error;
  }
}

