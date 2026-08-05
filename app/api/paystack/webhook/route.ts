import { NextResponse } from "next/server";
import { after } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";
import { sendEmail } from "@/lib/email";

/** Paystack webhook receiver.
 *  Configure the URL in the Paystack dashboard: <site>/api/paystack/webhook
 *  Signature is verified with the secret key before any event is trusted. */
export async function POST(request: Request) {
  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature");

  if (!isValidWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as {
    event: string;
    data: {
      reference: string;
      status: string;
      amount?: number;
      customer?: { email?: string };
      metadata?: {
        eventTitle?: string;
        quantity?: number;
        purchaser?: string;
        phone?: string;
        channel?: string;
      };
    };
  };

  switch (payload.event) {
    case "charge.success": {
      console.log("[paystack:webhook] charge.success", payload.data.reference);
      const d = payload.data;
      const m = d.metadata ?? {};
      after(() =>
        sendEmail({
          subject: `Ticket payment received — ${m.eventTitle ?? "event"} [${d.reference}]`,
          text: [
            "A ticket payment was completed on the website:",
            "",
            `Reference: ${d.reference}`,
            `Event: ${m.eventTitle ?? "—"}`,
            `Tickets: ${m.quantity ?? "—"}`,
            `Purchaser: ${m.purchaser ?? "—"}`,
            `Email: ${d.customer?.email ?? "—"}`,
            `Phone: ${m.phone ?? "—"}`,
            `Amount: R ${((d.amount ?? 0) / 100).toFixed(2)}`,
            `Method: ${m.channel === "capitec-pay" ? "Capitec Pay" : "Card / Other"}`,
          ].join("\n"),
          replyTo: d.customer?.email,
        }),
      );
      break;
    }
    case "refund.processed":
      // TODO(admin-cms): mark ticket refunded, release seats.
      console.log("[paystack:webhook] refund.processed", payload.data.reference);
      break;
    default:
      console.log("[paystack:webhook] unhandled event", payload.event);
  }

  return NextResponse.json({ received: true });
}
