"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app-error]", error);
  }, [error]);

  return (
    <div className="fire-ambience flex min-h-svh flex-col items-center justify-center px-5 text-center">
      <h1 className="font-heading text-5xl text-gold-gradient">
        The Flame Flickered
      </h1>
      <p className="mt-4 max-w-md leading-relaxed text-muted">
        Something went wrong on our side. Give it another try — the kitchen is
        already on it.
      </p>
      <Button size="lg" className="mt-8" onClick={reset}>
        Try Again
      </Button>
    </div>
  );
}
