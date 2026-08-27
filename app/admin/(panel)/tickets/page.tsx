import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Ban, Banknote, Clock3, Ticket, Users } from "lucide-react";
import { listPayments } from "@/lib/payments";
import { formatZAR } from "@/lib/utils";
import { TicketOrdersTable } from "@/components/admin/TicketOrdersTable";

export const metadata: Metadata = { title: "Ticket Sales" };

export default async function TicketSalesPage() {
  const allPayments = await listPayments();
  const cancelledCount = allPayments.filter((p) => p.status === "cancelled").length;
  const payments = allPayments.filter((p) => p.status !== "cancelled");

  const paid = payments.filter((p) => p.status === "paid");
  const ticketsSold = paid.reduce((n, p) => n + p.quantity, 0);
  const revenue = paid.reduce((n, p) => n + p.amountZar, 0);
  const pendingCount = payments.filter((p) => p.status === "pending").length;

  const byEvent = new Map<
    string,
    { title: string; orders: number; tickets: number; revenue: number }
  >();
  for (const p of paid) {
    const entry = byEvent.get(p.eventSlug) ?? {
      title: p.eventTitle,
      orders: 0,
      tickets: 0,
      revenue: 0,
    };
    entry.orders += 1;
    entry.tickets += p.quantity;
    entry.revenue += p.amountZar;
    byEvent.set(p.eventSlug, entry);
  }

  const tiles = [
    { label: "Paid Orders", value: String(paid.length), icon: BadgeCheck },
    { label: "Tickets Sold", value: String(ticketsSold), icon: Ticket },
    { label: "Revenue", value: formatZAR(revenue), icon: Banknote },
    { label: "Pending", value: String(pendingCount), icon: Clock3 },
    {
      label: "Cancelled",
      value: String(cancelledCount),
      icon: Ban,
      href: cancelledCount > 0 ? "/admin/tickets/cancelled" : undefined,
    },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-heading text-3xl text-gold-gradient md:text-4xl">
        Ticket Sales
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Every ticket order placed on the website, straight from the payment
        ledger. Paid orders are confirmed by Yoco&rsquo;s webhook — the
        redirect alone is never trusted.
      </p>

      {/* Summary */}
      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {tiles.map((t) => {
          const content = (
            <>
              <t.icon className="size-4 text-gold" aria-hidden />
              <p className="font-heading mt-3 text-2xl text-gold-gradient md:text-3xl">
                {t.value}
              </p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
                {t.label}
              </p>
            </>
          );
          return t.href ? (
            <Link
              key={t.label}
              href={t.href}
              className="glass rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-gold"
            >
              {content}
            </Link>
          ) : (
            <div key={t.label} className="glass rounded-2xl p-5">
              {content}
            </div>
          );
        })}
      </div>

      {/* Per-event rollup */}
      {byEvent.size > 0 ? (
        <div className="mt-8">
          <h2 className="eyebrow mb-3">By Event</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[...byEvent.values()].map((e) => (
              <div key={e.title} className="glass rounded-2xl p-4 text-sm">
                <p className="font-heading text-base text-foreground">
                  {e.title}
                </p>
                <p className="mt-1.5 flex items-center gap-1.5 text-muted">
                  <Users className="size-3.5 text-gold" aria-hidden />
                  {e.tickets} ticket{e.tickets === 1 ? "" : "s"} · {e.orders}{" "}
                  order{e.orders === 1 ? "" : "s"} ·{" "}
                  <span className="text-gold-light">{formatZAR(e.revenue)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* Orders table */}
      <div className="mt-8">
        <h2 className="eyebrow mb-3">All Orders</h2>
        <TicketOrdersTable
          payments={payments}
          emptyMessage="No ticket orders yet. They'll appear here the moment someone starts a checkout."
        />
      </div>
    </div>
  );
}
