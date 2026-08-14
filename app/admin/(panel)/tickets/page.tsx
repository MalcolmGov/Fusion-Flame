import type { Metadata } from "next";
import { BadgeCheck, Banknote, Clock3, Ticket, Users } from "lucide-react";
import { listPayments, type PaymentRecord } from "@/lib/payments";
import { formatZAR } from "@/lib/utils";

export const metadata: Metadata = { title: "Ticket Sales" };

const STATUS_STYLES: Record<PaymentRecord["status"], string> = {
  paid: "bg-gold/15 text-gold-light border-gold/40",
  pending: "bg-white/5 text-muted border-white/15",
  failed: "bg-flame-red/10 text-flame-red border-flame-red/40",
};

function formatWhen(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Johannesburg",
  });
}

export default async function TicketSalesPage() {
  const payments = await listPayments();
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
      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((t) => (
          <div key={t.label} className="glass rounded-2xl p-5">
            <t.icon className="size-4 text-gold" aria-hidden />
            <p className="font-heading mt-3 text-2xl text-gold-gradient md:text-3xl">
              {t.value}
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted">
              {t.label}
            </p>
          </div>
        ))}
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
        {payments.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted">
            No ticket orders yet. They&rsquo;ll appear here the moment someone
            starts a checkout.
          </div>
        ) : (
          <div className="glass overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-muted">
                  <th className="px-4 py-3 font-medium">Placed</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Event</th>
                  <th className="px-4 py-3 font-medium">Purchaser</th>
                  <th className="px-4 py-3 text-right font-medium">Qty</th>
                  <th className="px-4 py-3 text-right font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr
                    key={p.token}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatWhen(p.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gold-light">
                      {p.reference}
                    </td>
                    <td className="px-4 py-3 text-foreground/90">
                      {p.eventTitle}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground/90">{p.purchaser}</p>
                      <p className="text-xs text-muted">
                        {p.email} · {p.phone}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right text-foreground/90">
                      {p.quantity}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-right text-foreground/90">
                      {formatZAR(p.amountZar)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${STATUS_STYLES[p.status]}`}
                      >
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
