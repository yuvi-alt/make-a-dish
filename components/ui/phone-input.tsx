"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export type PhoneInputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type" | "value" | "onChange"
> & {
  value?: string;
  onChange?: (value: string) => void;
};

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, onBlur, onFocus, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [cursorPosition, setCursorPosition] = React.useState<number | null>(null);

    // Ensure value always starts with +44
    const normalizedValue = React.useMemo(() => {
      if (!value || value === "") return "+44";
      if (value.startsWith("+44")) {
        // Ensure only digits after +44
        const digitsAfter = value.substring(3).replace(/\D/g, "");
        return `+44${digitsAfter}`;
      }
      // Auto-format: if starts with 07, convert to +447
      if (value.startsWith("07")) {
        const digits = value.substring(1).replace(/\D/g, "");
        return `+44${digits}`;
      }
      // If starts with 0, remove it and add +44
      if (value.startsWith("0")) {
        const digits = value.substring(1).replace(/\D/g, "");
        return `+44${digits}`;
      }
      // If starts with + but not +44, extract digits and add +44
      if (value.startsWith("+")) {
        const digits = value.substring(1).replace(/\D/g, "");
        return `+44${digits}`;
      }
      // Otherwise, extract digits and add +44 prefix
      const digits = value.replace(/\D/g, "");
      return `+44${digits}`;
    }, [value]);

    // Extract digits after +44 for display
    const digitsAfterPrefix = normalizedValue.substring(3).replace(/\D/g, "");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const cursorPos = e.target.selectionStart || 0;

      // If user tries to delete +44, prevent it
      if (inputValue.length < 3 || !inputValue.startsWith("+44")) {
        // Restore +44 and keep cursor position
        if (onChange) {
          onChange("+44" + digitsAfterPrefix);
        }
        // Set cursor position after +44
        setTimeout(() => {
          if (inputRef.current) {
            const newPos = Math.min(3 + digitsAfterPrefix.length, 3 + cursorPos - 3);
            inputRef.current.setSelectionRange(newPos, newPos);
          }
        }, 0);
        return;
      }

      // Extract only digits after +44
      const newDigits = inputValue.substring(3).replace(/\D/g, "");
      
      // Limit to 11 digits (UK numbers are typically 10-11 digits after country code)
      const limitedDigits = newDigits.substring(0, 11);
      
      const newValue = `+44${limitedDigits}`;
      
      if (onChange) {
        onChange(newValue);
      }

      // Maintain cursor position
      setTimeout(() => {
        if (inputRef.current) {
          const newPos = Math.min(3 + limitedDigits.length, 3 + Math.max(0, cursorPos - 3));
          inputRef.current.setSelectionRange(newPos, newPos);
        }
      }, 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      const input = e.currentTarget;
      const cursorPos = input.selectionStart || 0;

      // Prevent deletion of +44 prefix
      if (cursorPos <= 3) {
        if (
          e.key === "Backspace" ||
          e.key === "Delete" ||
          (e.key === "ArrowLeft" && e.shiftKey)
        ) {
          e.preventDefault();
          // Move cursor to after +44
          setTimeout(() => {
            input.setSelectionRange(3, 3);
          }, 0);
        }
      }

      // Prevent typing non-digits after +44
      if (cursorPos >= 3 && !/[0-9]/.test(e.key) && !["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab", "Home", "End"].includes(e.key)) {
        if (!e.ctrlKey && !e.metaKey) {
          e.preventDefault();
        }
      }
    };

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      // Move cursor to after +44 when focused
      setTimeout(() => {
        if (inputRef.current) {
          const pos = Math.max(3, inputRef.current.selectionStart || 3);
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
      onFocus?.(e);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedText = e.clipboardData.getData("text");
      
      // Extract digits from pasted text
      const digits = pastedText.replace(/\D/g, "");
      
      // If pasted text starts with +44, use it; otherwise add +44
      let newValue = "";
      if (pastedText.startsWith("+44")) {
        const afterPrefix = pastedText.substring(3).replace(/\D/g, "");
        newValue = `+44${afterPrefix.substring(0, 11)}`;
      } else if (pastedText.startsWith("07")) {
        // Auto-format UK mobile
        newValue = `+44${pastedText.substring(1).replace(/\D/g, "").substring(0, 10)}`;
      } else if (pastedText.startsWith("0")) {
        // Auto-format UK landline
        newValue = `+44${pastedText.substring(1).replace(/\D/g, "").substring(0, 11)}`;
      } else {
        // Just digits, add +44
        newValue = `+44${digits.substring(0, 11)}`;
      }
      
      if (onChange) {
        onChange(newValue);
      }
      
      // Set cursor to end
      setTimeout(() => {
        if (inputRef.current) {
          const pos = newValue.length;
          inputRef.current.setSelectionRange(pos, pos);
        }
      }, 0);
    };

    // Combine refs
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    return (
      <div className="relative">
        <input
          ref={inputRef}
          type="tel"
          inputMode="numeric"
          className={cn(
            "block w-full rounded-2xl border border-brand-charcoal/15 bg-white/90 px-4 py-3 text-base text-brand-charcoal shadow-inner shadow-white/50 focus:border-brand-tangerine focus:outline-none focus:ring-2 focus:ring-brand-peach/60",
            className,
          )}
          value={normalizedValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={onBlur}
          onPaste={handlePaste}
          {...props}
        />
      </div>
    );
  },
);
PhoneInput.displayName = "PhoneInput";

