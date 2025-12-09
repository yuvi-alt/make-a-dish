import * as React from "react";
import { cn } from "@/lib/utils";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          "block w-full rounded-2xl border border-brand-charcoal/15 bg-white/90 px-4 py-3 text-base text-brand-charcoal shadow-inner shadow-white/50 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/60",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

