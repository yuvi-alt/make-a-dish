import type { FieldErrors, FieldValues } from "react-hook-form";

export type SummaryError = { id: string; message: string };

export function buildErrorSummary(errors: FieldErrors<FieldValues>) {
  const summary: SummaryError[] = [];

  for (const [key, value] of Object.entries(errors)) {
    const message = extractMessage(value);
    if (message) {
      summary.push({ id: key, message });
    }
  }

  return summary;
}

function extractMessage(error: unknown): string | null {
  if (!error) return null;

  if (typeof error === "string") return error;

  if (typeof error === "object") {
    if ("message" in error && error.message) {
      return String(error.message);
    }
    if ("root" in error && error.root && typeof error.root === "object") {
      const maybeMessage =
        "message" in error.root ? (error.root as { message?: string }).message : null;
      if (maybeMessage) {
        return maybeMessage;
      }
    }

    for (const nested of Object.values(error)) {
      const nestedMessage = extractMessage(nested);
      if (nestedMessage) return nestedMessage;
    }
  }

  return null;
}

