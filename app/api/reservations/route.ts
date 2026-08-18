import { NextResponse } from "next/server";
import { after } from "next/server";
import { reservationSchema } from "@/lib/validation";
import { generateReference } from "@/lib/site";
import { sendEmail } from "@/lib/email";
import { createReservationToken, saveReservation } from "@/lib/reservations";

/** Reservation endpoint: validates the request, saves it to the admin
 *  ledger, and issues a reference; the guest sends the booking to the
 *  restaurant over WhatsApp from the success screen. Also fires an
 *  internal notification email (no-op until RESEND_API_KEY is configured). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = reservationSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid reservation" },
      { status: 400 },
    );
  }

  const r = parsed.data;
  const reference = generateReference("FF-RES");
  console.log("[reservation]", reference, r.email, r.date, r.time, r.guests);

  try {
    await saveReservation({
      token: createReservationToken(),
      reference,
      name: r.name,
      surname: r.surname,
      email: r.email,
      phone: r.phone,
      date: r.date,
      time: r.time,
      guests: r.guests,
      seating: r.seating,
      occasion: r.occasion,
      specialRequests: r.specialRequests,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    // The WhatsApp handoff is still the source of truth for the booking
    // itself — don't block the guest over an admin-ledger write hiccup.
    console.error("[reservation] failed to save to admin ledger", err);
  }

  // Guests hand their request to the restaurant over WhatsApp from the
  // success screen — no guest email for now. This internal notification is
  // a no-op until RESEND_API_KEY is configured.
  after(async () => {
    const detailLines = [
      `Reference: ${reference}`,
      `Name: ${r.name} ${r.surname}`,
      `Email: ${r.email}`,
      `Phone: ${r.phone}`,
      `Date: ${r.date} at ${r.time}`,
      `Guests: ${r.guests}`,
      `Seating: ${r.seating}`,
      r.occasion ? `Occasion: ${r.occasion}` : null,
      r.specialRequests ? `Special requests: ${r.specialRequests}` : null,
    ]
      .filter(Boolean)
      .join("\n");

    await sendEmail({
      subject: `New reservation — ${r.name} ${r.surname}, ${r.guests} guests on ${r.date} ${r.time} [${reference}]`,
      text: `A new reservation request came in via the website:\n\n${detailLines}`,
      replyTo: r.email,
    });
  });

  return NextResponse.json(
    { reference, reservation: parsed.data },
    { status: 201 },
  );
}
