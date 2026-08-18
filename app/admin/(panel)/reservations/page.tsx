import type { Metadata } from "next";
import { CalendarDays, PartyPopper, Users2, UtensilsCrossed } from "lucide-react";
import { listReservations } from "@/lib/reservations";

export const metadata: Metadata = { title: "Reservations" };

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

function formatBookingDate(dateStr: string) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-ZA", {
    weekday: "short",
    day: "2-digit",
    month: "short",
  });
}

function todayInSAST() {
  return new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export default async function ReservationsPage() {
  const reservations = await listReservations();
  const today = todayInSAST();
  const upcoming = reservations.filter((r) => r.date >= today);
  const todaysBookings = reservations.filter((r) => r.date === today);
  const totalGuests = reservations.reduce((n, r) => n + r.guests, 0);

  const tiles = [
    { label: "Total Bookings", value: String(reservations.length), icon: CalendarDays },
    { label: "Total Guests", value: String(totalGuests), icon: Users2 },
    { label: "Upcoming", value: String(upcoming.length), icon: PartyPopper },
    { label: "Today", value: String(todaysBookings.length), icon: UtensilsCrossed },
  ];

  return (
    <div className="mx-auto max-w-6xl">
      <h1 className="font-heading text-3xl text-gold-gradient md:text-4xl">
        Reservations
      </h1>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">
        Every table booking submitted on the website. Guests are sent to
        WhatsApp to confirm with you directly — this is the independent
        record of each request.
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

      {/* Bookings table */}
      <div className="mt-8">
        <h2 className="eyebrow mb-3">All Bookings</h2>
        {reservations.length === 0 ? (
          <div className="glass rounded-2xl p-8 text-center text-sm text-muted">
            No reservations yet. They&rsquo;ll appear here the moment a guest
            submits the booking form.
          </div>
        ) : (
          <div className="glass overflow-x-auto rounded-2xl">
            <table className="w-full min-w-[860px] text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-[10px] uppercase tracking-[0.18em] text-muted">
                  <th className="px-4 py-3 font-medium">Placed</th>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Guest</th>
                  <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-4 py-3 text-right font-medium">Guests</th>
                  <th className="px-4 py-3 font-medium">Seating</th>
                  <th className="px-4 py-3 font-medium">Notes</th>
                </tr>
              </thead>
              <tbody>
                {reservations.map((r) => (
                  <tr
                    key={r.token}
                    className="border-b border-white/5 last:border-0"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted">
                      {formatWhen(r.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gold-light">
                      {r.reference}
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-foreground/90">
                        {r.name} {r.surname}
                      </p>
                      <p className="text-xs text-muted">
                        {r.email} · {r.phone}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-foreground/90">
                      {formatBookingDate(r.date)} · {r.time}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground/90">
                      {r.guests}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 capitalize text-foreground/90">
                      {r.seating}
                    </td>
                    <td className="px-4 py-3 text-xs text-muted">
                      {[r.occasion, r.specialRequests].filter(Boolean).join(" · ") || "—"}
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
