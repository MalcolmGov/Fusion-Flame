"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";

export function CancelTicketButton({
  token,
  reference,
}: {
  token: string;
  reference: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        disabled={isPending}
        onClick={() => {
          if (!confirm(`Cancel order ${reference}? This can't be undone.`)) return;
          setError(null);
          startTransition(async () => {
            const res = await fetch(`/api/admin/tickets/${token}/cancel`, {
              method: "POST",
            });
            if (!res.ok) {
              const body = await res.json().catch(() => null);
              setError(body?.error ?? "Could not cancel this order");
              return;
            }
            router.refresh();
          });
        }}
        className="inline-flex cursor-pointer items-center gap-1 rounded-full border border-white/15 px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:border-flame-red/40 hover:text-flame-red disabled:cursor-not-allowed disabled:opacity-50"
      >
        <X className="size-3" aria-hidden />
        {isPending ? "Cancelling…" : "Cancel"}
      </button>
      {error ? <p className="text-[10px] text-flame-red">{error}</p> : null}
    </div>
  );
}
