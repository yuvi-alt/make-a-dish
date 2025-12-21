import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type SectionProps = {
  id?: string;
  eyebrow?: string;
  heading: string;
  description?: string;
  className?: string;
  children?: ReactNode;
};

export function MarketingSection({
  id,
  eyebrow,
  heading,
  description,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "mx-auto max-w-7xl px-4 py-14 md:px-8 md:py-20",
        className,
      )}
    >
      <div className="space-y-4">
        {eyebrow ? (
          <p className="inline-flex rounded-full bg-brand-butter/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal/70">
            {eyebrow}
          </p>
        ) : null}
        <h2 className="section-heading">{heading}</h2>
        {description ? <p className="section-lead">{description}</p> : null}
      </div>
      <div className="mt-10">{children}</div>
    </section>
  );
}

type InfoCardProps = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent?: "peach" | "green" | "cream";
};

const accentMap: Record<NonNullable<InfoCardProps["accent"]>, string> = {
  peach: "from-brand-peach/70 to-brand-butter/80 text-brand-charcoal",
  green: "from-brand-sprout/30 to-brand-mint/80 text-brand-charcoal",
  cream: "from-white to-brand-warm-white text-brand-charcoal",
};

export function InfoCard({
  title,
  description,
  icon: Icon,
  accent = "cream",
}: InfoCardProps) {
  return (
    <div className="glass-surface flex flex-col gap-4 p-6">
      <div
        className={cn(
          "inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br shadow-brand-soft",
          accentMap[accent],
        )}
      >
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-xl font-semibold text-brand-charcoal">{title}</h3>
      <p className="text-base text-brand-charcoal/70">{description}</p>
    </div>
  );
}

