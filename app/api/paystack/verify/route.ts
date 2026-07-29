import { NextResponse } from "next/server";
import { getEvent } from "@/services/content";
import { isPaystackConfigured, verifyTransaction } from "@/lib/paystack";
import type { DigitalTicket } from "@/types";

/** Secure server-side verification of a Paystack transaction.
 *  GET /api/paystack/verify?reference=FF-TKT-...
 *  Mock mode: &mock=1&event=slug&qty=2&email=...&name=... */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get("reference");
  if (!reference) {
    return NextResponse.json({ error: "Missing reference" }, { status: 400 });
  }

  // Demo mode ticket — used when Paystack keys are not configured yet.
  if (searchParams.get("mock") === "1" || !isPaystackConfigured()) {
    const event = await getEvent(searchParams.get("event") ?? "");
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const quantity = Math.max(1, Number(searchParams.get("qty") ?? 1));
    const ticket: DigitalTicket = {
      reference,
      eventSlug: event.slug,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      quantity,
      purchaser: searchParams.get("name") ?? "Guest",
      email: searchParams.get("email") ?? "",
      amount: event.price * quantity,
      status: "paid",
    };
    return NextResponse.json({ ticket, mock: true });
  }

  try {
    const verified = await verifyTransaction(reference);
    const meta = verified.metadata as {
      eventSlug?: string;
      eventTitle?: string;
      quantity?: number;
      purchaser?: string;
    };
    const event = await getEvent(meta.eventSlug ?? "");

    const ticket: DigitalTicket = {
      reference: verified.reference,
      eventSlug: meta.eventSlug ?? "",
      eventTitle: meta.eventTitle ?? event?.title ?? "Fusion Flame Event",
      date: event?.date ?? "",
      time: event?.time ?? "",
      quantity: Number(meta.quantity ?? 1),
      purchaser: meta.purchaser ?? "Guest",
      email: verified.customerEmail,
      amount: verified.amountZar,
      status: verified.status === "success" ? "paid" : "failed",
    };

    // TODO(admin-cms): persist ticket + send email confirmation with QR code.
    return NextResponse.json({ ticket, mock: false });
  } catch (err) {
    console.error("[paystack:verify]", err);
    return NextResponse.json(
      { error: "Could not verify payment" },
      { status: 502 },
    );
  }
}
