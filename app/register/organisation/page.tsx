import { redirect } from "next/navigation";
import { FormShell } from "@/components/form-shell";
import { OrganisationForm } from "@/components/forms/OrganisationForm";
import type {
  EntityTypePayload,
  OrganisationPayload,
} from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function OrganisationPage() {
  const registrationId = await requireRegistrationId();
  const entity = await getStepData<EntityTypePayload>({
    registrationId,
    step: "entity-type",
  });

  const entityType = entity?.entityType;

  if (entityType !== "organisation") {
    redirect("/register/legal-entity");
  }

  const existing = await getStepData<OrganisationPayload>({
    registrationId,
    step: "organisation",
  });

  return (
    <FormShell
      title="Organisation, charity or trust details"
      description="Provide the legal name we should use when corresponding with you."
      currentStep="details"
      entityType={entityType}
      backHref="/register/legal-entity"
    >
      <OrganisationForm
        registrationId={registrationId}
        initialValues={existing ?? undefined}
      />
    </FormShell>
  );
}

