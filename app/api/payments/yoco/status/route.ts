import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getEvent } from "@/services/content";
import { getPayment, reconcilePendingPayment } from "@/lib/payments";
import { contentTag } from "@/lib/content-store";
import type { DigitalTicket } from "@/types";

/** Ticket status for the success page. The webhook is the primary source of
 *  truth, but webhook delivery isn't guaranteed to be fast or to arrive at
 *  all — so while a record is still "pending", reconcilePendingPayment also
 *  asks Yoco directly and self-heals the record if Yoco already has a final
 *  answer. Never trusts the redirect alone.
 *  GET /api/payments/yoco/status?token=...
 *  Sandbox: GET .../status?mock=1&event=...&qty=...&email=...&name=... */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  if (searchParams.get("mock") === "1") {
    const event = await getEvent(searchParams.get("event") ?? "");
    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }
    const quantity = Math.max(1, Number(searchParams.get("qty") ?? 1));
    const ticket: DigitalTicket = {
      reference: searchParams.get("reference") ?? "",
      eventSlug: event.slug,
      eventTitle: event.title,
      date: event.date,
      time: event.time,
      quantity,
      purchaser: searchParams.get("name") ?? "Guest",
      email: searchParams.get("email") ?? "",
      amount: Number(searchParams.get("amount") ?? event.price * quantity),
      status: "paid",
    };
    return NextResponse.json({ ticket, mock: true });
  }

  const token = searchParams.get("token");
  if (!token) {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }

  const found = await getPayment(token);
  if (!found) {
    return NextResponse.json(
      {
        error:
          "We couldn't find that payment. If you were charged, please contact us with your proof of payment.",
      },
      { status: 404 },
    );
  }
  const record = await reconcilePendingPayment(found);
  if (found.status === "pending" && record.status !== "pending") {
    // Reconciliation just resolved this here rather than via the webhook —
    // bust the public pages' cache so the new seat count/status shows up.
    revalidateTag(contentTag("events"));
    revalidateTag("content");
    revalidatePath("/", "layout");
  }

  const ticket: DigitalTicket = {
    reference: record.reference,
    eventSlug: record.eventSlug,
    eventTitle: record.eventTitle,
    date: record.date,
    time: record.time,
    quantity: record.quantity,
    purchaser: record.purchaser,
    email: record.email,
    amount: record.amountZar,
    status: record.status,
  };
  return NextResponse.json({ ticket, mock: false });
}
