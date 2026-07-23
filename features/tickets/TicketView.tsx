"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { QRCodeSVG } from "qrcode.react";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  Clock,
  Download,
  Home,
  Mail,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEventDate, formatZAR } from "@/lib/utils";
import type { DigitalTicket } from "@/types";

async function fetchTicket(query: string): Promise<{ ticket: DigitalTicket }> {
  const res = await fetch(`/api/paystack/verify?${query}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Verification failed");
  return body;
}

function TicketSkeleton() {
  return (
    <div className="mx-auto max-w-lg space-y-4" aria-label="Verifying payment">
      <div className="skeleton h-10 w-2/3 rounded-xl" />
      <div className="skeleton h-72 rounded-3xl" />
      <div className="skeleton h-12 rounded-xl" />
    </div>
  );
}

export function TicketView() {
  const searchParams = useSearchParams();
  // Paystack appends ?reference=&trxref= — mock mode adds its own params.
  const reference =
    searchParams.get("reference") ?? searchParams.get("trxref") ?? "";

  const query = useQuery({
    queryKey: ["ticket", searchParams.toString()],
    queryFn: () => fetchTicket(searchParams.toString()),
    enabled: Boolean(reference),
    retry: 1,
  });

  if (!reference) {
    return (
      <ErrorState message="No payment reference found. If you completed a payment, please contact us with your proof of payment." />
    );
  }
  if (query.isPending) return <TicketSkeleton />;
  if (query.isError || query.data.ticket.status !== "paid") {
    return (
      <ErrorState
        message={
          query.isError
            ? "We could not verify this payment. If you were charged, our team will confirm your ticket by email shortly."
            : "This payment was not successful. No money has left your account — please try again."
        }
      />
    );
  }

  const ticket = query.data.ticket;
  const qrPayload = JSON.stringify({
    ref: ticket.reference,
    event: ticket.eventSlug,
    qty: ticket.quantity,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="mx-auto max-w-lg"
    >
      <div className="text-center">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold shadow-glow-gold">
          <BadgeCheck className="size-8" aria-hidden />
        </span>
        <h1 className="font-heading mt-5 text-4xl text-gold-gradient">
          You're On the List
        </h1>
        <p className="mt-3 text-muted">
          Payment confirmed. Your digital ticket is below — we've also emailed
          it to <span className="text-foreground">{ticket.email}</span>.
        </p>
      </div>

      {/* Digital ticket */}
      <div className="gold-ring relative mt-9 overflow-hidden rounded-3xl print:border print:border-black/20">
        <div className="bg-[linear-gradient(120deg,rgba(212,175,55,0.14),rgba(255,138,0,0.06))] p-7 md:p-8">
          <p className="eyebrow text-[10px]">Fusion Flame · Digital Ticket</p>
          <h2 className="font-heading mt-2 text-3xl text-foreground">
            {ticket.eventTitle}
          </h2>

          <dl className="mt-5 grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-muted">
              <CalendarDays className="size-4 text-gold" aria-hidden />
              <dd>{ticket.date ? formatEventDate(ticket.date) : "—"}</dd>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Clock className="size-4 text-gold" aria-hidden />
              <dd>{ticket.time || "—"}</dd>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Users className="size-4 text-gold" aria-hidden />
              <dd>
                {ticket.quantity} {ticket.quantity === 1 ? "guest" : "guests"}
              </dd>
            </div>
            <div className="flex items-center gap-2 text-muted">
              <Mail className="size-4 text-gold" aria-hidden />
              <dd className="truncate">{ticket.purchaser}</dd>
            </div>
          </dl>
        </div>

        {/* Perforation */}
        <div
          aria-hidden
          className="relative border-t-2 border-dashed border-white/15"
        >
          <span className="absolute -left-4 -top-4 size-8 rounded-full bg-background" />
          <span className="absolute -right-4 -top-4 size-8 rounded-full bg-background" />
        </div>

        <div className="flex flex-col items-center gap-5 p-7 md:flex-row md:justify-between md:p-8">
          <div className="rounded-2xl bg-white p-3.5" aria-label="Entry QR code">
            <QRCodeSVG value={qrPayload} size={132} level="M" />
          </div>
          <div className="text-center md:text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-muted">
              Reference
            </p>
            <p className="mt-1 font-mono text-sm text-gold-light">
              {ticket.reference}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-muted">
              Amount Paid
            </p>
            <p className="font-heading mt-1 text-2xl text-gold-gradient">
              {formatZAR(ticket.amount)}
            </p>
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-xs text-muted/70">
        Present this QR code at the door. Screenshots are welcome.
      </p>

      <div className="mt-8 flex flex-col justify-center gap-3 print:hidden sm:flex-row">
        <Button variant="outline" onClick={() => window.print()}>
          <Download className="size-4" aria-hidden />
          Save / Print Ticket
        </Button>
        <Button asChild>
          <Link href="/">
            <Home className="size-4" aria-hidden />
            Back to Fusion Flame
          </Link>
        </Button>
      </div>
    </motion.div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <div className="mx-auto max-w-lg text-center" role="alert">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-flame-red/15 text-flame-red">
        <TriangleAlert className="size-8" aria-hidden />
      </span>
      <h1 className="font-heading mt-5 text-3xl text-foreground">
        Payment Issue
      </h1>
      <p className="mt-3 leading-relaxed text-muted">{message}</p>
      <div className="mt-8 flex justify-center gap-3">
        <Button asChild variant="outline">
          <Link href="/#events">Browse Events</Link>
        </Button>
        <Button asChild>
          <Link href="/#contact">Contact Us</Link>
        </Button>
      </div>
    </div>
  );
}
