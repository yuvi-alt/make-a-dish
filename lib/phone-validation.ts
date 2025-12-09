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
 * Validates phone number format
 * - Only allows digits, spaces, +, parentheses, and hyphens
 * - Must have 10-15 digits total
 * - Supports UK mobile (07xxxxxxxxx), UK landlines (01/02/03), and international (+44...)
 */
export function validatePhoneNumber(phone: string): {
  valid: boolean;
  error?: string;
  digits: number;
} {
  if (!phone || phone.trim() === "") {
    return { valid: false, error: "Enter a phone number", digits: 0 };
  }

  // Check for invalid characters (only allow digits, spaces, +, parentheses, hyphens)
  const allowedChars = /^[+\d\s()\-]+$/;
  if (!allowedChars.test(phone)) {
    return { valid: false, error: "Enter a valid phone number", digits: 0 };
  }

  // Count digits
  const digits = countDigits(phone);
  
  if (digits < 10) {
    return { valid: false, error: "Phone number is too short", digits };
  }
  
  if (digits > 15) {
    return { valid: false, error: "Phone number is too long", digits };
  }

  // Additional validation for UK numbers
  const stripped = stripPhoneNumber(phone);
  
  // UK mobile: 07xxxxxxxxx (11 digits starting with 07)
  // UK landline: 01/02/03 prefixes
  // International: +44 or + followed by country code
  
  // Check if it's a UK number without country code
  if (!stripped.startsWith("+")) {
    // UK mobile: must start with 07 and be 11 digits
    if (stripped.startsWith("07") && digits === 11) {
      return { valid: true, digits };
    }
    // UK landline: must start with 01, 02, or 03 and be 10-11 digits
    if ((stripped.startsWith("01") || stripped.startsWith("02") || stripped.startsWith("03")) && digits >= 10 && digits <= 11) {
      return { valid: true, digits };
    }
    // If it's 10-15 digits and doesn't match UK patterns, still accept it (could be international without +)
    if (digits >= 10 && digits <= 15) {
      return { valid: true, digits };
    }
  } else {
    // International format with +
    if (stripped.startsWith("+44")) {
      // UK international format: +44 followed by 10-11 digits (excluding country code)
      const ukDigits = digits - 2; // Remove + and 4, count remaining
      if (ukDigits >= 10 && ukDigits <= 11) {
        return { valid: true, digits };
      }
    }
    // Other international formats: + followed by country code and number
    if (digits >= 10 && digits <= 15) {
      return { valid: true, digits };
    }
  }

  return { valid: false, error: "Enter a valid UK phone number", digits };
}

/**
 * Formats a phone number to E.164 format when possible
 * Examples:
 * - 07123 456789 → +447123456789
 * - 020 7123 4567 → +442071234567
 * - +44 7123 456789 → +447123456789
 */
export function formatToE164(phone: string | undefined): string {
  if (!phone || phone.trim() === "") {
    return phone || "";
  }

  const stripped = stripPhoneNumber(phone);
  
  // If already in E.164 format, return as is
  if (stripped.startsWith("+") && stripped.length >= 11) {
    return stripped;
  }

  // UK mobile: 07xxxxxxxxx → +447xxxxxxxxx
  if (stripped.startsWith("07") && stripped.length === 11) {
    return `+44${stripped.substring(1)}`;
  }

  // UK landline: 01/02/03xxxxxxxx → +441/2/3xxxxxxxx
  if ((stripped.startsWith("01") || stripped.startsWith("02") || stripped.startsWith("03")) && stripped.length >= 10) {
    return `+44${stripped}`;
  }

  // If it starts with + but not +44, return as is
  if (stripped.startsWith("+")) {
    return stripped;
  }

  // If it's 10-15 digits without +, assume UK and add +44
  if (stripped.length >= 10 && stripped.length <= 15 && !stripped.startsWith("+")) {
    // Check if it looks like a UK number
    if (stripped.startsWith("0")) {
      // Remove leading 0 and add +44
      return `+44${stripped.substring(1)}`;
    }
    // If it doesn't start with 0, just add +44
    return `+44${stripped}`;
  }

  // If formatting fails, return original (validation will catch invalid numbers)
  return phone;
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

