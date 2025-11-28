import { FormShell } from "@/components/form-shell";
import { EntityTypeForm } from "@/components/forms/EntityTypeForm";
import type { EntityTypePayload } from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function LegalEntityPage() {
  const registrationId = await requireRegistrationId();
  const existing = await getStepData<EntityTypePayload>({
    registrationId,
    step: "entity-type",
  });

  return (
    <FormShell
      title="What type of food business are you registering?"
      description="Choose the description that best matches your legal entity."
      currentStep="entity-type"
      entityType={existing?.entityType}
      backHref="/register/start"
    >
      <EntityTypeForm
        registrationId={registrationId}
        initialValues={existing ?? undefined}
      />
    </FormShell>
  );
}

