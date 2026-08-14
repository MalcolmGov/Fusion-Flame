import Link from "next/link";
import {
  CalendarDays,
  ChefHat,
  GalleryHorizontal,
  Megaphone,
  Settings2,
  Ticket,
  UtensilsCrossed,
  ArrowRight,
  Database,
} from "lucide-react";
import { ADMIN_COLLECTIONS } from "@/lib/admin/schema";

const ICONS: Record<string, typeof Megaphone> = {
  announcement: Megaphone,
  menu: UtensilsCrossed,
  events: CalendarDays,
  gallery: GalleryHorizontal,
  chef: ChefHat,
  restaurant: Settings2,
};

export default function AdminDashboard() {
  const blobConnected = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
  const isProd = Boolean(process.env.VERCEL);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl text-gold-gradient md:text-4xl">
        Welcome back
      </h1>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
        Everything on the website — menus, pricing, events, photos, offers and
        announcements — is managed from here. Changes go live the moment you
        press Publish. No code, no redeploys.
      </p>

      {isProd && !blobConnected ? (
        <div className="mt-6 flex items-start gap-3 rounded-2xl border border-flame-orange/40 bg-flame-orange/10 p-4 text-sm">
          <Database className="mt-0.5 size-4 shrink-0 text-flame-orange" aria-hidden />
          <p className="text-foreground/85">
            <strong>Storage not connected.</strong> To save changes in
            production, add a Blob store to this project in Vercel
            (Storage&nbsp;→&nbsp;Create&nbsp;→&nbsp;Blob). Until then the site
            serves its built-in content.
          </p>
        </div>
      ) : null}

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/admin/tickets"
          className="group gold-ring rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-gold"
        >
          <span className="glass flex size-10 items-center justify-center rounded-xl text-gold">
            <Ticket className="size-5" aria-hidden />
          </span>
          <h2 className="mt-4 flex items-center gap-1.5 font-heading text-lg text-foreground transition-colors group-hover:text-gold-light">
            Ticket Sales
            <ArrowRight
              className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
              aria-hidden
            />
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            Every ticket order, with revenue and per-event totals from the
            payment ledger.
          </p>
        </Link>
        {ADMIN_COLLECTIONS.map((c) => {
          const Icon = ICONS[c.key] ?? Settings2;
          return (
            <Link
              key={c.key}
              href={`/admin/content/${c.key}`}
              className="group gold-ring rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-gold"
            >
              <span className="glass flex size-10 items-center justify-center rounded-xl text-gold">
                <Icon className="size-5" aria-hidden />
              </span>
              <h2 className="mt-4 flex items-center gap-1.5 font-heading text-lg text-foreground transition-colors group-hover:text-gold-light">
                {c.label}
                <ArrowRight
                  className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                  aria-hidden
                />
              </h2>
              <p className="mt-1 text-xs leading-relaxed text-muted">
                {c.description}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
