"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

const fieldBase = [
  "w-full rounded-xl bg-white/[0.04] border border-white/10 px-4 text-sm text-foreground",
  "placeholder:text-muted/60 transition-all duration-300",
  "hover:border-white/20 focus:border-gold/60 focus:bg-white/[0.06]",
  "focus:outline-none focus:ring-2 focus:ring-gold/25",
  "disabled:opacity-50 disabled:cursor-not-allowed",
].join(" ");

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn(fieldBase, "h-12", className)} {...props} />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(fieldBase, "min-h-28 py-3 resize-y", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(fieldBase, "h-12 appearance-none pr-10 [&>option]:bg-surface", className)}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";

export function Label({
  className,
  children,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-xs text-flame-red">
      {message}
    </p>
  );
}
