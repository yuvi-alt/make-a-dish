import React from "react";
import { cn } from "@/lib/utils";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  asChild?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild, ...props }, ref) => {
    
    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-gradient-to-r from-brand-tangerine to-brand-honey text-white shadow-brand focus-visible:ring-2 focus-visible:ring-brand-tangerine/60 hover:brightness-110",
      secondary:
        "bg-white text-brand-dark border border-brand-soft shadow-sm hover:bg-brand-soft/20",
      ghost:
        "text-brand-dark hover:bg-brand-soft/20",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "px-4 py-2 rounded-xl font-medium transition-all duration-200",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
