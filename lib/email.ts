/** Email notifications for form submissions (reservations, newsletter,
 *  ticket payments). Delivered via Resend (https://resend.com) when
 *  RESEND_API_KEY is set; otherwise sends are skipped and logged so forms
 *  keep working before email is configured.
 *
 *  Environment variables:
 *  - RESEND_API_KEY   enables sending
 *  - EMAIL_FROM       verified sender, e.g. "Fusion Flame <bookings@fusionflame.com>"
 *                     (defaults to Resend's onboarding sender for first tests)
 *  - NOTIFY_EMAIL     override inbox for notifications (defaults to the
 *                     restaurant email managed in the admin panel)
 */

import { getRestaurant } from "@/services/content";

interface SendArgs {
  subject: string;
  text: string;
  /** Override recipient; defaults to the restaurant mailbox. */
  to?: string;
  /** Lets the restaurant hit Reply and reach the guest directly. */
  replyTo?: string;
}

export async function sendEmail({ subject, text, to, replyTo }: SendArgs) {
  const recipient =
    to ?? process.env.NOTIFY_EMAIL ?? (await getRestaurant()).email;

  if (!process.env.RESEND_API_KEY) {
    console.log("[email] skipped (RESEND_API_KEY not set):", subject, "→", recipient);
    return false;
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM ?? "Fusion Flame <onboarding@resend.dev>",
        to: [recipient],
        subject,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });
    if (!res.ok) {
      console.error("[email] send failed:", res.status, await res.text());
      return false;
    }
    console.log("[email] sent:", subject, "→", recipient);
    return true;
  } catch (err) {
    console.error("[email] send error:", err);
    return false;
  }
}
