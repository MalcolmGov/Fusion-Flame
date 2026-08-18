/** Payment ledger — the source of truth the ticket success page trusts.
 *
 *  Yoco is explicit that a checkout's successUrl must never be treated as
 *  proof of payment; only the signature-verified webhook can confirm it.
 *  So checkout creation writes a "pending" record here, the webhook flips it
 *  to "paid"/"failed", and the success page polls this record — never Yoco
 *  directly, never the redirect URL alone.
 *
 *  Stored in Vercel Blob at payments/<token>.json. The token is a random
 *  UUID (never the human-friendly reference), so the record is effectively
 *  unguessable even though the store itself is public — the same trade-off
 *  already used for admin content, applied with a high-entropy key. */

import crypto from "crypto";
import { head, list, put } from "@vercel/blob";
import { getCheckoutStatus } from "./yoco";

export type PaymentStatus = "pending" | "paid" | "failed";

export interface PaymentRecord {
  token: string;
  reference: string;
  provider: "yoco";
  checkoutId?: string;
  status: PaymentStatus;
  eventSlug: string;
  eventTitle: string;
  date: string;
  time: string;
  quantity: number;
  purchaser: string;
  email: string;
  phone: string;
  amountZar: number;
  createdAt: string;
}

const blobPath = (token: string) => `payments/${token}.json`;

export function createPaymentToken() {
  return crypto.randomUUID();
}

export async function savePayment(record: PaymentRecord) {
  await put(blobPath(record.token), JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

export async function getPayment(
  token: string,
): Promise<PaymentRecord | null> {
  try {
    const meta = await head(blobPath(token));
    const res = await fetch(`${meta.url}?t=${Date.now()}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as PaymentRecord;
  } catch {
    return null;
  }
}

/** Every payment record, newest first — the admin sales view. */
export async function listPayments(): Promise<PaymentRecord[]> {
  const { blobs } = await list({ prefix: "payments/", limit: 1000 });
  const results = await Promise.all(
    blobs.map(async (blob) => {
      try {
        const res = await fetch(`${blob.url}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as PaymentRecord;
      } catch {
        return null;
      }
    }),
  );
  const records = results.filter((r): r is PaymentRecord => Boolean(r?.token));
  const reconciled = await Promise.all(records.map(reconcilePendingPayment));
  return reconciled.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function updatePaymentStatus(
  token: string,
  patch: Partial<Pick<PaymentRecord, "status" | "checkoutId">>,
): Promise<PaymentRecord | null> {
  const existing = await getPayment(token);
  if (!existing) return null;
  const updated = { ...existing, ...patch };
  await savePayment(updated);
  return updated;
}

/** Self-heals a "pending" record by asking Yoco directly. The webhook is
 *  still the primary path, but delivery isn't instant or guaranteed — this
 *  is the backstop so both the customer's ticket page and the admin sales
 *  view never get stuck showing a stale "pending" after Yoco has already
 *  resolved the payment. */
export async function reconcilePendingPayment(
  record: PaymentRecord,
): Promise<PaymentRecord> {
  if (record.status !== "pending" || !record.checkoutId?.startsWith("ch_")) {
    return record;
  }
  const live = await getCheckoutStatus(record.checkoutId);
  if (!live) return record;

  if (live.status === "succeeded") {
    return (await updatePaymentStatus(record.token, { status: "paid" })) ?? record;
  }
  if (["failed", "cancelled", "expired"].includes(live.status)) {
    return (await updatePaymentStatus(record.token, { status: "failed" })) ?? record;
  }
  return record;
}
