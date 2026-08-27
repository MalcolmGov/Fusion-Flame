import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { listPayments } from "@/lib/payments";
import { TicketOrdersTable } from "@/components/admin/TicketOrdersTable";

export const metadata: Metadata = { title: "Cancelled Orders" };

export default async function CancelledOrdersPage() {
  const payments = (await listPayments()).filter((p) => p.status === "cancelled");

  return (
    <div className="mx-auto max-w-6xl">
      <Link
        href="/admin/tickets"
        className="inline-flex items-center gap-1.5 text-xs text-muted transition-colors hover:text-gold-light"
      >
        <ArrowLeft className="size-3.5" aria-hidden />
        Back to Ticket Sales
      </Link>

      <h1 className="font-heading mt-3 text-3xl text-gold-gradient md:text-4xl">
        Cancelled Orders
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Pending orders cancelled from Ticket Sales — kept here for the
        record, but out of the main view. No money moved on these; kept in
        case a late-arriving payment confirmation still needs to reconcile
        against them.
      </p>

      <div className="mt-8">
        <TicketOrdersTable
          payments={payments}
          emptyMessage="No cancelled orders."
        />
      </div>
    </div>
  );
}
