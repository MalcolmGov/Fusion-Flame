import crypto from "crypto";

export function getSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000")
  );
}

// Excludes visually-ambiguous characters (0/O, 1/I/L) so codes are easy to
// read back over the phone or WhatsApp.
const REFERENCE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Short, human-friendly reference — e.g. "FF-RES-7K4XPT". 6 characters
 *  from a 32-symbol alphabet (32^6 ≈ 1.07 billion combinations) is ample
 *  headroom for this business's volume; references are a display label,
 *  not a lookup key, so brevity matters far more than cryptographic
 *  collision resistance. */
export function generateReference(prefix: string) {
  const bytes = crypto.randomBytes(6);
  let code = "";
  for (let i = 0; i < bytes.length; i++) {
    code += REFERENCE_ALPHABET[bytes[i] % REFERENCE_ALPHABET.length];
  }
  return `${prefix}-${code}`;
}
