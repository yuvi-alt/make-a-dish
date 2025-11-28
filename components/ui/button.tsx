import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "pill";
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild, ...props }, ref) => {
    const variants: Record<ButtonProps["variant"], string> = {
      primary:
        "bg-gradient-to-r from-brand-tangerine to-brand-honey text-white shadow-brand focus-visible:ring-2 focus-visible:ring-brand-tangerine/60 hover:brightness-110",
      secondary:
        "border border-brand-charcoal/15 bg-white text-brand-charcoal shadow-brand-soft hover:border-brand-charcoal/30",
      ghost:
        "text-brand-charcoal/70 hover:text-brand-tangerine hover:bg-brand-butter/40",
      pill:
        "rounded-full bg-brand-charcoal text-white px-7 shadow-lg hover:bg-brand-moss",
    };

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex min-h-[48px] items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all duration-200 focus-visible:outline-none",
          variants[variant],
          className,
        )}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

