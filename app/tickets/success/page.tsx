import type { Metadata } from "next";
import { Suspense } from "react";
import { TicketView } from "@/features/tickets/TicketView";

export const metadata: Metadata = {
  title: "Your Ticket",
  robots: { index: false },
};

export default function TicketSuccessPage() {
  return (
    <div className="fire-ambience min-h-svh px-5 pb-24 pt-32 md:pt-40">
      <Suspense
        fallback={
          <div className="mx-auto max-w-lg">
            <div className="skeleton h-96 rounded-3xl" />
          </div>
        }
      >
        <TicketView />
      </Suspense>
    </div>
  );
}
