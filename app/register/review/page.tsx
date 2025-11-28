import { redirect } from "next/navigation";
import { FormShell } from "@/components/form-shell";
import { ReviewCard } from "@/components/review-card";
import { SubmitRegistrationButton } from "@/components/submit-registration-button";
import {
  type EntityTypePayload,
  type LimitedCompanyPayload,
  type OrganisationPayload,
  type PartnershipPayload,
  type PostcodePayload,
  type SoleTraderPayload,
} from "@/lib/schemas";
import { requireRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";
import { getDetailsRoute } from "@/lib/steps";

export default async function ReviewPage() {
  const registrationId = await requireRegistrationId();
  const [postcode, entity, sole, partnership, limited, organisation] =
    await Promise.all([
      getStepData<PostcodePayload>({ registrationId, step: "postcode" }),
      getStepData<EntityTypePayload>({ registrationId, step: "entity-type" }),
      getStepData<SoleTraderPayload>({ registrationId, step: "sole-trader" }),
      getStepData<PartnershipPayload>({
        registrationId,
        step: "partnership",
      }),
      getStepData<LimitedCompanyPayload>({
        registrationId,
        step: "limited-company",
      }),
      getStepData<OrganisationPayload>({
        registrationId,
        step: "organisation",
      }),
    ]);

  if (!entity) {
    redirect("/register/legal-entity");
  }

  const detailRoute = getDetailsRoute(entity.entityType);

  const detailContent = (() => {
    switch (entity.entityType) {
      case "sole-trader":
        return {
          title: "Sole trader details",
          items: [
            { label: "First name", value: sole?.firstName },
            { label: "Middle name", value: sole?.middleName },
            { label: "Last name", value: sole?.lastName },
            { label: "Date of birth", value: sole?.birthdate },
            { label: "Postcode", value: sole?.postcode },
          ],
        };
      case "partnership":
        return {
          title: "Partnership details",
          items: [
            {
              label: "Partners",
              value: partnership?.partners
                ?.map((partner) => partner.name)
                .join(", "),
            },
            { label: "Main contact", value: partnership?.mainContact },
            { label: "Postcode", value: partnership?.postcode },
            { label: "Main phone", value: partnership?.mainPhone },
            {
              label: "Secondary phone",
              value: partnership?.secondaryPhone,
            },
          ],
        };
      case "limited-company":
        return {
          title: "Limited company details",
          items: [
            { label: "Company name", value: limited?.companyName },
            {
              label: "Companies House number",
              value: limited?.companiesHouseNumber,
            },
            { label: "Contact name", value: limited?.contactName },
            { label: "Role", value: limited?.role },
            { label: "Phone number", value: limited?.phoneNumber },
          ],
        };
      case "organisation":
        return {
          title: "Organisation details",
          items: [
            { label: "Trust name", value: organisation?.trustName },
            {
              label: "Charity reference",
              value: organisation?.charityReferenceNumber,
            },
          ],
        };
      default:
        return null;
    }
  })();

  return (
    <FormShell
      title="Check your answers before submitting"
      description="Review each section carefully and make changes if something needs updating."
      currentStep="review"
      entityType={entity.entityType}
      backHref={detailRoute}
    >
      <div className="space-y-6">
        <ReviewCard
          title="Business location"
          changeHref="/register/start"
          items={[
            { label: "Postcode", value: postcode?.postcode },
            { label: "Address line 1", value: postcode?.addressLine1 },
            { label: "Address line 2", value: postcode?.addressLine2 },
            { label: "City / Town", value: postcode?.city },
            { label: "County / Region", value: postcode?.county },
            { label: "Country", value: postcode?.country },
          ]}
        />
        <ReviewCard
          title="Legal entity"
          changeHref="/register/legal-entity"
          items={[{ label: "Entity type", value: entity.entityType }]}
        />
        {detailContent ? (
          <ReviewCard
            title={detailContent.title}
            changeHref={detailRoute}
            items={detailContent.items}
          />
        ) : null}
        <SubmitRegistrationButton registrationId={registrationId} />
      </div>
    </FormShell>
  );
}

