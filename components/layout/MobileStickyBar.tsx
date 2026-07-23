import Link from "next/link";
import { CalendarCheck, MessageCircle, Phone } from "lucide-react";

interface MobileStickyBarProps {
  phone: string;
  whatsappHref: string;
}

/** Bottom sticky action bar — mobile only. */
export function MobileStickyBar({ phone, whatsappHref }: MobileStickyBarProps) {
  return (
    <nav
      aria-label="Quick actions"
      className="glass-strong fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-white/10 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <Link
        href="/#reservations"
        className="flex flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-light"
      >
        <CalendarCheck className="size-5" aria-hidden />
        Reserve
      </Link>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className="flex flex-col items-center gap-1 border-x border-white/10 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#25d366]"
      >
        <MessageCircle className="size-5" aria-hidden />
        WhatsApp
      </a>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        className="flex flex-col items-center gap-1 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-foreground/80"
      >
        <Phone className="size-5" aria-hidden />
        Call
      </a>
    </nav>
  );
}
