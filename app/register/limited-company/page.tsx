import { redirect } from "next/navigation";
import { FormShell } from "@/components/form-shell";
import { LimitedCompanyForm } from "@/components/forms/LimitedCompanyForm";
import type {
  EntityTypePayload,
  LimitedCompanyPayload,
} from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function LimitedCompanyPage() {
  const registrationId = await requireRegistrationId();
  const entity = await getStepData<EntityTypePayload>({
    registrationId,
    step: "entity-type",
  });

  const entityType = entity?.entityType;

  if (entityType !== "limited-company") {
    redirect("/register/legal-entity");
  }

  const existing = await getStepData<LimitedCompanyPayload>({
    registrationId,
    step: "limited-company",
  });

  return (
    <FormShell
      title="Give the limited company details"
      description="We cross-check your details with Companies House where possible."
      currentStep="details"
      entityType={entityType}
      backHref="/register/legal-entity"
    >
      <LimitedCompanyForm
        registrationId={registrationId}
        initialValues={existing ?? undefined}
      />
    </FormShell>
  );
}

