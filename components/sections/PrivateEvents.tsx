import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getPrivateEventTypes, getWhatsAppLink } from "@/services/content";

export async function PrivateEvents() {
  const [types, quoteHref] = await Promise.all([
    getPrivateEventTypes(),
    getWhatsAppLink(
      "Hi Fusion Flame, I'd like to request a quote for a private event.",
    ),
  ]);

  return (
    <section
      id="private-events"
      className="fire-ambience relative scroll-mt-24 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Private Events"
          title="Your Occasion, Our Fire"
          description="From boardroom dinners to wedding celebrations — exclusive spaces, bespoke menus and a team that sweats the details."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {types.map((type, i) => (
            <Reveal key={type.id} delay={(i % 3) * 0.1}>
              <article className="group img-zoom relative h-80 overflow-hidden rounded-3xl border border-white/5 transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold">
                <Image
                  src={type.image}
                  alt={type.title}
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent"
                />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <p className="eyebrow mb-2 text-[10px]">{type.capacity}</p>
                  <h3 className="font-heading text-2xl text-white transition-colors duration-300 group-hover:text-gold-light">
                    {type.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 opacity-0 transition-all duration-500 group-hover:opacity-100">
                    {type.description}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Button asChild size="lg">
            <a href={quoteHref} target="_blank" rel="noopener noreferrer">
              Request a Quote
              <ArrowUpRight className="size-4" aria-hidden />
            </a>
          </Button>
          <p className="mt-4 text-sm text-muted">
            Our events team responds within 24 hours.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
