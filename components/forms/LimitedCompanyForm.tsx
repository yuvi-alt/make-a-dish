"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  limitedCompanySchema,
  type LimitedCompanyPayload,
} from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

type LimitedCompanyFormProps = {
  registrationId: string;
  initialValues?: LimitedCompanyPayload | null;
};

export function LimitedCompanyForm({
  registrationId,
  initialValues,
}: LimitedCompanyFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<LimitedCompanyPayload>({
    resolver: zodResolver(limitedCompanySchema),
    defaultValues:
      initialValues ?? {
        companyName: "",
        companiesHouseNumber: "",
        contactName: "",
        role: "",
        phoneNumber: "",
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

  const onSubmit = async (values: LimitedCompanyPayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "limited-company",
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
          name="companyName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="companyName">
                Registered company name
              </FormLabel>
              <FormControl>
                <Input
                  id="companyName"
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
          name="companiesHouseNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="companiesHouseNumber">
                Companies House number
              </FormLabel>
              <FormControl>
                <Input
                  id="companiesHouseNumber"
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
          name="contactName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="contactName">Name of contact</FormLabel>
              <FormControl>
                <Input
                  id="contactName"
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
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor="role">Role (optional)</FormLabel>
              <FormControl>
                <Input id="role" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="companyPhone">Phone number</FormLabel>
              <FormControl>
                <Input
                  id="companyPhone"
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

