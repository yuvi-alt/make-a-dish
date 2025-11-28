import { MapPin, Building2, NotebookPen, CheckCircle2, PartyPopper } from "lucide-react";
import { PROGRESS_STEPS, getDetailsLabel, type ProgressStepKey } from "@/lib/steps";
import { cn } from "@/lib/utils";

const stepIcons: Record<ProgressStepKey, typeof MapPin> = {
  postcode: MapPin,
  "entity-type": Building2,
  details: NotebookPen,
  review: CheckCircle2,
  complete: PartyPopper,
};

type StepIndicatorProps = {
  currentStep: ProgressStepKey;
  entityType?: string;
};

export function StepIndicator({
  currentStep,
  entityType,
}: StepIndicatorProps) {
  const currentIndex = PROGRESS_STEPS.findIndex((step) => step.key === currentStep);
  const rawProgress = (currentIndex / (PROGRESS_STEPS.length - 1)) * 100;
  const progress = Number.isFinite(rawProgress) ? Math.max(rawProgress, 0) : 0;

  return (
    <nav aria-label="Progress" className="space-y-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-charcoal/60">
          Your progress
        </p>
        <div className="mt-3 h-2 rounded-full bg-brand-cream">
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-tangerine to-brand-honey transition-all"
            style={{ width: `${Math.max(8, progress)}%` }}
          />
        </div>
      </div>
      <ol className="space-y-4">
        {PROGRESS_STEPS.map((step, index) => {
          const Icon = stepIcons[step.key];
          const isActive = step.key === currentStep;
          const isComplete = index < currentIndex;

          return (
            <li
              key={step.key}
              className={cn(
                "flex items-center gap-4 rounded-2xl border border-transparent p-3 transition",
                isActive
                  ? "border-brand-tangerine/40 bg-brand-butter/40 shadow-brand-soft"
                  : "bg-white/80",
              )}
            >
              <div
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-2xl text-brand-charcoal shadow-brand-soft",
                  isActive
                    ? "bg-brand-peach/70"
                    : isComplete
                      ? "bg-brand-sprout/30 text-brand-moss"
                      : "bg-brand-cream",
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-charcoal/60">
                  Step {index + 1}
                </p>
                <p
                  className={cn(
                    "text-base font-semibold text-brand-charcoal",
                    isActive && "text-brand-tangerine",
                  )}
                >
                  {step.key === "details"
                    ? getDetailsLabel(entityType)
                    : step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

