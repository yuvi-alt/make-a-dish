"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  soleTraderSchema,
  type SoleTraderPayload,
} from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";
import {
  PREMISES_TYPE_OPTIONS,
  DAYS_OF_OPERATION_OPTIONS,
  BUSINESS_TYPE_OPTIONS,
  FOOD_SUPPLY_SCOPE_OPTIONS,
  FOOD_PROCESSING_METHODS_OPTIONS,
  WATER_SUPPLY_TYPE_OPTIONS,
} from "@/lib/form-options";
import { scrollToFirstError } from "@/lib/form-optimizations";

type SoleTraderFormProps = {
  registrationId: string;
  initialValues?: SoleTraderPayload | null;
};

export function SoleTraderForm({
  registrationId,
  initialValues,
}: SoleTraderFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<SoleTraderPayload>({
    resolver: zodResolver(soleTraderSchema),
    defaultValues: initialValues ?? {
      firstName: "",
      middleName: "",
      lastName: "",
      birthdate: "",
      mainPhoneNumber: "",
      secondaryPhoneNumber: "",
      emailAddress: "",
      postcode: "",
      tradingName: "",
      additionalTradingName: "",
      premisesType: "HOME_OR_DOMESTIC_PREMISES",
      establishmentMainPhoneNumber: "",
      establishmentSecondaryPhoneNumber: "",
      establishmentEmailAddress: "",
      webAddress: "",
      tradingStatus: false,
      tradingStartDate: "",
      expectedOpeningDate: "",
      daysOfOperation: "DAILY",
      operationStartTime: "",
      operationEndTime: "",
      businessType: "LOCAL_CUSTOMERS",
      foodSupplyScope: "READY_TO_EAT",
      foodProcessingMethods: [],
      waterSupplyType: "MAINS",
      otherDetails: "",
    },
  });

  // Use useWatch for better performance (only re-renders when this specific field changes)
  const tradingStatus = useWatch({
    control: form.control,
    name: "tradingStatus",
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  const errorSummary = useMemo(
    () => buildErrorSummary(form.formState.errors),
    [form.formState.errors],
  );

  // Scroll to first error when validation fails
  useEffect(() => {
    if (errorSummary.length > 0) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        scrollToFirstError(form.formState.errors);
      }, 100);
    }
  }, [errorSummary.length, form.formState.errors]);

  const onSubmit = useCallback(async (values: SoleTraderPayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "sole-trader",
        data: values,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.message ?? "Unable to save details.");
      // Scroll to error banner
      setTimeout(() => {
        const errorBanner = document.querySelector('[role="alert"]') as HTMLElement;
        if (errorBanner) {
          errorBanner.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
      return;
    }

    router.push("/register/review");
  }, [registrationId, router]);

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        noValidate
        onSubmit={form.handleSubmit(onSubmit, () => {
          // Handle validation errors - scrollToFirstError is called in useEffect
        })}
      >
        <ErrorSummary errors={errorSummary} />
        <FormErrorBanner message={serverError} />

        {/* Person Fields Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Personal Information</h2>
          
          <FormField
            control={form.control}
            name="firstName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="firstName">First Name</FormLabel>
                <FormControl>
                  <Input id="firstName" {...field} aria-invalid={!!fieldState.error} />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="middleName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="middleName">Middle Name (optional)</FormLabel>
                <FormControl>
                  <Input id="middleName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="lastName">Last Name</FormLabel>
                <FormControl>
                  <Input id="lastName" {...field} aria-invalid={!!fieldState.error} />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="birthdate"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="birthdate">Birthdate</FormLabel>
                <FormControl>
                  <Input
                    id="birthdate"
                    type="date"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="mainPhoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="mainPhoneNumber">Main Phone Number</FormLabel>
                <FormControl>
                  <Input
                    id="mainPhoneNumber"
                    type="tel"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. 07123456789"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="secondaryPhoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="secondaryPhoneNumber">Secondary Phone Number (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="secondaryPhoneNumber"
                    type="tel"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. 07123456789"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emailAddress"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="emailAddress">Email Address</FormLabel>
                <FormControl>
                  <Input
                    id="emailAddress"
                    type="email"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. example@email.com"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Business Location Fields Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Business Location</h2>
          
          <FormField
            control={form.control}
            name="postcode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="postcode">Postcode</FormLabel>
                <FormControl>
                  <Input
                    id="postcode"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    className="uppercase"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tradingName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="tradingName">Trading Name</FormLabel>
                <FormControl>
                  <Input id="tradingName" {...field} aria-invalid={!!fieldState.error} />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="additionalTradingName"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="additionalTradingName">Additional Trading Name (optional)</FormLabel>
                <FormControl>
                  <Input id="additionalTradingName" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="premisesType"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="premisesType">Premises Type</FormLabel>
                <FormControl>
                  <Select
                    id="premisesType"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  >
                    <option value="">Select premises type</option>
                    {PREMISES_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="establishmentMainPhoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="establishmentMainPhoneNumber">Establishment Main Phone Number (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="establishmentMainPhoneNumber"
                    type="tel"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. 07123456789"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="establishmentSecondaryPhoneNumber"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="establishmentSecondaryPhoneNumber">Establishment Secondary Phone Number (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="establishmentSecondaryPhoneNumber"
                    type="tel"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. 07123456789"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="establishmentEmailAddress"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="establishmentEmailAddress">Establishment Email Address (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="establishmentEmailAddress"
                    type="email"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="e.g. example@email.com"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="webAddress"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="webAddress">Web Address (optional)</FormLabel>
                <FormControl>
                  <Input
                    id="webAddress"
                    type="url"
                    {...field}
                    aria-invalid={!!fieldState.error}
                    placeholder="https://example.com"
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Trading Information Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Trading Information</h2>
          
          <FormField
            control={form.control}
            name="tradingStatus"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-3">
                  <FormControl>
                    <Checkbox
                      id="tradingStatus"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  </FormControl>
                  <FormLabel htmlFor="tradingStatus" className="!mt-0 cursor-pointer">
                    Trading Status (Yes/No)
                  </FormLabel>
                </div>
              </FormItem>
            )}
          />
          
          {tradingStatus && (
            <FormField
              control={form.control}
              name="tradingStartDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="tradingStartDate">Trading Start Date</FormLabel>
                  <FormControl>
                    <Input
                      id="tradingStartDate"
                      type="date"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                  ) : null}
                </FormItem>
              )}
            />
          )}
          
          {!tradingStatus && (
            <FormField
              control={form.control}
              name="expectedOpeningDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="expectedOpeningDate">Expected Opening Date</FormLabel>
                  <FormControl>
                    <Input
                      id="expectedOpeningDate"
                      type="date"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                  ) : null}
                </FormItem>
              )}
            />
          )}
        </div>

        {/* Days of Operation Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Days of Operation</h2>
          
          <FormField
            control={form.control}
            name="daysOfOperation"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="daysOfOperation">Days of Operation</FormLabel>
                <FormControl>
                  <Select
                    id="daysOfOperation"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  >
                    <option value="">Select days of operation</option>
                    {DAYS_OF_OPERATION_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Operation Times Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Operation Times</h2>
          
          <FormField
            control={form.control}
            name="operationStartTime"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="operationStartTime">Operation Start Time</FormLabel>
                <FormControl>
                  <Input
                    id="operationStartTime"
                    type="time"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="operationEndTime"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="operationEndTime">Operation End Time</FormLabel>
                <FormControl>
                  <Input
                    id="operationEndTime"
                    type="time"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  />
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Business Type Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Business Type</h2>
          
          <FormField
            control={form.control}
            name="businessType"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="businessType">Business Type</FormLabel>
                <FormControl>
                  <Select
                    id="businessType"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  >
                    <option value="">Select business type</option>
                    {BUSINESS_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Food Supply Scope Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Food Supply Scope</h2>
          
          <FormField
            control={form.control}
            name="foodSupplyScope"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="foodSupplyScope">Food Supply Scope</FormLabel>
                <FormControl>
                  <Select
                    id="foodSupplyScope"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  >
                    <option value="">Select food supply scope</option>
                    {FOOD_SUPPLY_SCOPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Food Processing Methods Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Food Processing Methods</h2>
          
          <FormField
            control={form.control}
            name="foodProcessingMethods"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Food Processing Methods (select all that apply)</FormLabel>
                <div className="space-y-3">
                  {FOOD_PROCESSING_METHODS_OPTIONS.map((option) => (
                    <div key={option.value} className="flex items-center gap-3">
                      <FormControl>
                        <Checkbox
                          checked={field.value?.includes(option.value)}
                          onChange={(e) => {
                            const currentValue = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValue, option.value]);
                            } else {
                              field.onChange(currentValue.filter((v) => v !== option.value));
                            }
                          }}
                        />
                      </FormControl>
                      <FormLabel className="!mt-0 cursor-pointer font-normal">
                        {option.label}
                      </FormLabel>
                    </div>
                  ))}
                </div>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Water Supply Type Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Water Supply Type</h2>
          
          <FormField
            control={form.control}
            name="waterSupplyType"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="waterSupplyType">Water Supply Type</FormLabel>
                <FormControl>
                  <Select
                    id="waterSupplyType"
                    {...field}
                    aria-invalid={!!fieldState.error}
                  >
                    <option value="">Select water supply type</option>
                    {WATER_SUPPLY_TYPE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                {fieldState.error ? (
                  <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
                ) : null}
              </FormItem>
            )}
          />
        </div>

        {/* Other Details Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Other Details</h2>
          
          <FormField
            control={form.control}
            name="otherDetails"
            render={({ field }) => (
              <FormItem>
                <FormLabel htmlFor="otherDetails">Other Details (optional)</FormLabel>
                <FormControl>
                  <textarea
                    id="otherDetails"
                    {...field}
                    rows={4}
                    className="block w-full rounded-2xl border border-brand-charcoal/15 bg-white/90 px-4 py-3 text-base text-brand-charcoal shadow-inner shadow-white/50 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/60"
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          disabled={form.formState.isSubmitting}
          className="w-full md:w-auto"
        >
          {form.formState.isSubmitting ? "Saving..." : "Save & Continue"}
        </Button>
      </form>
    </Form>
  );
}
