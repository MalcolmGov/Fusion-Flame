import type { PaymentRecord } from "@/lib/payments";
import { formatZAR } from "@/lib/utils";
import { CancelTicketButton } from "@/components/admin/CancelTicketButton";

const STATUS_STYLES: Record<PaymentRecord["status"], string> = {
  paid: "bg-gold/15 text-gold-light border-gold/40",
  pending: "bg-white/5 text-muted border-white/15",
  failed: "bg-flame-red/10 text-flame-red border-flame-red/40",
  cancelled: "bg-white/5 text-muted/60 border-white/10",
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

export function TicketOrdersTable({
  payments,
  emptyMessage,
}: {
  payments: PaymentRecord[];
  emptyMessage: string;
}) {
  if (payments.length === 0) {
    return (
      <div className="glass rounded-2xl p-8 text-center text-sm text-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
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
            <tr key={p.token} className="border-b border-white/5 last:border-0">
              <td className="whitespace-nowrap px-4 py-3 text-muted">
                {formatWhen(p.createdAt)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gold-light">
                {p.reference}
              </td>
              <td className="px-4 py-3 text-foreground/90">{p.eventTitle}</td>
              <td className="px-4 py-3">
                <p className="text-foreground/90">{p.purchaser}</p>
                <p className="text-xs text-muted">
                  {p.email ? `${p.email} · ` : ""}
                  {p.phone}
                </p>
              </td>
              <td className="px-4 py-3 text-right text-foreground/90">
                {p.quantity}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-foreground/90">
                {formatZAR(p.amountZar)}
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-col items-start gap-1.5">
                  <span
                    className={`inline-block rounded-full border px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] ${STATUS_STYLES[p.status]}`}
                  >
                    {p.status}
                  </span>
                  {p.status === "pending" ? (
                    <CancelTicketButton token={p.token} reference={p.reference} />
                  ) : null}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
