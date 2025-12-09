import {
  validatePhoneNumber,
  formatToE164,
  stripPhoneNumber,
  countDigits,
} from "../lib/phone-validation";

describe("Phone Number Validation", () => {
  describe("validatePhoneNumber", () => {
    describe("Valid UK Mobile Numbers", () => {
      test("should accept 07xxxxxxxxx format (11 digits)", () => {
        const result = validatePhoneNumber("07123456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });

      test("should accept 07xxxxxxxxx with spaces", () => {
        const result = validatePhoneNumber("07123 456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });

      test("should accept 07xxxxxxxxx with hyphens", () => {
        const result = validatePhoneNumber("07123-456-789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });
    });

    describe("Valid UK Landline Numbers", () => {
      test("should accept 01xxxxxxxx format", () => {
        const result = validatePhoneNumber("0123456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(10);
      });

      test("should accept 02xxxxxxxx format", () => {
        const result = validatePhoneNumber("02071234567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });

      test("should accept 03xxxxxxxx format", () => {
        const result = validatePhoneNumber("03001234567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });

      test("should accept landline with spaces", () => {
        const result = validatePhoneNumber("020 7123 4567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });
    });

    describe("Valid International Numbers", () => {
      test("should accept +44 UK format", () => {
        const result = validatePhoneNumber("+447123456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(13);
      });

      test("should accept +44 with spaces", () => {
        const result = validatePhoneNumber("+44 7123 456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(13);
      });

      test("should accept other international formats", () => {
        const result = validatePhoneNumber("+1234567890");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });
    });

    describe("Invalid Numbers", () => {
      test("should reject empty string", () => {
        const result = validatePhoneNumber("");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a phone number");
      });

      test("should reject too short numbers (< 10 digits)", () => {
        const result = validatePhoneNumber("123456789");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too short");
        expect(result.digits).toBe(9);
      });

      test("should reject too long numbers (> 15 digits)", () => {
        const result = validatePhoneNumber("1234567890123456");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Phone number is too long");
        expect(result.digits).toBe(16);
      });

      test("should reject numbers with letters", () => {
        const result = validatePhoneNumber("07123abc456");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid phone number");
      });

      test("should reject numbers with invalid symbols", () => {
        const result = validatePhoneNumber("07123@456");
        expect(result.valid).toBe(false);
        expect(result.error).toBe("Enter a valid phone number");
      });

      test("should reject only plus sign", () => {
        const result = validatePhoneNumber("+");
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

      test("should handle numbers with parentheses", () => {
        const result = validatePhoneNumber("(020) 7123 4567");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(11);
      });

      test("should handle minimum valid length (10 digits)", () => {
        const result = validatePhoneNumber("0123456789");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(10);
      });

      test("should handle maximum valid length (15 digits)", () => {
        const result = validatePhoneNumber("+123456789012345");
        expect(result.valid).toBe(true);
        expect(result.digits).toBe(15);
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

      test("should keep other international formats", () => {
        expect(formatToE164("+1234567890")).toBe("+1234567890");
      });

      test("should handle +44 with spaces", () => {
        expect(formatToE164("+44 7123 456789")).toBe("+447123456789");
      });
    });

    describe("Edge Cases", () => {
      test("should return empty string for empty input", () => {
        expect(formatToE164("")).toBe("");
      });

      test("should handle numbers starting with 0 but not UK format", () => {
        const result = formatToE164("012345678");
        // Should attempt to format but validation will catch if invalid
        expect(result).toContain("+44");
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
      expect(countDigits("+447123456789")).toBe(13);
    });

    test("should handle empty string", () => {
      expect(countDigits("")).toBe(0);
    });
  });
});

