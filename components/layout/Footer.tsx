import Image from "next/image";
import Link from "next/link";
import {
  FacebookIcon,
  InstagramIcon,
  TikTokIcon,
  XIcon,
} from "@/components/ui/social-icons";
import { getRestaurant } from "@/services/content";

const SOCIAL_ICONS: Record<string, typeof InstagramIcon> = {
  Instagram: InstagramIcon,
  Facebook: FacebookIcon,
  X: XIcon,
  TikTok: TikTokIcon,
};

export async function Footer() {
  const restaurant = await getRestaurant();

  return (
    <footer className="relative border-t border-white/5 bg-surface/60 print:hidden">
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
      />
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-3">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image
                src="/logo.jpeg"
                alt="Fusion Flame logo"
                width={64}
                height={64}
                className="mix-blend-screen"
              />
              <span className="font-heading text-xl">
                <span className="text-gold-gradient">Fusion</span>{" "}
                <span className="text-red-gradient">Flame</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              {restaurant.tagline}
            </p>
            <div className="mt-6 flex gap-3">
              {restaurant.social.map((s) => {
                const Icon = SOCIAL_ICONS[s.platform] ?? InstagramIcon;
                return (
                  <a
                    key={s.platform}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Fusion Flame on ${s.platform}`}
                    className="glass flex size-10 items-center justify-center rounded-full text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold-light hover:shadow-glow-gold"
                  >
                    <Icon className="size-4" aria-hidden />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <h3 className="eyebrow mb-5">Explore</h3>
            <ul className="text-sm text-muted">
              {[
                ["Our Story", "/#about"],
                ["Gallery", "/#gallery"],
                ["Events & Tickets", "/#events"],
                ["Reservations", "/#reservations"],
              ].map(([label, href]) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="link-underline inline-block py-2 transition-colors hover:text-gold-light"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Hours */}
          <div>
            <h3 className="eyebrow mb-5">Opening Hours</h3>
            <ul className="space-y-3 text-sm text-muted">
              {restaurant.hours.map((h) => (
                <li key={h.days} className="flex justify-between gap-4">
                  <span>{h.days}</span>
                  <span className="text-foreground/80">
                    {h.open} – {h.close}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-6 space-y-2 text-sm text-muted">
              <p>
                {restaurant.address.street}, {restaurant.address.suburb}
              </p>
              <p>
                {restaurant.address.city}, {restaurant.address.postalCode}
              </p>
              <a
                href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
                className="-my-2 block py-2 transition-colors hover:text-gold-light"
              >
                {restaurant.phone}
              </a>
              <a
                href={`mailto:${restaurant.email}`}
                className="-my-2 block py-2 transition-colors hover:text-gold-light"
              >
                {restaurant.email}
              </a>
            </div>
          </div>

        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted md:flex-row">
          <p>
            © {new Date().getFullYear()} {restaurant.name}. All rights reserved.
          </p>
          <p className="font-accent text-sm italic text-gold/70">
            Ignite your taste experience.
          </p>
        </div>
      </div>
    </footer>
  );
}
