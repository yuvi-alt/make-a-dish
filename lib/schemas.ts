import { z } from "zod";
import { ENTITY_OPTIONS } from "./steps";

const ukPostcodeRegex =
  /^([A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}|GIR ?0AA)$/i;

const phoneRegex = /^[+()0-9\s-]{7,20}$/;
const companiesHouseRegex = /^[A-Z0-9]{6,8}$/i;

export const postcodeSchema = z.object({
  postcode: z.string().trim().min(1, "Enter a postcode"),
  addressLine1: z.string().trim().min(1, "Enter address line 1"),
  addressLine2: z.string().trim().optional().or(z.literal("")),
  city: z.string().trim().min(1, "Enter a city or town"),
  county: z.string().trim().min(1, "Enter a county or region"),
  country: z.string().trim().min(1, "Enter a country"),
});

export const entityTypeSchema = z.object({
  entityType: z.enum(
    ENTITY_OPTIONS.map((option) => option.value) as [
      (typeof ENTITY_OPTIONS)[number]["value"],
      ...(typeof ENTITY_OPTIONS)[number]["value"][],
    ],
    { message: "Select a legal entity type" },
  ),
});

export const soleTraderSchema = z.object({
  firstName: z.string().min(1, "Enter a first name"),
  middleName: z.string().optional(),
  lastName: z.string().min(1, "Enter a last name"),
  birthdate: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
});

export const partnershipSchema = z.object({
  partners: z
    .array(
      z.object({
        name: z.string().min(1, "Enter a partner name"),
      }),
    )
    .min(1, "Add at least one partner"),
  mainContact: z.string().min(1, "Enter a main point of contact"),
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  mainPhone: z
    .string()
    .min(1, "Enter a phone number")
    .regex(phoneRegex, "Enter a valid phone number"),
  secondaryPhone: z
    .string()
    .regex(phoneRegex, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export const limitedCompanySchema = z.object({
  companyName: z.string().min(1, "Enter the registered company name"),
  companiesHouseNumber: z
    .string()
    .min(1, "Enter the Companies House number")
    .regex(
      companiesHouseRegex,
      "Companies House number should be 6-8 letters/numbers",
    )
    .transform((value) => value.toUpperCase()),
  contactName: z.string().min(1, "Enter a contact name"),
  role: z.string().optional(),
  phoneNumber: z
    .string()
    .min(1, "Enter a phone number")
    .regex(phoneRegex, "Enter a valid phone number"),
});

export const organisationSchema = z.object({
  trustName: z.string().min(1, "Enter the organisation name"),
  charityReferenceNumber: z.string().optional(),
});

export type PostcodePayload = z.infer<typeof postcodeSchema>;
export type EntityTypePayload = z.infer<typeof entityTypeSchema>;
export type SoleTraderPayload = z.infer<typeof soleTraderSchema>;
export type PartnershipPayload = z.infer<typeof partnershipSchema>;
export type LimitedCompanyPayload = z.infer<typeof limitedCompanySchema>;
export type OrganisationPayload = z.infer<typeof organisationSchema>;

