"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { CreditCard, Lock, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form-fields";
import { ticketOrderSchema, type TicketOrderFormValues } from "@/lib/validation";
import { formatZAR } from "@/lib/utils";
import type { PaystackInitResponse, RestaurantEvent } from "@/types";

async function initializePayment(
  values: TicketOrderFormValues,
): Promise<PaystackInitResponse> {
  const res = await fetch("/api/paystack/initialize", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Payment initialization failed");
  return body;
}

export function TicketCheckout({ event }: { event: RestaurantEvent }) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<TicketOrderFormValues>({
    resolver: zodResolver(ticketOrderSchema),
    defaultValues: { eventSlug: event.slug, quantity: 2 },
  });

  const quantity = watch("quantity") ?? 1;
  const total = event.price * quantity;

  const mutation = useMutation({
    mutationFn: initializePayment,
    onSuccess: (data) => {
      // Hand over to Paystack's hosted checkout (or the demo success page).
      window.location.href = data.authorizationUrl;
    },
  });

  const bump = (delta: number) => {
    const next = Math.min(10, Math.max(1, Number(quantity) + delta));
    setValue("quantity", next, { shouldValidate: true });
  };

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="gold-ring rounded-3xl p-7 md:p-9"
      aria-label={`Buy tickets for ${event.title}`}
      noValidate
    >
      <input type="hidden" {...register("eventSlug")} />

      <h2 className="font-heading text-2xl text-foreground">Secure Your Seats</h2>

      {/* Quantity */}
      <div className="mt-6">
        <Label htmlFor="ticket-quantity">Tickets</Label>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => bump(-1)}
            aria-label="One ticket fewer"
            className="glass flex size-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-all hover:border-gold/40 hover:text-gold-light"
          >
            <Minus className="size-4" aria-hidden />
          </button>
          <Input
            id="ticket-quantity"
            type="number"
            min={1}
            max={10}
            className="w-20 text-center"
            aria-invalid={Boolean(errors.quantity)}
            {...register("quantity", { valueAsNumber: true })}
          />
          <button
            type="button"
            onClick={() => bump(1)}
            aria-label="One ticket more"
            className="glass flex size-11 cursor-pointer items-center justify-center rounded-full text-foreground transition-all hover:border-gold/40 hover:text-gold-light"
          >
            <Plus className="size-4" aria-hidden />
          </button>
          <span className="ml-auto text-sm text-muted">
            {event.availableSeats} seats left
          </span>
        </div>
        <FieldError message={errors.quantity?.message} />
      </div>

      {/* Details */}
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <Label htmlFor="ticket-name">Name</Label>
          <Input
            id="ticket-name"
            autoComplete="given-name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          <FieldError message={errors.name?.message} />
        </div>
        <div>
          <Label htmlFor="ticket-surname">Surname</Label>
          <Input
            id="ticket-surname"
            autoComplete="family-name"
            aria-invalid={Boolean(errors.surname)}
            {...register("surname")}
          />
          <FieldError message={errors.surname?.message} />
        </div>
        <div>
          <Label htmlFor="ticket-email">Email</Label>
          <Input
            id="ticket-email"
            type="email"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          <FieldError message={errors.email?.message} />
        </div>
        <div>
          <Label htmlFor="ticket-phone">Phone</Label>
          <Input
            id="ticket-phone"
            type="tel"
            autoComplete="tel"
            aria-invalid={Boolean(errors.phone)}
            {...register("phone")}
          />
          <FieldError message={errors.phone?.message} />
        </div>
      </div>

      {/* Total */}
      <dl className="mt-7 space-y-2 border-t border-white/10 pt-5 text-sm">
        <div className="flex justify-between text-muted">
          <dt>
            {quantity} × {event.title}
          </dt>
          <dd>{formatZAR(event.price)} each</dd>
        </div>
        <div className="flex justify-between text-lg font-semibold text-foreground">
          <dt>Total</dt>
          <dd className="font-heading text-gold-gradient text-2xl">
            {formatZAR(total)}
          </dd>
        </div>
      </dl>

      {mutation.isError ? (
        <p role="alert" className="mt-4 text-sm text-flame-red">
          {mutation.error instanceof Error
            ? mutation.error.message
            : "Something went wrong — please try again."}
        </p>
      ) : null}

      <Button
        type="submit"
        size="lg"
        disabled={mutation.isPending}
        className="mt-6 w-full"
      >
        <CreditCard className="size-4" aria-hidden />
        {mutation.isPending ? "Preparing secure checkout…" : "Pay with Paystack"}
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted/70">
        <Lock className="size-3" aria-hidden />
        Secured by Paystack · Cards, EFT & SnapScan
      </p>
    </form>
  );
}
