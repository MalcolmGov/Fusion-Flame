"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone, Flame, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Announcement } from "@/types";

const NAV_LINKS = [
  { label: "About", href: "/#about" },
  { label: "Menu", href: "/#menu" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Events", href: "/#events" },
  { label: "Private Dining", href: "/#private-events" },
  { label: "Contact", href: "/#contact" },
];

export function Navbar({
  phone,
  announcement,
}: {
  phone: string;
  announcement?: Announcement;
}) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const pathname = usePathname();
  const showBanner = Boolean(
    announcement?.enabled && announcement.message && !bannerDismissed,
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "glass-strong py-2 shadow-luxe"
          : "bg-gradient-to-b from-black/70 to-transparent py-4",
      )}
    >
      {/* Announcement / promo bar — managed from the admin panel */}
      <AnimatePresence initial={false}>
        {showBanner && announcement && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="-mt-2 mb-2 overflow-hidden border-b border-gold/20 bg-[linear-gradient(90deg,rgba(221,169,67,0.16),rgba(249,19,4,0.12))]"
            role="region"
            aria-label="Announcement"
          >
            <div className="mx-auto flex max-w-7xl items-center justify-center gap-3 px-10 py-2 text-center">
              <Flame className="hidden size-3.5 shrink-0 text-flame-orange sm:block" aria-hidden />
              <p className="text-xs text-foreground/90 md:text-[13px]">
                {announcement.message}
                {announcement.linkHref && announcement.linkLabel ? (
                  <Link
                    href={announcement.linkHref}
                    className="ml-2 inline-flex items-center gap-1 py-2.5 font-semibold text-gold-light underline-offset-4 hover:underline"
                  >
                    {announcement.linkLabel}
                    <ArrowRight className="size-3" aria-hidden />
                  </Link>
                ) : null}
              </p>
              <button
                type="button"
                onClick={() => setBannerDismissed(true)}
                aria-label="Dismiss announcement"
                className="absolute right-1 flex size-10 items-center justify-center rounded-full text-muted transition-colors hover:text-foreground"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 md:px-8">
        <Link
          href="/"
          aria-label="Fusion Flame — home"
          className="flex items-center gap-3"
        >
          <Image
            src="/logo.jpeg"
            alt="Fusion Flame logo"
            width={54}
            height={54}
            priority
            className="mix-blend-screen transition-transform duration-500 hover:scale-105"
          />
          <span className="font-heading text-lg tracking-wide md:text-xl">
            <span className="text-gold-gradient">Fusion</span>{" "}
            <span className="text-red-gradient">Flame</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-8 lg:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="link-underline text-[13px] font-medium uppercase tracking-[0.18em] text-foreground/80 transition-colors hover:text-gold-light"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={`tel:${phone.replace(/\s/g, "")}`}
            className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-gold-light"
            aria-label={`Call us on ${phone}`}
          >
            <Phone className="size-4 text-gold" aria-hidden />
            {phone}
          </a>
          <Button asChild size="sm">
            <Link href="/#reservations">Reserve a Table</Link>
          </Button>
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-foreground lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="size-6" /> : <Menu className="size-6" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="glass-strong overflow-hidden border-t border-white/5 lg:hidden"
          >
            <ul className="space-y-1 px-6 py-6">
              {NAV_LINKS.map((link, i) => (
                <motion.li
                  key={link.href}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-heading text-2xl text-foreground/90 transition-colors hover:text-gold-light"
                  >
                    {link.label}
                  </Link>
                </motion.li>
              ))}
              <li className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/#reservations" onClick={() => setOpen(false)}>
                    Reserve a Table
                  </Link>
                </Button>
              </li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
