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
import {
  formatPremisesType,
  formatDaysOfOperation,
  formatBusinessType,
  formatFoodSupplyScope,
  formatFoodProcessingMethods,
  formatWaterSupplyType,
  formatTradingStatus,
  formatDate,
  formatTime,
} from "@/lib/review-helpers";

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
        if (!sole) return null;
        return {
          title: "Sole trader details",
          items: [
            // Person Fields
            { label: "First name", value: sole.firstName },
            { label: "Middle name", value: sole.middleName || undefined },
            { label: "Last name", value: sole.lastName },
            { label: "Birthdate", value: formatDate(sole.birthdate) },
            { label: "Main phone number", value: sole.mainPhoneNumber },
            { label: "Secondary phone number", value: sole.secondaryPhoneNumber && sole.secondaryPhoneNumber !== "+44" ? sole.secondaryPhoneNumber : undefined },
            { label: "Email address", value: sole.emailAddress },
            // Business Location Fields
            { label: "Postcode", value: sole.postcode },
            { label: "Trading name", value: sole.tradingName },
            { label: "Additional trading name", value: sole.additionalTradingName || undefined },
            { label: "Premises type", value: formatPremisesType(sole.premisesType) },
            { label: "Establishment main phone number", value: sole.establishmentMainPhoneNumber && sole.establishmentMainPhoneNumber !== "+44" ? sole.establishmentMainPhoneNumber : undefined },
            { label: "Establishment secondary phone number", value: sole.establishmentSecondaryPhoneNumber && sole.establishmentSecondaryPhoneNumber !== "+44" ? sole.establishmentSecondaryPhoneNumber : undefined },
            { label: "Establishment email address", value: sole.establishmentEmailAddress || undefined },
            { label: "Web address", value: sole.webAddress || undefined },
            // Trading Information
            { label: "Trading status", value: formatTradingStatus(sole.tradingStatus) },
            { label: "Trading start date", value: sole.tradingStatus ? formatDate(sole.tradingStartDate) : undefined },
            { label: "Expected opening date", value: !sole.tradingStatus ? formatDate(sole.expectedOpeningDate) : undefined },
            // Days of Operation
            { label: "Days of operation", value: formatDaysOfOperation(sole.daysOfOperation) },
            // Operation Times
            { label: "Operation start time", value: formatTime(sole.operationStartTime) },
            { label: "Operation end time", value: formatTime(sole.operationEndTime) },
            // Business Type
            { label: "Business type", value: formatBusinessType(sole.businessType) },
            // Food Supply Scope
            { label: "Food supply scope", value: formatFoodSupplyScope(sole.foodSupplyScope) },
            // Food Processing Methods
            { label: "Food processing methods", value: formatFoodProcessingMethods(sole.foodProcessingMethods) },
            // Water Supply Type
            { label: "Water supply type", value: formatWaterSupplyType(sole.waterSupplyType) },
            // Other Details
            { label: "Other details", value: sole.otherDetails || undefined },
          ].filter((item) => item.value !== undefined),
        };
      case "partnership":
        if (!partnership) return null;
        return {
          title: "Partnership details",
          items: [
            // Person Fields (Main Contact)
            { label: "First name", value: partnership.firstName },
            { label: "Middle name", value: partnership.middleName || undefined },
            { label: "Last name", value: partnership.lastName },
            { label: "Birthdate", value: formatDate(partnership.birthdate) },
            { label: "Main phone number", value: partnership.mainPhoneNumber },
            { label: "Secondary phone number", value: partnership.secondaryPhoneNumber && partnership.secondaryPhoneNumber !== "+44" ? partnership.secondaryPhoneNumber : undefined },
            { label: "Email address", value: partnership.emailAddress },
            // Partners
            {
              label: "Partners",
              value: partnership.partners
                ?.map((partner) => partner.name)
                .join(", "),
            },
            { label: "Main contact", value: partnership.mainContact },
            // Business Location Fields
            { label: "Postcode", value: partnership.postcode },
            { label: "Trading name", value: partnership.tradingName },
            { label: "Additional trading name", value: partnership.additionalTradingName || undefined },
            { label: "Premises type", value: formatPremisesType(partnership.premisesType) },
            { label: "Establishment main phone number", value: partnership.establishmentMainPhoneNumber && partnership.establishmentMainPhoneNumber !== "+44" ? partnership.establishmentMainPhoneNumber : undefined },
            { label: "Establishment secondary phone number", value: partnership.establishmentSecondaryPhoneNumber && partnership.establishmentSecondaryPhoneNumber !== "+44" ? partnership.establishmentSecondaryPhoneNumber : undefined },
            { label: "Establishment email address", value: partnership.establishmentEmailAddress || undefined },
            { label: "Web address", value: partnership.webAddress || undefined },
            // Trading Information
            { label: "Trading status", value: formatTradingStatus(partnership.tradingStatus) },
            { label: "Trading start date", value: partnership.tradingStatus ? formatDate(partnership.tradingStartDate) : undefined },
            { label: "Expected opening date", value: !partnership.tradingStatus ? formatDate(partnership.expectedOpeningDate) : undefined },
            // Days of Operation
            { label: "Days of operation", value: formatDaysOfOperation(partnership.daysOfOperation) },
            // Operation Times
            { label: "Operation start time", value: formatTime(partnership.operationStartTime) },
            { label: "Operation end time", value: formatTime(partnership.operationEndTime) },
            // Business Type
            { label: "Business type", value: formatBusinessType(partnership.businessType) },
            // Food Supply Scope
            { label: "Food supply scope", value: formatFoodSupplyScope(partnership.foodSupplyScope) },
            // Food Processing Methods
            { label: "Food processing methods", value: formatFoodProcessingMethods(partnership.foodProcessingMethods) },
            // Water Supply Type
            { label: "Water supply type", value: formatWaterSupplyType(partnership.waterSupplyType) },
            // Other Details
            { label: "Other details", value: partnership.otherDetails || undefined },
          ].filter((item) => item.value !== undefined),
        };
      case "limited-company":
        if (!limited) return null;
        return {
          title: "Limited company details",
          items: [
            // Company Fields
            { label: "Company name", value: limited.companyName },
            {
              label: "Companies House number",
              value: limited.companiesHouseNumber,
            },
            // Person Fields (Contact)
            { label: "First name", value: limited.firstName },
            { label: "Middle name", value: limited.middleName || undefined },
            { label: "Last name", value: limited.lastName },
            { label: "Birthdate", value: formatDate(limited.birthdate) },
            { label: "Main phone number", value: limited.mainPhoneNumber },
            { label: "Secondary phone number", value: limited.secondaryPhoneNumber && limited.secondaryPhoneNumber !== "+44" ? limited.secondaryPhoneNumber : undefined },
            { label: "Email address", value: limited.emailAddress },
            { label: "Contact name", value: limited.contactName },
            { label: "Role", value: limited.role || undefined },
            // Business Location Fields
            { label: "Postcode", value: limited.postcode },
            { label: "Trading name", value: limited.tradingName },
            { label: "Additional trading name", value: limited.additionalTradingName || undefined },
            { label: "Premises type", value: formatPremisesType(limited.premisesType) },
            { label: "Establishment main phone number", value: limited.establishmentMainPhoneNumber && limited.establishmentMainPhoneNumber !== "+44" ? limited.establishmentMainPhoneNumber : undefined },
            { label: "Establishment secondary phone number", value: limited.establishmentSecondaryPhoneNumber && limited.establishmentSecondaryPhoneNumber !== "+44" ? limited.establishmentSecondaryPhoneNumber : undefined },
            { label: "Establishment email address", value: limited.establishmentEmailAddress || undefined },
            { label: "Web address", value: limited.webAddress || undefined },
            // Trading Information
            { label: "Trading status", value: formatTradingStatus(limited.tradingStatus) },
            { label: "Trading start date", value: limited.tradingStatus ? formatDate(limited.tradingStartDate) : undefined },
            { label: "Expected opening date", value: !limited.tradingStatus ? formatDate(limited.expectedOpeningDate) : undefined },
            // Days of Operation
            { label: "Days of operation", value: formatDaysOfOperation(limited.daysOfOperation) },
            // Operation Times
            { label: "Operation start time", value: formatTime(limited.operationStartTime) },
            { label: "Operation end time", value: formatTime(limited.operationEndTime) },
            // Business Type
            { label: "Business type", value: formatBusinessType(limited.businessType) },
            // Food Supply Scope
            { label: "Food supply scope", value: formatFoodSupplyScope(limited.foodSupplyScope) },
            // Food Processing Methods
            { label: "Food processing methods", value: formatFoodProcessingMethods(limited.foodProcessingMethods) },
            // Water Supply Type
            { label: "Water supply type", value: formatWaterSupplyType(limited.waterSupplyType) },
            // Other Details
            { label: "Other details", value: limited.otherDetails || undefined },
          ].filter((item) => item.value !== undefined),
        };
      case "organisation":
        if (!organisation) return null;
        return {
          title: "Organisation details",
          items: [
            // Organisation Fields
            { label: "Trust name", value: organisation.trustName },
            {
              label: "Charity reference",
              value: organisation.charityReferenceNumber || undefined,
            },
            // Person Fields (Main Contact)
            { label: "First name", value: organisation.firstName },
            { label: "Middle name", value: organisation.middleName || undefined },
            { label: "Last name", value: organisation.lastName },
            { label: "Birthdate", value: formatDate(organisation.birthdate) },
            { label: "Main phone number", value: organisation.mainPhoneNumber },
            { label: "Secondary phone number", value: organisation.secondaryPhoneNumber && organisation.secondaryPhoneNumber !== "+44" ? organisation.secondaryPhoneNumber : undefined },
            { label: "Email address", value: organisation.emailAddress },
            // Business Location Fields
            { label: "Postcode", value: organisation.postcode },
            { label: "Trading name", value: organisation.tradingName },
            { label: "Additional trading name", value: organisation.additionalTradingName || undefined },
            { label: "Premises type", value: formatPremisesType(organisation.premisesType) },
            { label: "Establishment main phone number", value: organisation.establishmentMainPhoneNumber && organisation.establishmentMainPhoneNumber !== "+44" ? organisation.establishmentMainPhoneNumber : undefined },
            { label: "Establishment secondary phone number", value: organisation.establishmentSecondaryPhoneNumber && organisation.establishmentSecondaryPhoneNumber !== "+44" ? organisation.establishmentSecondaryPhoneNumber : undefined },
            { label: "Establishment email address", value: organisation.establishmentEmailAddress || undefined },
            { label: "Web address", value: organisation.webAddress || undefined },
            // Trading Information
            { label: "Trading status", value: formatTradingStatus(organisation.tradingStatus) },
            { label: "Trading start date", value: organisation.tradingStatus ? formatDate(organisation.tradingStartDate) : undefined },
            { label: "Expected opening date", value: !organisation.tradingStatus ? formatDate(organisation.expectedOpeningDate) : undefined },
            // Days of Operation
            { label: "Days of operation", value: formatDaysOfOperation(organisation.daysOfOperation) },
            // Operation Times
            { label: "Operation start time", value: formatTime(organisation.operationStartTime) },
            { label: "Operation end time", value: formatTime(organisation.operationEndTime) },
            // Business Type
            { label: "Business type", value: formatBusinessType(organisation.businessType) },
            // Food Supply Scope
            { label: "Food supply scope", value: formatFoodSupplyScope(organisation.foodSupplyScope) },
            // Food Processing Methods
            { label: "Food processing methods", value: formatFoodProcessingMethods(organisation.foodProcessingMethods) },
            // Water Supply Type
            { label: "Water supply type", value: formatWaterSupplyType(organisation.waterSupplyType) },
            // Other Details
            { label: "Other details", value: organisation.otherDetails || undefined },
          ].filter((item) => item.value !== undefined),
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
