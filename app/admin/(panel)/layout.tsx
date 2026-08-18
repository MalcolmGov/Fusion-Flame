import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CalendarDays, ExternalLink, LayoutDashboard, Ticket } from "lucide-react";
import { isAdminAuthenticated } from "@/lib/admin/auth";
import { ADMIN_COLLECTIONS } from "@/lib/admin/schema";
import { LogoutButton } from "@/components/admin/LogoutButton";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  if (!(await isAdminAuthenticated())) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-svh">
      {/* Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/5 bg-surface/60 p-4 md:flex">
        <Link href="/admin" className="mb-6 flex items-center gap-2 px-2 pt-2">
          <Image
            src="/logo.jpeg"
            alt=""
            width={40}
            height={40}
            className="mix-blend-screen"
          />
          <span className="font-heading text-sm">
            <span className="text-gold-gradient">Fusion</span>{" "}
            <span className="text-red-gradient">Flame</span>
            <span className="ml-1.5 text-[10px] uppercase tracking-[0.2em] text-muted">
              Admin
            </span>
          </span>
        </Link>

        <nav aria-label="Admin" className="flex-1 space-y-1 overflow-y-auto">
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-gold-light"
          >
            <LayoutDashboard className="size-4" aria-hidden />
            Dashboard
          </Link>
          <Link
            href="/admin/tickets"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-gold-light"
          >
            <Ticket className="size-4" aria-hidden />
            Ticket Sales
          </Link>
          <Link
            href="/admin/reservations"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-gold-light"
          >
            <CalendarDays className="size-4" aria-hidden />
            Reservations
          </Link>
          <p className="px-3 pb-1 pt-4 text-[10px] uppercase tracking-[0.24em] text-muted/60">
            Content
          </p>
          {ADMIN_COLLECTIONS.map((c) => (
            <Link
              key={c.key}
              href={`/admin/content/${c.key}`}
              className="block rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-gold-light"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/5 pt-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-muted transition-colors hover:bg-white/5 hover:text-gold-light"
          >
            <ExternalLink className="size-4" aria-hidden />
            View Site
          </a>
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile top bar + content */}
      <div className="min-w-0 flex-1">
        <div className="glass-strong flex items-center justify-between gap-2 border-b border-white/5 px-4 py-3 md:hidden">
          <Link href="/admin" className="font-heading text-sm text-gold-gradient">
            Fusion Flame Admin
          </Link>
          <a href="/" target="_blank" rel="noopener noreferrer" className="text-xs text-muted">
            View Site
          </a>
        </div>
        {/* Mobile collection switcher */}
        <nav
          aria-label="Admin sections"
          className="scrollbar-none flex gap-2 overflow-x-auto border-b border-white/5 px-4 py-3 md:hidden"
        >
          <Link
            href="/admin/tickets"
            className="glass shrink-0 rounded-full px-4 py-1.5 text-xs text-gold-light"
          >
            Ticket Sales
          </Link>
          <Link
            href="/admin/reservations"
            className="glass shrink-0 rounded-full px-4 py-1.5 text-xs text-gold-light"
          >
            Reservations
          </Link>
          {ADMIN_COLLECTIONS.map((c) => (
            <Link
              key={c.key}
              href={`/admin/content/${c.key}`}
              className="glass shrink-0 rounded-full px-4 py-1.5 text-xs text-muted"
            >
              {c.label}
            </Link>
          ))}
        </nav>

        <main className="p-5 md:p-10">{children}</main>
      </div>
    </div>
  );
}
