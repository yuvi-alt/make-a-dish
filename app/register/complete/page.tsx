"use client";

import { useRouter } from "next/navigation";
import { FormShell } from "@/components/form-shell";

export default function CompletePage() {
  const router = useRouter();

  const handleStartAgain = () => {
    // Force a full page reload to bypass Next.js client-side cache
    window.location.href = "/register/start/init";
  };

  return (
    <FormShell
      title="Registration successful — please log in to publish your dishes."
      description="We have sent your details to the local authority. They will be in touch if they need more information."
      currentStep="complete"
    >
      <div className="space-y-4">
        <p className="text-lg">
          A confirmation email will arrive shortly. Once you log in, you can start publishing your dishes and connecting with customers.
        </p>
        <p className="text-lg">
          Want to start a new registration?{" "}
          <button
            onClick={handleStartAgain}
            className="font-semibold text-brand-tangerine underline decoration-2 underline-offset-4 cursor-pointer bg-transparent border-none p-0"
          >
            Start again
          </button>
          .
        </p>
      </div>
    </FormShell>
  );
}

