/**
 * Phone number validation and formatting utilities
 * Supports UK mobile, UK landlines, and international formats
 */

/**
 * Strips all non-digit characters except + from a phone number
 */
export function stripPhoneNumber(phone: string): string {
  return phone.replace(/[^\d+]/g, "");
}

/**
 * Counts only digits in a phone number (excluding +)
 */
export function countDigits(phone: string): number {
  return phone.replace(/\D/g, "").length;
}

/**
 * Validates UK-only phone number format
 * - Must start with +44
 * - Must contain only digits after +44
 * - Minimum length: 10 digits after +44
 * - Maximum length: 14 digits total (including +44)
 */
export function validatePhoneNumber(phone: string): {
  valid: boolean;
  error?: string;
  digits: number;
} {
  if (!phone || phone.trim() === "") {
    return { valid: false, error: "Enter a phone number", digits: 0 };
  }

  // Must start with +44
  if (!phone.startsWith("+44")) {
    return { valid: false, error: "Enter a valid UK phone number beginning with +44", digits: 0 };
  }

  // Extract digits after +44
  const afterPrefix = phone.substring(3);
  const digitsAfterPrefix = afterPrefix.replace(/\D/g, "");

  // Must contain only digits after +44
  if (afterPrefix !== digitsAfterPrefix) {
    return { valid: false, error: "Enter a valid UK phone number beginning with +44", digits: 0 };
  }

  // Count total digits (including country code)
  // +44 contributes 2 digits, plus digits after prefix
  const totalDigits = 2 + digitsAfterPrefix.length;

  // Minimum: 10 digits after +44 (total 12)
  if (digitsAfterPrefix.length < 10) {
    return { valid: false, error: "Phone number is too short", digits: totalDigits };
  }

  // Maximum: 14 digits total (12 digits after +44)
  if (totalDigits > 14) {
    return { valid: false, error: "Phone number is too long", digits: totalDigits };
  }

  return { valid: true, digits: totalDigits };
}

/**
 * Formats a phone number to UK E.164 format (+44...)
 * Examples:
 * - 07123 456789 → +447123456789
 * - 020 7123 4567 → +442071234567
 * - +44 7123 456789 → +447123456789
 * - Already +44 → returns as is
 */
export function formatToE164(phone: string | undefined): string {
  if (!phone || phone.trim() === "") {
    return "+44";
  }

  // If already starts with +44, return as is (remove any non-digits after +44)
  if (phone.startsWith("+44")) {
    const digitsAfter = phone.substring(3).replace(/\D/g, "");
    return `+44${digitsAfter}`;
  }

  const stripped = stripPhoneNumber(phone);
  
  // UK mobile: 07xxxxxxxxx → +447xxxxxxxxx
  if (stripped.startsWith("07") && stripped.length === 11) {
    return `+44${stripped.substring(1)}`;
  }

  // UK landline: 01/02/03xxxxxxxx → +441/2/3xxxxxxxx (remove leading 0)
  if ((stripped.startsWith("01") || stripped.startsWith("02") || stripped.startsWith("03")) && stripped.length >= 10) {
    return `+44${stripped.substring(1)}`;
  }

  // If it starts with 0, remove leading 0 and add +44
  if (stripped.startsWith("0")) {
    return `+44${stripped.substring(1)}`;
  }

  // If it's digits without +, add +44
  if (stripped.length >= 10 && !stripped.startsWith("+")) {
    return `+44${stripped}`;
  }

  // If it starts with + but not +44, this is invalid for UK-only
  // Return +44 with the digits (validation will catch if invalid)
  if (stripped.startsWith("+") && !stripped.startsWith("+44")) {
    const digits = stripped.substring(1).replace(/\D/g, "");
    return `+44${digits}`;
  }

  // Default: ensure +44 prefix
  return `+44${stripped.replace(/\D/g, "")}`;
}

import { z } from "zod";

/**
 * Zod refinement function for phone number validation
 */
export function phoneNumberRefinement(value: string, ctx: z.RefinementCtx): void {
  const result = validatePhoneNumber(value);
  if (!result.valid && result.error) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.error,
    });
  }
}


