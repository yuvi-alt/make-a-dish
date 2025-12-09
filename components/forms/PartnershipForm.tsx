"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  partnershipSchema,
  type PartnershipPayload,
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

type PartnershipFormProps = {
  registrationId: string;
  initialValues?: PartnershipPayload | null;
};

export function PartnershipForm({
  registrationId,
  initialValues,
}: PartnershipFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<PartnershipPayload>({
    resolver: zodResolver(partnershipSchema),
    defaultValues:
      initialValues ?? {
        firstName: "",
        middleName: "",
        lastName: "",
        birthdate: "",
        mainPhoneNumber: "",
        secondaryPhoneNumber: "",
        emailAddress: "",
        partners: [{ name: "" }],
        mainContact: "",
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

  const fieldArray = useFieldArray({
    control: form.control,
    name: "partners",
  });

  const tradingStatus = form.watch("tradingStatus");

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const errorSummary = useMemo(
    () => buildErrorSummary(form.formState.errors),
    [form.formState.errors],
  );

  const onSubmit = async (values: PartnershipPayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "partnership",
        data: values,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.message ?? "Unable to save details.");
      return;
    }

    router.push("/register/review");
  };

  return (
    <Form {...form}>
      <form
        className="space-y-8"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ErrorSummary errors={errorSummary} />
        <FormErrorBanner message={serverError} />

        {/* Person Fields Section (Main Contact) */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Main Contact Information</h2>
          
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

        {/* Partners Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-brand-charcoal">Partner Names</h2>
          {fieldArray.fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`partners.${index}.name`}
              render={({ field: partnerField, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor={`partner-${index}`}>
                    Partner {index + 1}
                  </FormLabel>
                  <div className="flex gap-3">
                    <FormControl>
                      <Input
                        id={`partner-${index}`}
                        {...partnerField}
                        aria-invalid={!!fieldState.error}
                      />
                    </FormControl>
                    {fieldArray.fields.length > 1 ? (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => fieldArray.remove(index)}
                      >
                        Remove
                      </Button>
                    ) : null}
                  </div>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="secondary"
            onClick={() => fieldArray.append({ name: "" })}
          >
            Add another partner
          </Button>
        </div>

        <FormField
          control={form.control}
          name="mainContact"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="mainContact">
                Main point of contact
              </FormLabel>
              <FormControl>
                <Input
                  id="mainContact"
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

        {/* Business Location Fields Section */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-brand-charcoal">Business Location</h2>
          
          <FormField
            control={form.control}
            name="postcode"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel htmlFor="partnershipPostcode">Postcode</FormLabel>
                <FormControl>
                  <Input
                    id="partnershipPostcode"
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
                      onCheckedChange={(checked) => field.onChange(checked === true)}
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
                          onCheckedChange={(checked) => {
                            const currentValue = field.value || [];
                            if (checked) {
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
