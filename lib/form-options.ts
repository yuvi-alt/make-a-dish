// Form dropdown options

export const PREMISES_TYPE_OPTIONS = [
  { value: "MOBILE_OR_MOVEABLE_PREMISES", label: "Mobile or Moveable Premises" },
  { value: "HOME_OR_DOMESTIC_PREMISES", label: "Home or Domestic Premises" },
  { value: "COMMERCIAL_OR_PUBLIC_PREMISES", label: "Commercial or Public Premises" },
] as const;

export const DAYS_OF_OPERATION_OPTIONS = [
  { value: "DAILY", label: "Daily" },
  { value: "PARTIAL_WEEK", label: "Partial Week" },
  { value: "SEASONAL", label: "Seasonal" },
] as const;

export const BUSINESS_TYPE_OPTIONS = [
  { value: "LOCAL_CUSTOMERS", label: "Local Customers" },
  { value: "NATIONAL_CUSTOMERS", label: "National Customers" },
  { value: "EXPORT_CUSTOMERS", label: "Export Customers" },
  { value: "ONLINE_SALES", label: "Online Sales" },
  { value: "B2B_SUPPLY", label: "B2B Supply" },
  { value: "VULNERABLE_GROUPS", label: "Vulnerable Groups" },
  { value: "HEALTHCARE_RESIDENTS", label: "Healthcare Residents" },
  { value: "NONE", label: "None" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

export const FOOD_SUPPLY_SCOPE_OPTIONS = [
  { value: "RAW_UNWRAPPED_PROTEINS", label: "Raw Unwrapped Proteins" },
  { value: "READY_TO_EAT", label: "Ready to Eat" },
  { value: "COOKED_REHEATED", label: "Cooked/Reheated" },
  { value: "IMPORTED_FOOD", label: "Imported Food" },
  { value: "NONE", label: "None" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

export const FOOD_PROCESSING_METHODS_OPTIONS = [
  { value: "VACUUM_PACKING", label: "Vacuum Packing" },
  { value: "SOUS_VIDE", label: "Sous Vide" },
  { value: "FERMENT_CURE", label: "Ferment/Cure" },
  { value: "PASTEURISATION", label: "Pasteurisation" },
  { value: "RAW_ANIMAL_FOODS", label: "Raw Animal Foods" },
  { value: "REWRAP_RELABEL", label: "Rewrap/Relabel" },
  { value: "NONE", label: "None" },
  { value: "UNKNOWN", label: "Unknown" },
] as const;

export const WATER_SUPPLY_TYPE_OPTIONS = [
  { value: "MAINS", label: "Mains" },
  { value: "PRIVATE", label: "Private" },
  { value: "BOTH", label: "Both" },
] as const;

