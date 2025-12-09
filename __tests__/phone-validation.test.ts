import {
  validatePhoneNumber,
  formatToE164,
  stripPhoneNumber,
  countDigits,
} from "../lib/phone-validation";

describe("Phone Number Validation", () => {
  describe("validatePhoneNumber", () => {
    describe("Valid UK Numbers (must start with +44)", () => {
      test("should accept +447xxxxxxxxx format (UK mobile)", () => {
        const result = validatePhoneNumber("+447123456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(12); // +44 + 10 digits = 12 total
      });

      test("should accept +447xxxxxxxxxx format (11 digits after +44)", () => {
        const result = validatePhoneNumber("+4471234567890");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(13); // +44 + 11 digits = 13 total
      });

      test("should accept +4420xxxxxxxx format (UK landline)", () => {
        const result = validatePhoneNumber("+442071234567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(12); // +44 + 10 digits = 12 total
      });

      test("should accept +441xxxxxxxxx format (UK landline with 10 digits)", () => {
        const result = validatePhoneNumber("+441234567890");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(12); // +44 + 10 digits = 12 total
      });

      test("should accept +443xxxxxxxx format (UK landline)", () => {
        const result = validatePhoneNumber("+443001234567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(12); // +44 + 10 digits = 12 total
      });
    });

    describe("Invalid Numbers", () => {
      test("should reject empty string", () => {
        const result = validatePhoneNumber("");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a phone number");
      });

      test("should reject numbers not starting with +44", () => {
        const result = validatePhoneNumber("07123456789");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid UK phone number beginning with +44");
      });

      test("should reject +1 (US) format", () => {
        const result = validatePhoneNumber("+1234567890");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid UK phone number beginning with +44");
      });

      test("should reject +91 (India) format", () => {
        const result = validatePhoneNumber("+911234567890");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid UK phone number beginning with +44");
      });

      test("should reject too short numbers (< 10 digits after +44)", () => {
        const result = validatePhoneNumber("+441234567");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too short");
        expect(result.digits).toBe(9); // +44 (2) + 7 digits = 9 total
      });

      test("should reject too long numbers (> 14 digits total)", () => {
        const result = validatePhoneNumber("+441234567890123");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too long");
        expect(result.digits).toBe(15); // +44 + 13 digits
      });

      test("should reject numbers with non-digits after +44", () => {
        const result = validatePhoneNumber("+447123 456789");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid UK phone number beginning with +44");
      });

      test("should reject only +44", () => {
        const result = validatePhoneNumber("+44");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too short");
      });
    });

    describe("Edge Cases", () => {
      test("should handle whitespace-only strings", () => {
        const result = validatePhoneNumber("   ");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a phone number");
      });

      test("should handle minimum valid length (10 digits after +44)", () => {
        const result = validatePhoneNumber("+441234567890");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(12); // +44 + 10 digits
      });

      test("should handle maximum valid length (12 digits after +44 = 14 total)", () => {
        const result = validatePhoneNumber("+44123456789012");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(14); // +44 + 12 digits
      });

      test("should reject exactly 15 digits total", () => {
        const result = validatePhoneNumber("+441234567890123");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too long");
      });
    });
  });

  describe("formatToE164", () => {
    describe("UK Mobile Numbers", () => {
      test("should format 07xxxxxxxxx to +447xxxxxxxxx", () => {
        expect(formatToE164("07123456789")).toBe("+447123456789");
      });

      test("should format with spaces", () => {
        expect(formatToE164("07123 456789")).toBe("+447123456789");
      });

      test("should format with hyphens", () => {
        expect(formatToE164("07123-456-789")).toBe("+447123456789");
      });
    });

    describe("UK Landline Numbers", () => {
      test("should format 020xxxxxxxx to +4420xxxxxxxx", () => {
        expect(formatToE164("02071234567")).toBe("+442071234567");
      });

      test("should format 01xxxxxxxx to +441xxxxxxxx", () => {
        expect(formatToE164("0123456789")).toBe("+44123456789");
      });

      test("should format with spaces", () => {
        expect(formatToE164("020 7123 4567")).toBe("+442071234567");
      });
    });

    describe("International Numbers", () => {
      test("should keep +44 format as is", () => {
        expect(formatToE164("+447123456789")).toBe("+447123456789");
      });

      test("should convert +1 to +44 (UK-only)", () => {
        expect(formatToE164("+1234567890")).toBe("+441234567890");
      });

      test("should convert +91 to +44 (UK-only)", () => {
        expect(formatToE164("+911234567890")).toBe("+44911234567890");
      });

      test("should handle +44 with spaces", () => {
        expect(formatToE164("+44 7123 456789")).toBe("+447123456789");
      });
    });

    describe("Edge Cases", () => {
      test("should return +44 for empty input", () => {
        expect(formatToE164("")).toBe("+44");
      });

      test("should handle numbers starting with 0 but not UK format", () => {
        const result = formatToE164("012345678");
        // Number starts with 0, so remove leading 0 and add +44
        expect(result).toBe("+4412345678");
      });
    });
  });

  describe("stripPhoneNumber", () => {
    test("should remove all non-digit characters except +", () => {
      expect(stripPhoneNumber("07123 456-789")).toBe("07123456789");
    });

    test("should keep + sign", () => {
      expect(stripPhoneNumber("+44 7123 456789")).toBe("+447123456789");
    });

    test("should remove parentheses", () => {
      expect(stripPhoneNumber("(020) 7123 4567")).toBe("02071234567");
    });
  });

  describe("countDigits", () => {
    test("should count only digits", () => {
      expect(countDigits("07123 456-789")).toBe(11);
    });

    test("should not count + sign", () => {
      expect(countDigits("+447123456789")).toBe(12); // 12 digits (4+4+7+1+2+3+4+5+6+7+8+9)
    });

    test("should handle empty string", () => {
      expect(countDigits("")).toBe(0);
    });
  });
});

