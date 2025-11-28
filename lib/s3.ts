import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { mkdir, readFile, writeFile } from "fs/promises";
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

