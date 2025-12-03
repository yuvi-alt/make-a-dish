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
const useS3 = Boolean(bucket && region);

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

  client = new S3Client({ region });
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
  const filePath = toLocalPath(registrationId, step);
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
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
  if (!useS3) {
    return putLocal(args);
  }

  const command = new PutObjectCommand({
    Bucket: getBucket(),
    Key: toKey(args.registrationId, args.step),
    Body: JSON.stringify(args.data, null, 2),
    ContentType: "application/json",
  });

  await getClient().send(command);
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

