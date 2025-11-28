export const ENTITY_OPTIONS = [
  { value: "sole-trader", label: "Sole Trader" },
  { value: "partnership", label: "Partnership" },
  { value: "limited-company", label: "Limited Company" },
  { value: "organisation", label: "Organisation / Charity / Trust" },
];

export type EntityType = (typeof ENTITY_OPTIONS)[number]["value"];

export const ENTITY_ROUTES: Record<EntityType, string> = {
  "sole-trader": "/register/sole-trader",
  partnership: "/register/partnership",
  "limited-company": "/register/limited-company",
  organisation: "/register/organisation",
};

export const STEP_FILE_KEYS = [
  "postcode",
  "entity-type",
  "sole-trader",
  "partnership",
  "limited-company",
  "organisation",
  "final",
] as const;

export type StepFileKey = (typeof STEP_FILE_KEYS)[number];

export type ProgressStepKey =
  | "postcode"
  | "entity-type"
  | "details"
  | "review"
  | "complete";

export const PROGRESS_STEPS: Array<{
  key: ProgressStepKey;
  label: string;
}> = [
  { key: "postcode", label: "Find your council" },
  { key: "entity-type", label: "Legal entity" },
  { key: "details", label: "Business details" },
  { key: "review", label: "Review & submit" },
  { key: "complete", label: "Complete" },
];

export function getDetailsLabel(entityType?: string) {
  if (!entityType) {
    return "Business details";
  }

  const option = ENTITY_OPTIONS.find((o) => o.value === entityType);
  return option ? `${option.label} details` : "Business details";
}

export function getDetailsRoute(entityType: EntityType) {
  return ENTITY_ROUTES[entityType];
}

