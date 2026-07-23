/** Server-side Paystack helpers.
 *
 *  Environment variables:
 *  - PAYSTACK_SECRET_KEY        sk_test_xxx / sk_live_xxx
 *  - NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY  pk_test_xxx / pk_live_xxx (client widget, optional)
 *  - NEXT_PUBLIC_SITE_URL       canonical site URL for callbacks
 *
 *  When PAYSTACK_SECRET_KEY is not set, the integration runs in mock mode so the
 *  full ticket flow remains demonstrable before go-live.
 */

import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export function isPaystackConfigured() {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

interface InitializeArgs {
  email: string;
  /** Amount in Rands — converted to kobo/cents internally. */
  amountZar: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, unknown>;
}

export async function initializeTransaction({
  email,
  amountZar,
  reference,
  callbackUrl,
  metadata,
}: InitializeArgs): Promise<{ authorizationUrl: string; reference: string }> {
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amountZar * 100),
      currency: "ZAR",
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
    cache: "no-store",
  });

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Paystack initialization failed");
  }
  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference,
  };
}

export interface VerifiedTransaction {
  status: "success" | "failed" | "abandoned" | string;
  reference: string;
  amountZar: number;
  paidAt: string | null;
  metadata: Record<string, unknown>;
  customerEmail: string;
}

export async function verifyTransaction(
  reference: string,
): Promise<VerifiedTransaction> {
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
      cache: "no-store",
    },
  );

  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Paystack verification failed");
  }
  const d = json.data;
  return {
    status: d.status,
    reference: d.reference,
    amountZar: d.amount / 100,
    paidAt: d.paid_at ?? null,
    metadata: d.metadata ?? {},
    customerEmail: d.customer?.email ?? "",
  };
}

/** Refund support — issue a full or partial refund for a transaction. */
export async function refundTransaction(reference: string, amountZar?: number) {
  const res = await fetch(`${PAYSTACK_BASE}/refund`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction: reference,
      ...(amountZar ? { amount: Math.round(amountZar * 100) } : {}),
    }),
    cache: "no-store",
  });
  const json = await res.json();
  if (!res.ok || !json.status) {
    throw new Error(json.message ?? "Paystack refund failed");
  }
  return json.data;
}

/** Verify the x-paystack-signature header on webhook payloads. */
export function isValidWebhookSignature(rawBody: string, signature: string | null) {
  if (!signature || !process.env.PAYSTACK_SECRET_KEY) return false;
  const hash = crypto
    .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
    .update(rawBody)
    .digest("hex");
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export function generateReference(prefix: string) {
  return `${prefix}-${Date.now().toString(36).toUpperCase()}-${crypto
    .randomBytes(3)
    .toString("hex")
    .toUpperCase()}`;
}
