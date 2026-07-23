import { NextResponse } from "next/server";
import { isValidWebhookSignature } from "@/lib/paystack";

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
    data: { reference: string; status: string };
  };

  switch (payload.event) {
    case "charge.success":
      // TODO(admin-cms): mark ticket paid, decrement seats, send email w/ QR.
      console.log("[paystack:webhook] charge.success", payload.data.reference);
      break;
    case "refund.processed":
      // TODO(admin-cms): mark ticket refunded, release seats.
      console.log("[paystack:webhook] refund.processed", payload.data.reference);
      break;
    default:
      console.log("[paystack:webhook] unhandled event", payload.event);
  }

  return NextResponse.json({ received: true });
}
