import { NextResponse } from "next/server";
import { capitecOrderSchema } from "@/lib/validation";
import { getEvent } from "@/services/content";
import {
  capitecCharge,
  generateReference,
  isPaystackConfigured,
} from "@/lib/paystack";

/** Initiate a Capitec Pay charge for event tickets.
 *
 *  Provider seam: today the charge is executed through Paystack's Capitec Pay
 *  channel (the site's existing PSP). If the business later onboards with a
 *  different Capitec Pay provider, only lib/paystack.capitecCharge and the
 *  status route need a new adapter — this route and the UI are provider-agnostic.
 *
 *  Sandbox: with no PAYSTACK_SECRET_KEY configured, a stateless mock simulates
 *  the approve-in-app flow (references are prefixed FFC and embed the issue
 *  time; the status route flips them to success after a short delay). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = capitecOrderSchema.safeParse(body);

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
  if (order.quantity > event.availableSeats) {
    return NextResponse.json(
      { error: "Not enough seats available for this event" },
      { status: 409 },
    );
  }

  const amountZar = event.price * order.quantity;
  const metadata = {
    kind: "event-ticket",
    channel: "capitec-pay",
    eventSlug: event.slug,
    eventTitle: event.title,
    quantity: order.quantity,
    purchaser: `${order.name} ${order.surname}`,
    phone: order.phone,
  };

  // Sandbox mode — no provider keys yet.
  if (!isPaystackConfigured()) {
    const reference = `FFC-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;
    console.log("[capitec:charge] sandbox charge", reference, event.slug);
    return NextResponse.json({
      reference,
      status: "pending",
      mock: true,
      amountZar,
    });
  }

  try {
    const reference = generateReference("FF-CAP");
    const charge = await capitecCharge({
      email: order.email,
      amountZar,
      reference,
      cellphone: order.capitecPhone,
      metadata,
    });
    console.log("[capitec:charge]", charge.reference, charge.status);
    return NextResponse.json({ ...charge, mock: false, amountZar });
  } catch (err) {
    console.error("[capitec:charge]", err);
    return NextResponse.json(
      {
        error:
          err instanceof Error
            ? err.message
            : "Capitec Pay charge could not be initiated. Please try again.",
      },
      { status: 502 },
    );
  }
}
