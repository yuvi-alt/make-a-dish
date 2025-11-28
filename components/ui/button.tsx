"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: "primary" | "secondary" | "ghost" | "pill";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", asChild, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";

    const variants: Record<NonNullable<ButtonProps["variant"]>, string> = {
      primary:
        "bg-gradient-to-r from-brand-tangerine to-brand-honey text-white shadow-sm hover:brightness-110 focus-visible:ring-2 focus-visible:ring-brand-tangerine/60",
      secondary:
        "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 shadow-sm",
      ghost:
        "bg-transparent hover:bg-gray-100 text-gray-700 shadow-none",
      pill:
        "bg-brand-green text-white px-5 py-2 rounded-full hover:opacity-90 shadow-md",
    };

    return (
      <Comp
        className={cn(
          "inline-flex items-center justify-center font-medium rounded-md transition-all disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";

export { Button };
