import {
  Baby,
  Beef,
  Flame,
  Martini,
  UtensilsCrossed,
  Wine,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getOffers } from "@/services/content";

const ICONS: Record<string, LucideIcon> = {
  Beef,
  Martini,
  Wine,
  UtensilsCrossed,
  Baby,
  Flame,
};

export function Offers() {
  const offers = getOffers();

  return (
    <section
      id="offers"
      className="relative scroll-mt-24 bg-surface/40 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Special Offers"
          title="Every Day Has a Golden Hour"
          description="Weekly rituals worth planning around — from steak nights to happy hours."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {offers.map((offer, i) => {
            const Icon = ICONS[offer.icon] ?? Flame;
            return (
              <Reveal key={offer.id} delay={(i % 3) * 0.1}>
                <article className="group gold-ring relative flex h-full flex-col overflow-hidden rounded-3xl p-7 transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow-gold">
                  <div
                    aria-hidden
                    className="absolute -right-10 -top-10 size-36 rounded-full bg-flame-orange/8 blur-2xl transition-all duration-700 group-hover:bg-flame-orange/15"
                  />
                  <div className="flex items-start justify-between">
                    <span className="glass flex size-13 items-center justify-center rounded-2xl p-3 text-gold transition-all duration-500 group-hover:shadow-glow-gold">
                      <Icon className="size-6" aria-hidden />
                    </span>
                    <span className="font-heading text-2xl text-fire-gradient">
                      {offer.highlight}
                    </span>
                  </div>
                  <h3 className="font-heading mt-5 text-2xl text-foreground transition-colors duration-300 group-hover:text-gold-light">
                    {offer.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                    {offer.description}
                  </p>
                  <p className="eyebrow mt-5 text-[10px]">{offer.day}</p>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 text-center">
          <Button asChild size="lg" variant="outline">
            <Link href="/#reservations">Book Your Table</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
