/** Yoco Checkout API (https://developer.yoco.com).
 *
 *  Environment variables:
 *  - YOCO_SECRET_KEY      sk_test_... / sk_live_... (Portal → Developers → API keys)
 *  - YOCO_WEBHOOK_SECRET  whsec_... (returned when registering the webhook)
 *
 *  With no secret key configured the checkout runs in keyless sandbox mode so
 *  the full ticket journey stays testable before the client's keys arrive. */

import crypto from "crypto";

const YOCO_BASE = "https://payments.yoco.com/api";

export function isYocoConfigured() {
  return Boolean(process.env.YOCO_SECRET_KEY);
}

interface CreateCheckoutArgs {
  /** Amount in Rands — converted to cents internally. */
  amountZar: number;
  successUrl: string;
  cancelUrl: string;
  failureUrl: string;
  /** Echoed back on the webhook — carries our reference + ticket details. */
  metadata: Record<string, string>;
  /** Idempotency: our payment reference. */
  reference: string;
}

export interface YocoCheckout {
  id: string;
  redirectUrl: string;
  status: string;
}

export async function createCheckout({
  amountZar,
  successUrl,
  cancelUrl,
  failureUrl,
  metadata,
  reference,
}: CreateCheckoutArgs): Promise<YocoCheckout> {
  const res = await fetch(`${YOCO_BASE}/checkouts`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": reference,
    },
    body: JSON.stringify({
      amount: Math.round(amountZar * 100),
      currency: "ZAR",
      successUrl,
      cancelUrl,
      failureUrl,
      externalId: reference,
      metadata,
    }),
    cache: "no-store",
  });

  const json = await res.json().catch(() => null);
  if (!res.ok || !json?.redirectUrl) {
    throw new Error(
      json?.description ?? json?.message ?? "Yoco checkout could not be created",
    );
  }
  return { id: json.id, redirectUrl: json.redirectUrl, status: json.status };
}

/** Reconciliation fallback for the ticket success page: if our webhook
 *  hasn't landed yet (or was ever dropped), ask Yoco directly rather than
 *  leaving the guest stuck on "pending" forever. */
export async function getCheckoutStatus(
  checkoutId: string,
): Promise<{ status: string } | null> {
  const res = await fetch(`${YOCO_BASE}/checkouts/${checkoutId}`, {
    headers: { Authorization: `Bearer ${process.env.YOCO_SECRET_KEY}` },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const json = await res.json().catch(() => null);
  if (!json?.status) return null;
  return { status: json.status };
}

/** Verify Yoco's webhook signature (svix-style):
 *  HMAC-SHA256 over `${webhook-id}.${webhook-timestamp}.${rawBody}` keyed with
 *  the base64-decoded whsec_ secret; compared constant-time against the
 *  `v1,`-prefixed signature header. */
export function isValidYocoWebhook(
  rawBody: string,
  headers: Headers,
): boolean {
  const secret = process.env.YOCO_WEBHOOK_SECRET;
  const id = headers.get("webhook-id");
  const timestamp = headers.get("webhook-timestamp");
  const signatureHeader = headers.get("webhook-signature");
  if (!secret || !id || !timestamp || !signatureHeader) return false;

  // Guard against replay: reject events older than 5 minutes.
  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (!Number.isFinite(age) || age > 300) return false;

  const secretBytes = Buffer.from(secret.replace(/^whsec_/, ""), "base64");
  const expected = crypto
    .createHmac("sha256", secretBytes)
    .update(`${id}.${timestamp}.${rawBody}`)
    .digest("base64");

  // Header may contain several space-separated `v1,<sig>` entries.
  return signatureHeader.split(" ").some((part) => {
    const sig = part.split(",")[1] ?? "";
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    return a.length === b.length && crypto.timingSafeEqual(a, b);
  });
}
