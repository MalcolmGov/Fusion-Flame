/** Admin session auth.
 *
 *  - ADMIN_PASSWORD (env) gates the panel. In local development it falls back
 *    to "admin" so the panel works out of the box; in production the panel is
 *    disabled until the env var is set.
 *  - Sessions are stateless: an HMAC-signed expiry token in an httpOnly cookie.
 *  - Optional ADMIN_SESSION_SECRET decouples session signing from the password
 *    (rotating the password then invalidates sessions either way). */

import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "ff_admin_session";
const SESSION_HOURS = 12;

function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  return process.env.NODE_ENV === "development" ? "admin" : null;
}

function sessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET ?? `ff-session::${adminPassword()}`;
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", sessionSecret())
    .update(payload)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const ha = crypto.createHash("sha256").update(a).digest();
  const hb = crypto.createHash("sha256").update(b).digest();
  return crypto.timingSafeEqual(ha, hb);
}

export function isAdminConfigured() {
  return adminPassword() !== null;
}

export function checkPassword(candidate: string) {
  const expected = adminPassword();
  return expected !== null && candidate.length > 0 && safeEqual(candidate, expected);
}

export function createSessionToken() {
  const exp = Date.now() + SESSION_HOURS * 3600_000;
  return `${exp}.${sign(String(exp))}`;
}

export function verifySessionToken(token: string | undefined | null) {
  if (!token || !isAdminConfigured()) return false;
  const [expStr, sig] = token.split(".");
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  return safeEqual(sig, sign(expStr));
}

export async function isAdminAuthenticated() {
  const store = await cookies();
  return verifySessionToken(store.get(ADMIN_COOKIE)?.value);
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_HOURS * 3600,
} as const;
