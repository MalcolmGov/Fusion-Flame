import { NextResponse } from "next/server";
import { ticketOrderSchema } from "@/lib/validation";
import { getEvent, isEventPast } from "@/services/content";
import { createCheckout, isYocoConfigured } from "@/lib/yoco";
import { createPaymentToken, savePayment, updatePaymentStatus } from "@/lib/payments";
import { generateReference } from "@/lib/site";

/** Start a Yoco Checkout for event tickets. Amount is always computed
 *  server-side from the event data — never trusted from the client.
 *
 *  Sandbox: with no YOCO_SECRET_KEY configured, the ticket is synthesized
 *  immediately (no Blob write, no webhook needed) so the full journey is
 *  testable before the client's keys arrive. */
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;

  if (!isYocoConfigured()) {
    const params = new URLSearchParams({
      mock: "1",
      reference,
      event: event.slug,
      qty: String(order.quantity),
      email: order.email ?? "",
      name: `${order.name} ${order.surname}`,
      amount: String(amountZar),
    });
    console.log("[yoco:checkout] sandbox", reference, event.slug);
    return NextResponse.json({
      redirectUrl: `${siteUrl}/tickets/success?${params.toString()}`,
      reference,
      mock: true,
    });
  }

  const token = createPaymentToken();

  try {
    await savePayment({
      token,
      reference,
      provider: "yoco",
      status: "pending",
      eventSlug: event.slug,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      quantity: order.quantity,
      purchaser: `${order.name} ${order.surname}`,
      email: order.email ?? "",
      phone: order.phone,
      amountZar,
      createdAt: new Date().toISOString(),
    });

    const checkout = await createCheckout({
      amountZar,
      successUrl: `${siteUrl}/tickets/success?token=${token}`,
      cancelUrl: `${siteUrl}/events/${event.slug}?payment=cancelled`,
      failureUrl: `${siteUrl}/events/${event.slug}?payment=failed`,
      reference,
      metadata: { token, reference, eventSlug: event.slug },
    });

    await updatePaymentStatus(token, { checkoutId: checkout.id });

    return NextResponse.json({
      redirectUrl: checkout.redirectUrl,
      reference,
      mock: false,
    });
  } catch (err) {
    console.error("[yoco:checkout]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Payment could not be started. Please try again.",
      },
      { status: 502 },
    );
  }
}
