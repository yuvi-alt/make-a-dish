"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  organisationSchema,
  type OrganisationPayload,
} from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

type OrganisationFormProps = {
  registrationId: string;
  initialValues?: OrganisationPayload | null;
};

export function OrganisationForm({
  registrationId,
  initialValues,
}: OrganisationFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<OrganisationPayload>({
    resolver: zodResolver(organisationSchema),
    defaultValues:
      initialValues ?? {
        trustName: "",
        charityReferenceNumber: "",
      },
  });

  useEffect(() => {
    if (initialValues) {
      form.reset(initialValues);
    }
  }, [initialValues, form]);

  const errorSummary = useMemo(
    () => buildErrorSummary(form.formState.errors),
    [form.formState.errors],
  );

  const onSubmit = async (values: OrganisationPayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "organisation",
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
        className="space-y-6"
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <ErrorSummary errors={errorSummary} />
        <FormErrorBanner message={serverError} />
        <FormField
          control={form.control}
          name="trustName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="trustName">Organisation name</FormLabel>
              <FormControl>
                <Input
                  id="trustName"
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
          name="charityReferenceNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="charityReferenceNumber">
                Charity reference number (optional)
              </FormLabel>
              <FormControl>
                <Input id="charityReferenceNumber" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

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

