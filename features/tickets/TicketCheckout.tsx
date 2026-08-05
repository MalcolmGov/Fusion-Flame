"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import {
  CreditCard,
  Lock,
  Minus,
  Plus,
  Smartphone,
  TriangleAlert,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input, Label, FieldError } from "@/components/ui/form-fields";
import {
  capitecPhoneSchema,
  ticketCheckoutFormSchema,
  type CapitecOrderFormValues,
} from "@/lib/validation";
import { cn, formatZAR } from "@/lib/utils";
import type { PaystackInitResponse, RestaurantEvent } from "@/types";

type Method = "capitec" | "card";
type CapitecPhase = "form" | "awaiting" | "failed";

interface CapitecChargeResponse {
  reference: string;
  status: string;
  mock: boolean;
}

async function postJson<T>(url: string, payload: unknown): Promise<T> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Request failed");
  return body;
}

export function TicketCheckout({ event }: { event: RestaurantEvent }) {
  const [method, setMethod] = useState<Method>("capitec");
  const [capitecPhase, setCapitecPhase] = useState<CapitecPhase>("form");
  const chargeRef = useRef<CapitecChargeResponse | null>(null);
  const orderRef = useRef<CapitecOrderFormValues | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    watch,
    formState: { errors },
  } = useForm<CapitecOrderFormValues>({
    resolver: zodResolver(ticketCheckoutFormSchema),
    defaultValues: { eventSlug: event.slug, quantity: 2, capitecPhone: "" },
  });

  const quantity = watch("quantity") ?? 1;
  const total = event.price * quantity;

  /* Card / hosted checkout (existing Paystack redirect flow) */
  const cardMutation = useMutation({
    mutationFn: (values: CapitecOrderFormValues) =>
      postJson<PaystackInitResponse>("/api/paystack/initialize", values),
    onSuccess: (data) => {
      window.location.href = data.authorizationUrl;
    },
  });

  /* Capitec Pay: charge then poll while the customer approves in-app */
  const capitecMutation = useMutation({
    mutationFn: (values: CapitecOrderFormValues) =>
      postJson<CapitecChargeResponse>("/api/payments/capitec/charge", values),
    onSuccess: (data) => {
      chargeRef.current = data;
      setCapitecPhase("awaiting");
    },
  });

  useEffect(() => {
    if (capitecPhase !== "awaiting") return;
    const startedAt = Date.now();
    const interval = setInterval(async () => {
      const charge = chargeRef.current;
      const order = orderRef.current;
      if (!charge) return;
      try {
        const res = await fetch(
          `/api/payments/capitec/status?reference=${encodeURIComponent(charge.reference)}`,
        );
        const body = await res.json();
        if (body.status === "success") {
          clearInterval(interval);
          const params = new URLSearchParams({ reference: charge.reference });
          if (charge.mock && order) {
            params.set("mock", "1");
            params.set("event", event.slug);
            params.set("qty", String(order.quantity));
            params.set("email", order.email);
            params.set("name", `${order.name} ${order.surname}`);
          }
          window.location.href = `/tickets/success?${params.toString()}`;
        } else if (body.status === "failed") {
          clearInterval(interval);
          setCapitecPhase("failed");
        } else if (Date.now() - startedAt > 3 * 60_000) {
          clearInterval(interval);
          setCapitecPhase("failed");
        }
      } catch {
        // transient network error — keep polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [capitecPhase, event.slug]);

  const bump = (delta: number) => {
    const next = Math.min(10, Math.max(1, Number(quantity) + delta));
    setValue("quantity", next, { shouldValidate: true });
  };

  const onSubmit = (values: CapitecOrderFormValues) => {
    orderRef.current = values;
    if (method === "capitec") {
      const phone = capitecPhoneSchema.safeParse(values.capitecPhone ?? "");
      if (!phone.success) {
        setError("capitecPhone", {
          message:
            phone.error.issues[0]?.message ??
            "Enter your Capitec cellphone number",
        });
        return;
      }
      capitecMutation.mutate({ ...values, capitecPhone: phone.data });
    } else {
      cardMutation.mutate(values);
    }
  };

  const pending = capitecMutation.isPending || cardMutation.isPending;
  const activeError = capitecMutation.error ?? cardMutation.error;

  /* ── Awaiting in-app approval ─────────────────────────────── */
  if (capitecPhase === "awaiting") {
    return (
      <div
        className="gold-ring rounded-3xl p-8 text-center md:p-10"
        role="status"
        aria-live="polite"
      >
        <motion.span
          animate={{ scale: [1, 1.06, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="mx-auto flex size-16 items-center justify-center rounded-full bg-[#0891b2]/15 text-[#22d3ee]"
        >
          <Smartphone className="size-8" aria-hidden />
        </motion.span>
        <h2 className="font-heading mt-5 text-2xl text-foreground">
          Approve in Your Capitec App
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-muted">
          We've sent a payment request of{" "}
          <span className="text-gold-light">{formatZAR(total)}</span> to your
          Capitec app. Open the notification and approve it — this page will
          continue automatically.
        </p>
        <div
          className="mx-auto mt-6 h-1 w-48 overflow-hidden rounded-full bg-white/10"
          aria-hidden
        >
          <motion.div
            animate={{ x: ["-100%", "260%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-gold to-flame-orange"
          />
        </div>
        {chargeRef.current?.mock ? (
          <p className="mt-5 text-xs text-muted/70">
            Sandbox mode — the approval will complete automatically in a few
            seconds.
          </p>
        ) : null}
        <p className="mt-2 font-mono text-xs text-muted/60">
          Ref: {chargeRef.current?.reference}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="gold-ring rounded-3xl p-7 md:p-9"
      aria-label={`Buy tickets for ${event.title}`}
      noValidate
    >
      <input type="hidden" {...register("eventSlug")} />

      <h2 className="font-heading text-2xl text-foreground">Secure Your Seats</h2>

      {capitecPhase === "failed" ? (
        <p
          role="alert"
          className="mt-4 flex items-start gap-2 rounded-xl border border-flame-red/40 bg-flame-red/10 px-4 py-3 text-sm text-flame-red"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
          The payment wasn't completed — no money left your account. Please try
          again.
        </p>
      ) : null}

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

      {/* Payment method */}
      <fieldset className="mt-7">
        <legend className="mb-2 block text-[11px] font-medium uppercase tracking-[0.18em] text-muted">
          Pay With
        </legend>
        <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Payment method">
          <button
            type="button"
            role="radio"
            aria-checked={method === "capitec"}
            onClick={() => setMethod("capitec")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 transition-all",
              method === "capitec"
                ? "border-[#22d3ee]/60 bg-[#0891b2]/10 shadow-[0_0_28px_-10px_rgba(34,211,238,0.6)]"
                : "border-white/10 bg-white/[0.03] hover:border-white/25",
            )}
          >
            <Smartphone
              className={cn(
                "size-5",
                method === "capitec" ? "text-[#22d3ee]" : "text-muted",
              )}
              aria-hidden
            />
            <span className="text-sm font-semibold text-foreground">
              Capitec Pay
            </span>
            <span className="text-[10px] text-muted">Approve in your app</span>
          </button>
          <button
            type="button"
            role="radio"
            aria-checked={method === "card"}
            onClick={() => setMethod("card")}
            className={cn(
              "flex cursor-pointer flex-col items-center gap-1.5 rounded-2xl border px-4 py-4 transition-all",
              method === "card"
                ? "border-gold/60 bg-gold/10 shadow-glow-gold"
                : "border-white/10 bg-white/[0.03] hover:border-white/25",
            )}
          >
            <CreditCard
              className={cn(
                "size-5",
                method === "card" ? "text-gold" : "text-muted",
              )}
              aria-hidden
            />
            <span className="text-sm font-semibold text-foreground">
              Card &amp; More
            </span>
            <span className="text-[10px] text-muted">Cards, EFT, SnapScan</span>
          </button>
        </div>
      </fieldset>

      {method === "capitec" ? (
        <div className="mt-5">
          <Label htmlFor="ticket-capitec-phone">Capitec Cellphone Number</Label>
          <Input
            id="ticket-capitec-phone"
            type="tel"
            inputMode="tel"
            placeholder="e.g. 081 234 5678"
            aria-invalid={Boolean(errors.capitecPhone)}
            {...register("capitecPhone")}
          />
          <FieldError message={errors.capitecPhone?.message} />
          <p className="mt-1.5 text-xs text-muted/70">
            The number linked to your Capitec account — you'll approve the
            payment in the Capitec app. No card details needed.
          </p>
        </div>
      ) : null}

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

      {activeError ? (
        <p role="alert" className="mt-4 text-sm text-flame-red">
          {activeError instanceof Error
            ? activeError.message
            : "Something went wrong — please try again."}
        </p>
      ) : null}

      <Button type="submit" size="lg" disabled={pending} className="mt-6 w-full">
        {method === "capitec" ? (
          <Smartphone className="size-4" aria-hidden />
        ) : (
          <CreditCard className="size-4" aria-hidden />
        )}
        {pending
          ? "Preparing secure payment…"
          : method === "capitec"
            ? `Pay ${formatZAR(total)} with Capitec Pay`
            : "Pay with Card & More"}
      </Button>
      <p className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted/70">
        <Lock className="size-3" aria-hidden />
        {method === "capitec"
          ? "Capitec Pay — approve securely in your banking app"
          : "Secured checkout · Cards, EFT & SnapScan"}
      </p>
    </form>
  );
}
