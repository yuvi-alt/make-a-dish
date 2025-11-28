"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { postcodeSchema, type PostcodePayload } from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

type PostcodeFormProps = {
  registrationId: string;
  initialValues?: PostcodePayload | null;
};

type LookupState =
  | { status: "idle"; message?: string }
  | { status: "loading"; message?: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

export function PostcodeForm({
  registrationId,
  initialValues,
}: PostcodeFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [addressFieldsVisible, setAddressFieldsVisible] = useState(
    Boolean(initialValues?.addressLine1),
  );
  const [lookupState, setLookupState] = useState<LookupState>({
    status: "idle",
  });

  const defaultValues: PostcodePayload = {
    postcode: initialValues?.postcode ?? "",
    addressLine1: initialValues?.addressLine1 ?? "",
    addressLine2: initialValues?.addressLine2 ?? "",
    city: initialValues?.city ?? "",
    county: initialValues?.county ?? "",
    country: initialValues?.country ?? "United Kingdom",
  };

  const form = useForm<PostcodePayload>({
    resolver: zodResolver(postcodeSchema),
    defaultValues,
  });

  useEffect(() => {
    if (initialValues) {
      form.reset({
        postcode: initialValues.postcode ?? "",
        addressLine1: initialValues.addressLine1 ?? "",
        addressLine2: initialValues.addressLine2 ?? "",
        city: initialValues.city ?? "",
        county: initialValues.county ?? "",
        country: initialValues.country ?? "United Kingdom",
      });
      setAddressFieldsVisible(Boolean(initialValues.addressLine1));
    }
  }, [initialValues, form]);

  const errorSummary = useMemo(
    () => buildErrorSummary(form.formState.errors),
    [form.formState.errors],
  );

  const handleLookup = async () => {
    const rawPostcode = form.getValues("postcode").trim();
    if (!rawPostcode) {
      setLookupState({
        status: "error",
        message: "Enter a postcode before using the lookup.",
      });
      return;
    }

    setLookupState({ status: "loading" });
    try {
      const cleaned = rawPostcode.replace(/\s+/g, "");
      const response = await fetch(
        `https://api.postcodes.io/postcodes/${encodeURIComponent(cleaned)}`,
      );
      const payload = await response.json();
      if (!response.ok || !payload?.result) {
        throw new Error(payload?.error ?? "Lookup failed");
      }

      const result = payload.result as {
        parish?: string | null;
        admin_ward?: string | null;
        admin_district?: string | null;
        admin_county?: string | null;
        region?: string | null;
        post_town?: string | null;
        country?: string | null;
      };

      const line1 = result.parish ?? result.admin_ward ?? result.admin_district ?? "";
      const city = result.post_town ?? result.region ?? "";
      const county = result.admin_county ?? result.admin_district ?? result.region ?? "";
      const country = result.country ?? "United Kingdom";

      if (line1) {
        form.setValue("addressLine1", line1, { shouldDirty: true });
      }
      if (city) {
        form.setValue("city", city, { shouldDirty: true });
      }
      if (county) {
        form.setValue("county", county, { shouldDirty: true });
      }
      if (country) {
        form.setValue("country", country, { shouldDirty: true });
      }

      setAddressFieldsVisible(true);
      setLookupState({
        status: "success",
        message:
          "We filled in your address details. Please double-check everything looks right.",
      });
    } catch (error) {
      setAddressFieldsVisible(true);
      setLookupState({
        status: "error",
        message:
          "We couldn't find that postcode. Please enter your address manually.",
      });
    }
  };

  const onSubmit = async (values: PostcodePayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "postcode",
        data: values,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(payload?.message ?? "Unable to save postcode. Try again.");
      return;
    }

    router.push("/register/legal-entity");
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (!addressFieldsVisible) {
      event.preventDefault();
      setAddressFieldsVisible(true);
      setLookupState({
        status: "error",
        message: "Please confirm your address details before continuing.",
      });
      return;
    }

    return form.handleSubmit(onSubmit)(event);
  };

  return (
    <Form {...form}>
      <form className="space-y-6" noValidate onSubmit={handleFormSubmit}>
        <ErrorSummary errors={errorSummary} />
        <FormErrorBanner message={serverError} />
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
                  className="max-w-md uppercase"
                />
              </FormControl>
              {fieldState.error ? (
                <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
              ) : (
                <p className="text-sm text-brand-charcoal/70">
                  Enter the postcode of the business premises.
                </p>
              )}
            </FormItem>
          )}
        />
        <div className="space-y-3">
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant="secondary"
              className="w-full md:w-auto"
              onClick={handleLookup}
              disabled={lookupState.status === "loading"}
            >
              {lookupState.status === "loading" ? "Looking up..." : "Look up address"}
            </Button>
            {!addressFieldsVisible ? (
              <button
                type="button"
                className="text-sm font-semibold text-brand-charcoal/70 underline underline-offset-4"
                onClick={() => {
                  setAddressFieldsVisible(true);
                  setLookupState({
                    status: "success",
                    message: "Manual address entry enabled.",
                  });
                }}
              >
                Can&apos;t find your address? Enter it manually
              </button>
            ) : null}
          </div>
          {lookupState.status !== "idle" ? (
            <p
              className={
                lookupState.status === "error"
                  ? "text-sm text-[#C2483C]"
                  : "text-sm text-brand-charcoal/70"
              }
            >
              {lookupState.message}
            </p>
          ) : null}
        </div>

        {addressFieldsVisible ? (
          <div className="space-y-4 rounded-2xl border border-white/60 bg-white/80 p-6 shadow-brand-soft">
            <FormField
              control={form.control}
              name="addressLine1"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="addressLine1">Address line 1</FormLabel>
                  <FormControl>
                    <Input
                      id="addressLine1"
                      {...field}
                      aria-invalid={!!fieldState.error}
                    />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="addressLine2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="addressLine2">
                    Address line 2 (optional)
                  </FormLabel>
                  <FormControl>
                    <Input id="addressLine2" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="city">City / Town</FormLabel>
                  <FormControl>
                    <Input id="city" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="county"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="county">County / Region</FormLabel>
                  <FormControl>
                    <Input id="county" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel htmlFor="country">Country</FormLabel>
                  <FormControl>
                    <Input id="country" {...field} aria-invalid={!!fieldState.error} />
                  </FormControl>
                  {fieldState.error ? (
                    <p className="text-sm text-[#C2483C]">
                      {fieldState.error.message}
                    </p>
                  ) : null}
                </FormItem>
              )}
            />
          </div>
        ) : null}

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

