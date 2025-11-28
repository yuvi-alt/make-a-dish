import { redirect } from "next/navigation";
import { FormShell } from "@/components/form-shell";
import { SoleTraderForm } from "@/components/forms/SoleTraderForm";
import type {
  EntityTypePayload,
  SoleTraderPayload,
} from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function SoleTraderPage() {
  const registrationId = await requireRegistrationId();
  const entity = await getStepData<EntityTypePayload>({
    registrationId,
    step: "entity-type",
  });

  const entityType = entity?.entityType;

  if (entityType !== "sole-trader") {
    redirect("/register/legal-entity");
  }

  const existing = await getStepData<SoleTraderPayload>({
    registrationId,
    step: "sole-trader",
  });

  return (
    <FormShell
      title="Tell us about the sole trader"
      description="We need the legal name of the person responsible for the business."
      currentStep="details"
      entityType={entityType}
      backHref="/register/legal-entity"
    >
      <SoleTraderForm
        registrationId={registrationId}
        initialValues={existing ?? undefined}
      />
    </FormShell>
  );
}

