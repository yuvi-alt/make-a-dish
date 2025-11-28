"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SubmitRegistrationButton({
  registrationId,
}: {
  registrationId: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    const response = await fetch("/api/register/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ registrationId }),
    });

    setIsSubmitting(false);

    if (!response.ok) {
      const payload = await response.json().catch(() => null);
      setError(payload?.message ?? "We could not submit the registration.");
      return;
    }

    router.push("/register/complete");
  };

  return (
    <div className="space-y-4">
      {error ? (
        <p className="rounded-2xl border border-[#F4B5A1] bg-[#FFF2EC] p-4 text-[#C2483C] shadow-brand-soft">
          {error}
        </p>
      ) : null}
      <Button
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting}
        className="w-full md:w-auto"
      >
        {isSubmitting ? "Submitting..." : "Submit registration"}
      </Button>
    </div>
  );
}

