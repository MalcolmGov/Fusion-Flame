import { NextResponse } from "next/server";
import { after } from "next/server";
import { isValidYocoWebhook } from "@/lib/yoco";
import { updatePaymentStatus } from "@/lib/payments";
import { sendEmail } from "@/lib/email";

/** Yoco webhook receiver.
 *
 *  Register once the client's live/test secret key is available:
 *    curl -X POST https://payments.yoco.com/api/webhooks \
 *      -H "Authorization: Bearer $YOCO_SECRET_KEY" \
 *      -H "Content-Type: application/json" \
 *      -d '{"name":"fusion-flame","url":"https://www.fusionflame.co.za/api/payments/yoco/webhook"}'
 *  The response's one-time `secret` becomes YOCO_WEBHOOK_SECRET.
 *
 *  Signature is verified before anything is trusted (see lib/yoco.ts). Per
 *  Yoco's guidance, this webhook — not the checkout redirect — is the only
 *  source of truth for payment success. */
export async function POST(request: Request) {
  const rawBody = await request.text();

  if (!isValidYocoWebhook(rawBody, request.headers)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  interface EventEnvelope {
    status?: string;
    id?: string;
    checkoutId?: string;
    metadata?: Record<string, string>;
  }
  let body: {
    type?: string;
    payload?: EventEnvelope;
    data?: EventEnvelope;
    metadata?: Record<string, string>;
  };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const type = body.type ?? "";
  const payload = body.payload ?? body.data ?? {};
  const status = payload.status;
  const token = payload.metadata?.token ?? body.metadata?.token;

  console.log("[yoco:webhook]", type, status ?? "", token ? `token=${token}` : "(no token)");

  if (!token) {
    // Nothing to reconcile against — acknowledge so Yoco stops retrying.
    return NextResponse.json({ received: true });
  }

  const succeeded = status === "succeeded" || type.includes("succeeded");
  const failed = status === "failed" || type.includes("failed");

  if (succeeded) {
    const updated = await updatePaymentStatus(token, {
      status: "paid",
      checkoutId: payload.checkoutId ?? payload.id,
    });
    if (updated) {
      after(() =>
        sendEmail({
          subject: `Ticket payment received — ${updated.eventTitle} [${updated.reference}]`,
          text: [
            "A ticket payment was completed on the website (Yoco):",
            "",
            `Reference: ${updated.reference}`,
            `Event: ${updated.eventTitle}`,
            `Tickets: ${updated.quantity}`,
            `Purchaser: ${updated.purchaser}`,
            `Email: ${updated.email}`,
            `Phone: ${updated.phone}`,
            `Amount: R ${updated.amountZar.toFixed(2)}`,
          ].join("\n"),
          replyTo: updated.email,
        }),
      );
    }
  } else if (failed) {
    await updatePaymentStatus(token, { status: "failed" });
  }

  return NextResponse.json({ received: true });
}
