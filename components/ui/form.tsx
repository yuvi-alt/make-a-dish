import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import {
  Controller,
  FormProvider,
  useFormContext,
  type ControllerProps,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

const Form = FormProvider;

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>(
  props: ControllerProps<TFieldValues, TName>,
) => <Controller {...props} />;

const FormItemContext = React.createContext<{ id: string } | undefined>(
  undefined,
);

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const id = React.useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    </FormItemContext.Provider>
  );
});
FormItem.displayName = "FormItem";

const useFormItemContext = () => {
  const ctx = React.useContext(FormItemContext);
  if (!ctx) {
    throw new Error("useFormItemContext must be used within <FormItem>");
  }
  return ctx;
};

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, htmlFor, ...props }, ref) => {
  const { id } = useFormItemContext();
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn("block text-base font-semibold text-brand-charcoal", className)}
      htmlFor={htmlFor ?? id}
      {...props}
    />
  );
});
FormLabel.displayName = "FormLabel";

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ id, ...props }, ref) => {
  const context = useFormItemContext();
  const controlId = id ?? context.id;
  return <Slot ref={ref} id={controlId} {...props} />;
});
FormControl.displayName = "FormControl";

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-brand-charcoal/65", className)}
    {...props}
  />
));
FormDescription.displayName = "FormDescription";

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { id } = useFormItemContext();
  const { formState } = useFormContext();
  const error = formState.errors[id as keyof typeof formState.errors];
  const message =
    typeof error === "object" && error && "message" in error
      ? (error as { message?: string }).message
      : undefined;

  return (
    <p
      ref={ref}
      className={cn("text-sm text-[#C2483C]", className)}
      {...props}
    >
      {message ?? children}
    </p>
  );
});
FormMessage.displayName = "FormMessage";

export {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
};

