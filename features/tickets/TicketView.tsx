"use client";

import Image from "next/image";
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
  Loader2,
  Mail,
  TriangleAlert,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatEventDate, formatZAR } from "@/lib/utils";
import type { DigitalTicket } from "@/types";

async function fetchTicket(query: string): Promise<{ ticket: DigitalTicket }> {
  const res = await fetch(`/api/payments/yoco/status?${query}`);
  const body = await res.json();
  if (!res.ok) throw new Error(body?.error ?? "Verification failed");
  return body;
}

function TicketSkeleton({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-lg space-y-4 text-center" role="status">
      <Loader2 className="mx-auto size-8 animate-spin text-gold" aria-hidden />
      <p className="text-sm text-muted">{label}</p>
      <div className="skeleton h-72 rounded-3xl" aria-hidden />
    </div>
  );
}

export function TicketView() {
  const searchParams = useSearchParams();
  // Yoco appends ?token=... on success; sandbox mode adds ?mock=1&...
  const hasReference = Boolean(
    searchParams.get("token") || searchParams.get("mock"),
  );

  const query = useQuery({
    queryKey: ["ticket", searchParams.toString()],
    queryFn: () => fetchTicket(searchParams.toString()),
    enabled: hasReference,
    retry: 1,
    refetchInterval: (q) =>
      q.state.data?.ticket.status === "pending" ? 2500 : false,
  });

  if (!hasReference) {
    return (
      <ErrorState message="No payment reference found. If you completed a payment, please contact us with your proof of payment." />
    );
  }
  if (query.isPending) {
    return <TicketSkeleton label="Loading your ticket…" />;
  }
  if (query.isError) {
    return (
      <ErrorState message="We could not verify this payment. If you were charged, our team will confirm your ticket by email shortly." />
    );
  }
  if (query.data.ticket.status === "pending") {
    return (
      <TicketSkeleton label="Confirming your payment — this only takes a few seconds…" />
    );
  }
  if (query.data.ticket.status !== "paid") {
    return (
      <ErrorState message="This payment was not successful. No money has left your account — please try again." />
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
      <div className="text-center print:hidden">
        <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-gold/15 text-gold shadow-glow-gold">
          <BadgeCheck className="size-8" aria-hidden />
        </span>
        <h1 className="font-heading mt-5 text-4xl text-gold-gradient">
          You're On the List
        </h1>
        <p className="mt-3 text-muted">
          Payment confirmed. Your digital ticket is below — please save or
          print it now and present the QR code at the door.
        </p>
      </div>

      {/* Digital ticket */}
      <div className="gold-ring relative mt-9 overflow-hidden rounded-3xl print:mt-0 print:border print:border-black/20">
        <div className="bg-[linear-gradient(120deg,rgba(221,169,67,0.14),rgba(250,105,6,0.07))] p-7 md:p-8">
          <div className="flex items-center gap-3">
            <Image
              src="/flame-mark.png"
              alt=""
              width={46}
              height={46}
              aria-hidden
              className="shrink-0 mix-blend-screen print:mix-blend-normal"
            />
            <div>
              <p className="font-heading text-xl leading-none">
                <span className="text-gold-gradient">Fusion</span>{" "}
                <span className="text-red-gradient">Flame</span>
              </p>
              <p className="eyebrow mt-1.5 text-[9px]">Digital Ticket</p>
            </div>
          </div>
          <h2 className="font-heading mt-5 text-3xl text-foreground">
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

      <p className="mt-4 text-center text-xs text-muted/70 print:text-black/60">
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
