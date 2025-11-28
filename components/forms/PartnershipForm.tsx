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
import { Button } from "@/components/ui/button";
import { ErrorSummary } from "@/components/error-summary";
import { buildErrorSummary } from "@/lib/form-errors";
import { FormErrorBanner } from "@/components/form-error-banner";

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
        partners: [{ name: "" }],
        mainContact: "",
        postcode: "",
        mainPhone: "",
        secondaryPhone: "",
      },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "partners",
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

  const onSubmit = async (values: PartnershipPayload) => {
    setServerError(null);
    const response = await fetch("/api/register/step", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationId,
        step: "partnership",
        data: {
          ...values,
          secondaryPhone: values.secondaryPhone || undefined,
        },
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

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-brand-charcoal">Partner names</h2>
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
          name="mainPhone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="mainPhone">Main phone number</FormLabel>
              <FormControl>
                <Input
                  id="mainPhone"
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
          name="secondaryPhone"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel htmlFor="secondaryPhone">
                Secondary phone number (optional)
              </FormLabel>
              <FormControl>
                <Input
                  id="secondaryPhone"
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

