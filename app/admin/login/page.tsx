"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/form-fields";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error ?? "Login failed");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
      setBusy(false);
    }
  }

  return (
    <div className="fire-ambience flex min-h-svh items-center justify-center px-5">
      <form
        onSubmit={submit}
        className="gold-ring w-full max-w-sm rounded-3xl p-8 text-center"
      >
        <Image
          src="/logo.jpeg"
          alt="Fusion Flame"
          width={110}
          height={110}
          className="mx-auto mix-blend-screen"
          priority
        />
        <h1 className="font-heading mt-4 text-2xl text-gold-gradient">
          Admin Panel
        </h1>
        <p className="mt-2 text-sm text-muted">
          Manage menus, pricing, events and content.
        </p>

        <div className="mt-6 text-left">
          <Label htmlFor="admin-password">Password</Label>
          <Input
            id="admin-password"
            type="password"
            autoFocus
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error ? (
          <p role="alert" className="mt-3 text-sm text-flame-red">
            {error}
          </p>
        ) : null}

        <Button type="submit" disabled={busy || !password} className="mt-6 w-full">
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Lock className="size-4" aria-hidden />
          )}
          {busy ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
