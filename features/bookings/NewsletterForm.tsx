"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, FieldError } from "@/components/ui/form-fields";
import { newsletterSchema, type NewsletterFormValues } from "@/lib/validation";
import { cn } from "@/lib/utils";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({ resolver: zodResolver(newsletterSchema) });

  const mutation = useMutation({
    mutationFn: async (values: NewsletterFormValues) => {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("Subscription failed");
      return res.json();
    },
    onSuccess: () => reset(),
  });

  if (mutation.isSuccess) {
    return (
      <p
        role="status"
        className="flex items-center gap-2 text-sm text-gold-light"
      >
        <CheckCircle2 className="size-4" aria-hidden />
        Welcome to the inner circle — check your inbox.
      </p>
    );
  }

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className={cn("w-full", compact ? "" : "mx-auto max-w-md")}
      noValidate
    >
      <div className="flex gap-2">
        <div className="flex-1">
          <label htmlFor={compact ? "newsletter-email-footer" : "newsletter-email"} className="sr-only">
            Email address
          </label>
          <Input
            id={compact ? "newsletter-email-footer" : "newsletter-email"}
            type="email"
            placeholder="Your email address"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </div>
        <Button
          type="submit"
          size={compact ? "icon" : "default"}
          disabled={mutation.isPending}
          aria-label="Subscribe to the newsletter"
        >
          {compact ? <Send className="size-4" aria-hidden /> : "Subscribe"}
        </Button>
      </div>
      <FieldError message={errors.email?.message} />
      {mutation.isError ? (
        <p role="alert" className="mt-2 text-xs text-flame-red">
          Something went wrong — please try again.
        </p>
      ) : null}
    </form>
  );
}
