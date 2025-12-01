"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "pill";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-gradient-to-r from-brand-tangerine to-brand-honey text-white shadow-brand px-6 py-3 rounded-lg font-semibold hover:brightness-110 transition-all",

  secondary:
    "bg-white border border-gray-300 text-brand-charcoal px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all",

  ghost:
    "bg-transparent text-gray-800 hover:bg-gray-100 px-4 py-2 rounded-md",

  pill:
    "rounded-full bg-brand-tangerine text-white px-6 py-2 shadow hover:brightness-110",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
