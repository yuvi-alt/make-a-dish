import Link from "next/link";
import { StepIndicator } from "./step-indicator";
import type { ProgressStepKey } from "@/lib/steps";

type FormShellProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  currentStep: ProgressStepKey;
  entityType?: string;
  backHref?: string;
};

export function FormShell({
  title,
  description,
  children,
  currentStep,
  entityType,
  backHref,
}: FormShellProps) {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-12">
      <div className="grid gap-8 lg:grid-cols-[320px,1fr]">
        <div className="glass-surface h-fit rounded-[32px] bg-white/85 p-6">
          <StepIndicator currentStep={currentStep} entityType={entityType} />
        </div>
        <div className="space-y-6">
          <div className="glass-surface rounded-[32px] bg-white/90 p-8 shadow-brand">
            <div className="mb-8 space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-charcoal/60">
                Food business registration
              </p>
              <h1 className="text-3xl font-semibold text-brand-charcoal">{title}</h1>
              {description ? (
                <p className="text-lg text-brand-charcoal/70">{description}</p>
              ) : null}
            </div>
            {children}
          </div>
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-base font-semibold text-brand-charcoal/70 transition hover:text-brand-tangerine"
            >
              ← Back to previous step
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
}

