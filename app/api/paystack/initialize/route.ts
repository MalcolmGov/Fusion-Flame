import { NextResponse } from "next/server";
import { ticketOrderSchema } from "@/lib/validation";
import { getEvent, isEventPast } from "@/services/content";
import {
  generateReference,
  initializeTransaction,
  isPaystackConfigured,
} from "@/lib/paystack";

/** Initialize a Paystack transaction for event tickets.
 *  Amount is always computed server-side from the event data —
 *  never trusted from the client. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = ticketOrderSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 },
    );
  }

  const order = parsed.data;
  const event = await getEvent(order.eventSlug);
  if (!event) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (isEventPast(event)) {
    return NextResponse.json(
      { error: "This event has already taken place" },
      { status: 410 },
    );
  }
  if (order.quantity > event.availableSeats) {
    return NextResponse.json(
      { error: "Not enough seats available for this event" },
      { status: 409 },
    );
  }

  const amountZar = event.price * order.quantity;
  const reference = generateReference("FF-TKT");
  // Prefer the configured canonical URL; fall back to the requesting origin
  // so the flow works on previews and local dev without configuration.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
  const callbackUrl = `${siteUrl}/tickets/success`;

  const metadata = {
    kind: "event-ticket",
    eventSlug: event.slug,
    eventTitle: event.title,
    quantity: order.quantity,
    purchaser: `${order.name} ${order.surname}`,
    phone: order.phone,
  };

  // Demo mode: no secret key configured — complete the flow locally.
  if (!isPaystackConfigured()) {
    const params = new URLSearchParams({
      reference,
      mock: "1",
      event: event.slug,
      qty: String(order.quantity),
      email: order.email,
      name: `${order.name} ${order.surname}`,
    });
    return NextResponse.json({
      authorizationUrl: `${callbackUrl}?${params.toString()}`,
      reference,
      mock: true,
    });
  }

  try {
    const init = await initializeTransaction({
      email: order.email,
      amountZar,
      reference,
      callbackUrl,
      metadata,
    });
    return NextResponse.json({ ...init, mock: false });
  } catch (err) {
    console.error("[paystack:initialize]", err);
    return NextResponse.json(
      { error: "Payment could not be initialized. Please try again." },
      { status: 502 },
    );
  }
}
