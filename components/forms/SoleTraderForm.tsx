"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  soleTraderSchema,
  type SoleTraderPayload,
} from "@/lib/schemas";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

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
      postcode: "",
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

  const onSubmit = async (values: SoleTraderPayload) => {
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
          name="firstName"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="firstName">First name</FormLabel>
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
              <FormLabel htmlFor="middleName">Middle name (optional)</FormLabel>
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
              <FormLabel htmlFor="lastName">Last name</FormLabel>
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
              <FormLabel htmlFor="birthdate">Date of birth</FormLabel>
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
          name="postcode"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="solePostcode">Postcode</FormLabel>
              <FormControl>
                <Input
                  id="solePostcode"
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

