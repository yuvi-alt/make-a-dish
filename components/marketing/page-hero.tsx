import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type PageHeroProps = {
  eyebrow?: string;
  title: string;
  description: string;
  className?: string;
  children?: ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  description,
  className,
  children,
}: PageHeroProps) {
  return (
    <section
      className={cn(
        "mx-auto grid max-w-7xl gap-8 px-4 py-12 text-brand-charcoal md:px-8",
        className,
      )}
    >
      <div className="space-y-4">
        {eyebrow ? (
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand-charcoal/60">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="font-display text-4xl font-semibold">{title}</h1>
        <p className="text-lg text-brand-charcoal/75">{description}</p>
      </div>
      {children ? <div>{children}</div> : null}
    </section>
  );
}

