/** Reservation ledger — the admin's record of every booking request.
 *
 *  Guests hand their booking to the restaurant over WhatsApp, so WhatsApp
 *  is the operational channel; this ledger exists purely so the record
 *  survives independently of that chat (mirrors lib/payments.ts).
 *
 *  Stored in Vercel Blob at reservations/<token>.json. The token is a
 *  random UUID and never the human-friendly reference — same unguessable-key
 *  trade-off used for the payment ledger and admin content. */

import crypto from "crypto";
import { list, put } from "@vercel/blob";

export interface ReservationRecord {
  token: string;
  reference: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: "indoor" | "outdoor";
  occasion?: string;
  specialRequests?: string;
  createdAt: string;
}

const blobPath = (token: string) => `reservations/${token}.json`;

export function createReservationToken() {
  return crypto.randomUUID();
}

export async function saveReservation(record: ReservationRecord) {
  await put(blobPath(record.token), JSON.stringify(record), {
    access: "public",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

/** Every reservation, newest first — the admin bookings view. */
export async function listReservations(): Promise<ReservationRecord[]> {
  const { blobs } = await list({ prefix: "reservations/", limit: 1000 });
  const results = await Promise.all(
    blobs.map(async (blob) => {
      try {
        const res = await fetch(`${blob.url}?t=${Date.now()}`, {
          cache: "no-store",
        });
        if (!res.ok) return null;
        return (await res.json()) as ReservationRecord;
      } catch {
        return null;
      }
    }),
  );
  return results
    .filter((r): r is ReservationRecord => Boolean(r?.token))
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}
