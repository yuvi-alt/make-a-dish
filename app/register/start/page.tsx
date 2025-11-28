import { FormShell } from "@/components/form-shell";
import { PostcodeForm } from "@/components/forms/PostcodeForm";
import type { PostcodePayload } from "@/lib/schemas";
import { ensureRegistrationId } from "@/lib/registration";
import { getStepData } from "@/lib/s3";

export default async function StartPage() {
  const registrationId = await ensureRegistrationId();
  const existing = await getStepData<PostcodePayload>({
    registrationId,
    step: "postcode",
  });

  return (
    <FormShell
      title="Enter the postcode of your food business"
      description="We use your postcode to notify the correct local authority."
      currentStep="postcode"
    >
      <PostcodeForm registrationId={registrationId} initialValues={existing ?? undefined} />
    </FormShell>
  );
}

