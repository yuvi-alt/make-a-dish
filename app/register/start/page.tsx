import { FormShell } from "@/components/form-shell";
import { PostcodeForm } from "@/components/forms/PostcodeForm";
import type { PostcodePayload } from "@/lib/schemas";
import { ensureRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

// Force dynamic rendering to prevent stale cache when "Start Again" is clicked
export const dynamic = "force-dynamic";

export default async function StartPage() {
  const registrationId = await ensureRegistrationId();
  const existing = await getStepData<PostcodePayload>({
    registrationId,
    step: "postcode",
  });

  return (
    <FormShell
      title="Enter your address"
      description="Search for your business address using Google Places lookup."
      currentStep="postcode"
    >
      <PostcodeForm registrationId={registrationId} initialValues={existing ?? undefined} />
    </FormShell>
  );
}

