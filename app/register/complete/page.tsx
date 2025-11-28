import Link from "next/link";
import { FormShell } from "@/components/form-shell";

export default function CompletePage() {
  return (
    <FormShell
      title="Registration submitted"
      description="We have sent your details to the local authority. They will be in touch if they need more information."
      currentStep="complete"
    >
      <div className="space-y-4">
        <p className="text-lg">
          A confirmation email will arrive shortly. You only need to register a
          food business once, unless any of your details change.
        </p>
        <p className="text-lg">
          Want to start a new registration?{" "}
          <Link
            href="/register/start"
            className="font-semibold text-brand-tangerine underline decoration-2 underline-offset-4"
          >
            Start again
          </Link>
          .
        </p>
      </div>
    </FormShell>
  );
}

