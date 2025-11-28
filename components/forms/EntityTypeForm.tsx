"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  entityTypeSchema,
  type EntityTypePayload,
} from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { ENTITY_OPTIONS, getDetailsRoute } from "@/lib/steps";
import { FormErrorBanner } from "@/components/form-error-banner";

type EntityTypeFormProps = {
  registrationId: string;
  initialValues?: EntityTypePayload | null;
};

export function EntityTypeForm({
  registrationId,
  initialValues,
}: EntityTypeFormProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const form = useForm<EntityTypePayload>({
    resolver: zodResolver(entityTypeSchema),
    defaultValues: initialValues ?? { entityType: "" as never },
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

  const onSubmit = async (values: EntityTypePayload) => {
    setServerError(null);

    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "entity-type",
        data: values,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setServerError(
        payload?.message ?? "Unable to save your entity type. Try again.",
      );
      return;
    }

    router.push(getDetailsRoute(values.entityType));
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
          name="entityType"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="entityType">Legal entity type</FormLabel>
              <FormControl>
                <select
                  id="entityType"
                  {...field}
                  className="mt-2 w-full rounded-2xl border border-brand-charcoal/15 bg-white/90 px-4 py-3 text-base text-brand-charcoal shadow-inner focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/60"
                  aria-invalid={!!fieldState.error}
                >
                  <option value="">Select an option</option>
                  {ENTITY_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormControl>
              {fieldState.error ? (
                <p className="text-sm text-[#C2483C]">{fieldState.error.message}</p>
              ) : (
                <p className="text-sm text-brand-charcoal/70">
                  This determines which questions we show next.
                </p>
              )}
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

