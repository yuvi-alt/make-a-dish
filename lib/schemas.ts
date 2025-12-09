import { z } from "zod";
import { ENTITY_OPTIONS } from "./steps";
import { phoneNumberRefinement } from "./phone-validation";

const ukPostcodeRegex =
  /^([A-Z]{1,2}\d{1,2}[A-Z]? ?\d[A-Z]{2}|GIR ?0AA)$/i;

const companiesHouseRegex = /^[A-Z0-9]{6,8}$/i;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const urlRegex = /^https?:\/\/.+/;

// Phone number schema helper - validates phone numbers
const createPhoneSchema = (required: boolean = true, fieldName: string = "phone number") => {
  if (required) {
    return z
      .string()
      .trim()
      .min(1, `Enter a ${fieldName}`)
      .refine(phoneNumberRefinement);
  }
  
  // Optional phone number - allow empty string, but validate if provided
  return z
    .string()
    .trim()
    .optional()
    .or(z.literal(""))
    .superRefine((value, ctx) => {
      if (!value || value === "") return;
      phoneNumberRefinement(value, ctx);
    });
};

// Shared enums for dropdowns
const premisesTypeEnum = z.enum([
  "MOBILE_OR_MOVEABLE_PREMISES",
  "HOME_OR_DOMESTIC_PREMISES",
  "COMMERCIAL_OR_PUBLIC_PREMISES",
]);

const daysOfOperationEnum = z.enum([
  "DAILY",
  "PARTIAL_WEEK",
  "SEASONAL",
]);

const businessTypeEnum = z.enum([
  "LOCAL_CUSTOMERS",
  "NATIONAL_CUSTOMERS",
  "EXPORT_CUSTOMERS",
  "ONLINE_SALES",
  "B2B_SUPPLY",
  "VULNERABLE_GROUPS",
  "HEALTHCARE_RESIDENTS",
  "NONE",
  "UNKNOWN",
]);

const foodSupplyScopeEnum = z.enum([
  "RAW_UNWRAPPED_PROTEINS",
  "READY_TO_EAT",
  "COOKED_REHEATED",
  "IMPORTED_FOOD",
  "NONE",
  "UNKNOWN",
]);

const foodProcessingMethodsEnum = z.enum([
  "VACUUM_PACKING",
  "SOUS_VIDE",
  "FERMENT_CURE",
  "PASTEURISATION",
  "RAW_ANIMAL_FOODS",
  "REWRAP_RELABEL",
  "NONE",
  "UNKNOWN",
]);

const waterSupplyTypeEnum = z.enum([
  "MAINS",
  "PRIVATE",
  "BOTH",
]);

export const postcodeSchema = z.object({
  email: z.string().trim().email("Enter a valid email address").min(1, "Enter an email address"),
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
  // Person Fields
  firstName: z.string().min(1, "Enter a first name"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Enter a last name"),
  birthdate: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  mainPhoneNumber: createPhoneSchema(true, "main phone number"),
  secondaryPhoneNumber: createPhoneSchema(false, "secondary phone number"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .email("Enter a valid email address"),
  
  // Business Location Fields
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  tradingName: z.string().min(1, "Enter a trading name"),
  additionalTradingName: z.string().optional().or(z.literal("")),
  premisesType: premisesTypeEnum,
  establishmentMainPhoneNumber: createPhoneSchema(false, "establishment main phone number"),
  establishmentSecondaryPhoneNumber: createPhoneSchema(false, "establishment secondary phone number"),
  establishmentEmailAddress: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  webAddress: z
    .string()
    .trim()
    .refine((value) => !value || value === "" || urlRegex.test(value), "Enter a valid web address (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
  
  // Trading Information
  tradingStatus: z.boolean(),
  tradingStartDate: z.string().optional().or(z.literal("")),
  expectedOpeningDate: z.string().optional().or(z.literal("")),
  
  // Days of Operation
  daysOfOperation: daysOfOperationEnum,
  
  // Operation Times
  operationStartTime: z.string().min(1, "Enter an operation start time"),
  operationEndTime: z.string().min(1, "Enter an operation end time"),
  
  // Business Type
  businessType: businessTypeEnum,
  
  // Food Supply Scope
  foodSupplyScope: foodSupplyScopeEnum,
  
  // Food Processing Methods (multi-select)
  foodProcessingMethods: z.array(foodProcessingMethodsEnum).min(1, "Select at least one food processing method"),
  
  // Water Supply Type
  waterSupplyType: waterSupplyTypeEnum,
  
  // Other Details
  otherDetails: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  // Validate trading start date when trading status is Yes
  if (data.tradingStatus) {
    if (!data.tradingStartDate || data.tradingStartDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a trading start date",
        path: ["tradingStartDate"],
      });
    } else if (Number.isNaN(Date.parse(data.tradingStartDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid trading start date",
        path: ["tradingStartDate"],
      });
    }
  }
  
  // Validate expected opening date when trading status is No
  if (!data.tradingStatus) {
    if (!data.expectedOpeningDate || data.expectedOpeningDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an expected opening date",
        path: ["expectedOpeningDate"],
      });
    } else if (Number.isNaN(Date.parse(data.expectedOpeningDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid expected opening date",
        path: ["expectedOpeningDate"],
      });
    }
  }
});

export const partnershipSchema = z.object({
  // Person Fields (for main contact)
  firstName: z.string().min(1, "Enter a first name"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Enter a last name"),
  birthdate: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  mainPhoneNumber: createPhoneSchema(true, "main phone number"),
  secondaryPhoneNumber: createPhoneSchema(false, "secondary phone number"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .email("Enter a valid email address"),
  
  // Partners
  partners: z
    .array(
      z.object({
        name: z.string().min(1, "Enter a partner name"),
      }),
    )
    .min(1, "Add at least one partner"),
  mainContact: z.string().min(1, "Enter a main point of contact"),
  
  // Business Location Fields
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  tradingName: z.string().min(1, "Enter a trading name"),
  additionalTradingName: z.string().optional().or(z.literal("")),
  premisesType: premisesTypeEnum,
  establishmentMainPhoneNumber: createPhoneSchema(false, "establishment main phone number"),
  establishmentSecondaryPhoneNumber: createPhoneSchema(false, "establishment secondary phone number"),
  establishmentEmailAddress: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  webAddress: z
    .string()
    .trim()
    .refine((value) => !value || value === "" || urlRegex.test(value), "Enter a valid web address (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
  
  // Trading Information
  tradingStatus: z.boolean(),
  tradingStartDate: z.string().optional().or(z.literal("")),
  expectedOpeningDate: z.string().optional().or(z.literal("")),
  
  // Days of Operation
  daysOfOperation: daysOfOperationEnum,
  
  // Operation Times
  operationStartTime: z.string().min(1, "Enter an operation start time"),
  operationEndTime: z.string().min(1, "Enter an operation end time"),
  
  // Business Type
  businessType: businessTypeEnum,
  
  // Food Supply Scope
  foodSupplyScope: foodSupplyScopeEnum,
  
  // Food Processing Methods (multi-select)
  foodProcessingMethods: z.array(foodProcessingMethodsEnum).min(1, "Select at least one food processing method"),
  
  // Water Supply Type
  waterSupplyType: waterSupplyTypeEnum,
  
  // Other Details
  otherDetails: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.tradingStatus) {
    if (!data.tradingStartDate || data.tradingStartDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a trading start date",
        path: ["tradingStartDate"],
      });
    } else if (Number.isNaN(Date.parse(data.tradingStartDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid trading start date",
        path: ["tradingStartDate"],
      });
    }
  }
  
  if (!data.tradingStatus) {
    if (!data.expectedOpeningDate || data.expectedOpeningDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an expected opening date",
        path: ["expectedOpeningDate"],
      });
    } else if (Number.isNaN(Date.parse(data.expectedOpeningDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid expected opening date",
        path: ["expectedOpeningDate"],
      });
    }
  }
});

export const limitedCompanySchema = z.object({
  // Company Fields
  companyName: z.string().min(1, "Enter the registered company name"),
  companiesHouseNumber: z
    .string()
    .min(1, "Enter the Companies House number")
    .regex(
      companiesHouseRegex,
      "Companies House number should be 6-8 letters/numbers",
    )
    .transform((value) => value.toUpperCase()),
  
  // Person Fields (for contact)
  firstName: z.string().min(1, "Enter a first name"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Enter a last name"),
  birthdate: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  mainPhoneNumber: createPhoneSchema(true, "main phone number"),
  secondaryPhoneNumber: createPhoneSchema(false, "secondary phone number"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .email("Enter a valid email address"),
  contactName: z.string().min(1, "Enter a contact name"),
  role: z.string().optional().or(z.literal("")),
  
  // Business Location Fields
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  tradingName: z.string().min(1, "Enter a trading name"),
  additionalTradingName: z.string().optional().or(z.literal("")),
  premisesType: premisesTypeEnum,
  establishmentMainPhoneNumber: createPhoneSchema(false, "establishment main phone number"),
  establishmentSecondaryPhoneNumber: createPhoneSchema(false, "establishment secondary phone number"),
  establishmentEmailAddress: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  webAddress: z
    .string()
    .trim()
    .refine((value) => !value || value === "" || urlRegex.test(value), "Enter a valid web address (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
  
  // Trading Information
  tradingStatus: z.boolean(),
  tradingStartDate: z.string().optional().or(z.literal("")),
  expectedOpeningDate: z.string().optional().or(z.literal("")),
  
  // Days of Operation
  daysOfOperation: daysOfOperationEnum,
  
  // Operation Times
  operationStartTime: z.string().min(1, "Enter an operation start time"),
  operationEndTime: z.string().min(1, "Enter an operation end time"),
  
  // Business Type
  businessType: businessTypeEnum,
  
  // Food Supply Scope
  foodSupplyScope: foodSupplyScopeEnum,
  
  // Food Processing Methods (multi-select)
  foodProcessingMethods: z.array(foodProcessingMethodsEnum).min(1, "Select at least one food processing method"),
  
  // Water Supply Type
  waterSupplyType: waterSupplyTypeEnum,
  
  // Other Details
  otherDetails: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.tradingStatus) {
    if (!data.tradingStartDate || data.tradingStartDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a trading start date",
        path: ["tradingStartDate"],
      });
    } else if (Number.isNaN(Date.parse(data.tradingStartDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid trading start date",
        path: ["tradingStartDate"],
      });
    }
  }
  
  if (!data.tradingStatus) {
    if (!data.expectedOpeningDate || data.expectedOpeningDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an expected opening date",
        path: ["expectedOpeningDate"],
      });
    } else if (Number.isNaN(Date.parse(data.expectedOpeningDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid expected opening date",
        path: ["expectedOpeningDate"],
      });
    }
  }
});

export const organisationSchema = z.object({
  // Organisation Fields
  trustName: z.string().min(1, "Enter the organisation name"),
  charityReferenceNumber: z.string().optional().or(z.literal("")),
  
  // Person Fields (for main contact)
  firstName: z.string().min(1, "Enter a first name"),
  middleName: z.string().optional().or(z.literal("")),
  lastName: z.string().min(1, "Enter a last name"),
  birthdate: z
    .string()
    .min(1, "Enter a date of birth")
    .refine((value) => !Number.isNaN(Date.parse(value)), "Enter a valid date"),
  mainPhoneNumber: createPhoneSchema(true, "main phone number"),
  secondaryPhoneNumber: createPhoneSchema(false, "secondary phone number"),
  emailAddress: z
    .string()
    .trim()
    .min(1, "Enter an email address")
    .email("Enter a valid email address"),
  
  // Business Location Fields
  postcode: z
    .string()
    .trim()
    .regex(ukPostcodeRegex, "Enter a valid UK postcode")
    .transform((value) => value.toUpperCase().replace(/\s+/g, "")),
  tradingName: z.string().min(1, "Enter a trading name"),
  additionalTradingName: z.string().optional().or(z.literal("")),
  premisesType: premisesTypeEnum,
  establishmentMainPhoneNumber: createPhoneSchema(false, "establishment main phone number"),
  establishmentSecondaryPhoneNumber: createPhoneSchema(false, "establishment secondary phone number"),
  establishmentEmailAddress: z
    .string()
    .trim()
    .email("Enter a valid email address")
    .optional()
    .or(z.literal("")),
  webAddress: z
    .string()
    .trim()
    .refine((value) => !value || value === "" || urlRegex.test(value), "Enter a valid web address (starting with http:// or https://)")
    .optional()
    .or(z.literal("")),
  
  // Trading Information
  tradingStatus: z.boolean(),
  tradingStartDate: z.string().optional().or(z.literal("")),
  expectedOpeningDate: z.string().optional().or(z.literal("")),
  
  // Days of Operation
  daysOfOperation: daysOfOperationEnum,
  
  // Operation Times
  operationStartTime: z.string().min(1, "Enter an operation start time"),
  operationEndTime: z.string().min(1, "Enter an operation end time"),
  
  // Business Type
  businessType: businessTypeEnum,
  
  // Food Supply Scope
  foodSupplyScope: foodSupplyScopeEnum,
  
  // Food Processing Methods (multi-select)
  foodProcessingMethods: z.array(foodProcessingMethodsEnum).min(1, "Select at least one food processing method"),
  
  // Water Supply Type
  waterSupplyType: waterSupplyTypeEnum,
  
  // Other Details
  otherDetails: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.tradingStatus) {
    if (!data.tradingStartDate || data.tradingStartDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a trading start date",
        path: ["tradingStartDate"],
      });
    } else if (Number.isNaN(Date.parse(data.tradingStartDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid trading start date",
        path: ["tradingStartDate"],
      });
    }
  }
  
  if (!data.tradingStatus) {
    if (!data.expectedOpeningDate || data.expectedOpeningDate === "") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter an expected opening date",
        path: ["expectedOpeningDate"],
      });
    } else if (Number.isNaN(Date.parse(data.expectedOpeningDate))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid expected opening date",
        path: ["expectedOpeningDate"],
      });
    }
  }
});

export type PostcodePayload = z.infer<typeof postcodeSchema>;
export type EntityTypePayload = z.infer<typeof entityTypeSchema>;
export type SoleTraderPayload = z.infer<typeof soleTraderSchema>;
export type PartnershipPayload = z.infer<typeof partnershipSchema>;
export type LimitedCompanyPayload = z.infer<typeof limitedCompanySchema>;
export type OrganisationPayload = z.infer<typeof organisationSchema>;

