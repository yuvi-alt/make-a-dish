import { redirect } from "next/navigation";
import { FormShell } from "@/components/form-shell";
import { PartnershipForm } from "@/components/forms/PartnershipForm";
import type {
  EntityTypePayload,
  PartnershipPayload,
} from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function PartnershipPage() {
  const registrationId = await requireRegistrationId();
  const entity = await getStepData<EntityTypePayload>({
    registrationId,
    step: "entity-type",
  });

  const entityType = entity?.entityType;

  if (entityType !== "partnership") {
    redirect("/register/legal-entity");
  }

  const existing = await getStepData<PartnershipPayload>({
    registrationId,
    step: "partnership",
  });

  return (
    <FormShell
      title="Tell us about the partnership"
      description="Provide partner names and a main contact for the business."
      currentStep="details"
      entityType={entityType}
      backHref="/register/legal-entity"
    >
      <PartnershipForm
        registrationId={registrationId}
        initialValues={existing ?? undefined}
      />
    </FormShell>
  );
}

