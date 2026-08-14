"use client";

import { useSearchParams } from "next/navigation";
import { TriangleAlert } from "lucide-react";

/** Reads the `payment` query param client-side so the event page itself
 *  stays fully static (reading searchParams in the server component would
 *  force it out of generateStaticParams' prerendering — see DYNAMIC_SERVER_USAGE). */
export function PaymentNotice() {
  const searchParams = useSearchParams();
  const payment = searchParams.get("payment");

  const message =
    payment === "cancelled"
      ? "Checkout was cancelled — no money left your account. Ready when you are."
      : payment === "failed"
        ? "That payment didn't go through — no money left your account. Please try again."
        : null;

  if (!message) return null;

  return (
    <p
      role="alert"
      className="mb-4 flex items-start gap-2 rounded-xl border border-flame-red/40 bg-flame-red/10 px-4 py-3 text-sm text-flame-red"
    >
      <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {message}
    </p>
  );
}
