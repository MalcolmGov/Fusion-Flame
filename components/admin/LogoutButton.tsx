"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={async () => {
        await fetch("/api/admin/login", { method: "DELETE" });
        router.replace("/admin/login");
        router.refresh();
      }}
      className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-flame-red"
    >
      <LogOut className="size-4" aria-hidden />
      Sign Out
    </button>
  );
}
