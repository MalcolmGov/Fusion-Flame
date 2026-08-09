import { NextResponse } from "next/server";
import { after } from "next/server";
import { reservationSchema } from "@/lib/validation";
import { generateReference } from "@/lib/site";
import { sendEmail } from "@/lib/email";
import { getRestaurant } from "@/services/content";

/** Reservation endpoint: emails the request to the restaurant mailbox and a
 *  confirmation to the guest (once RESEND_API_KEY is configured). */
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

  // Deliver emails after the response is sent — the guest never waits on SMTP.
  after(async () => {
    const restaurant = await getRestaurant();
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

    await sendEmail({
      to: r.email,
      subject: `Your Fusion Flame reservation request (${reference})`,
      text:
        `Hi ${r.name},\n\n` +
        `Thank you — we've received your reservation request for ${r.guests} ` +
        `guest${r.guests === 1 ? "" : "s"} on ${r.date} at ${r.time} (${r.seating} seating).\n\n` +
        `Your reference is ${reference}. Our team will confirm your table shortly.\n\n` +
        `Need to change anything? Reply to this email or WhatsApp us on ${restaurant.phone}.\n\n` +
        `Fusion Flame · ${restaurant.address.street}, ${restaurant.address.suburb}, ${restaurant.address.city}`,
    });
  });

  return NextResponse.json(
    { reference, reservation: parsed.data },
    { status: 201 },
  );
}
