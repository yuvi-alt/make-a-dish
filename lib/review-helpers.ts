// Helper functions for formatting review page values

import {
  PREMISES_TYPE_OPTIONS,
  DAYS_OF_OPERATION_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  FOOD_SUPPLY_SCOPE_OPTIONS,
  FOOD_PROCESSING_METHODS_OPTIONS,
  WATER_SUPPLY_TYPE_OPTIONS,
} from "./form-options";

export function formatPremisesType(value?: string): string | undefined {
  if (!value) return undefined;
  return PREMISES_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

export function formatDaysOfOperation(value?: string): string | undefined {
  if (!value) return undefined;
  return DAYS_OF_OPERATION_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

export function formatBusinessType(value?: string): string | undefined {
  if (!value) return undefined;
  return BUSINESS_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

export function formatFoodSupplyScope(value?: string): string | undefined {
  if (!value) return undefined;
  return FOOD_SUPPLY_SCOPE_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

export function formatFoodProcessingMethods(values?: string[]): string | undefined {
  if (!values || values.length === 0) return undefined;
  return values
    .map((v) => FOOD_PROCESSING_METHODS_OPTIONS.find((opt) => opt.value === v)?.label ?? v)
    .join(", ");
}

export function formatWaterSupplyType(value?: string): string | undefined {
  if (!value) return undefined;
  return WATER_SUPPLY_TYPE_OPTIONS.find((opt) => opt.value === value)?.label ?? value;
}

export function formatTradingStatus(value?: boolean): string {
  return value ? "Yes" : "No";
}

export function formatDate(value?: string): string | undefined {
  if (!value) return undefined;
  try {
    return new Date(value).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return value;
  }
}

export function formatTime(value?: string): string | undefined {
  if (!value) return undefined;
  return value;
}

