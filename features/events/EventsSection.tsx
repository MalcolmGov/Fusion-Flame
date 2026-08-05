import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Clock, Shirt, Ticket, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { formatEventDate, formatZAR } from "@/lib/utils";
import type { RestaurantEvent } from "@/types";

export function EventsSection({ events }: { events: RestaurantEvent[] }) {
  return (
    <section
      id="events"
      className="relative scroll-mt-24 bg-surface/40 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Upcoming Events"
          title="Evenings Worth Dressing Up For"
          description="Live music, jazz, comedy and once-a-year galas — secure your seat before the room fills."
        />

        {/* flex-wrap + justify-center keeps 1–3 cards centred while a full
            row still lays out as a 4-up grid */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-7">
          {events.map((event, i) => (
            <Reveal
              key={event.slug}
              delay={(i % 4) * 0.08}
              className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.3125rem)]"
            >
              <article className="group gold-ring flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow-fire">
                <div className="img-zoom relative aspect-[16/10]">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
                  />
                  {event.recurring && (
                    <Badge variant="fire" className="absolute left-3 top-3">
                      {event.recurring}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-1 flex-col p-5 md:p-6">
                  <h3 className="font-heading text-xl leading-snug text-foreground transition-colors duration-300 group-hover:text-gold-light">
                    {event.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">
                    {event.description}
                  </p>

                  <dl className="mt-4 space-y-2 text-xs text-muted">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="size-3.5 text-gold" aria-hidden />
                      <dt className="sr-only">Date</dt>
                      <dd>{formatEventDate(event.date)}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="size-3.5 text-gold" aria-hidden />
                      <dt className="sr-only">Time</dt>
                      <dd>{event.time}</dd>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="size-3.5 text-gold" aria-hidden />
                      <dt className="sr-only">Availability</dt>
                      <dd>{event.availableSeats} seats available</dd>
                    </div>
                    {event.dressCode ? (
                      <div className="flex items-center gap-2">
                        <Shirt className="size-3.5 text-gold" aria-hidden />
                        <dt className="sr-only">Theme / dress code</dt>
                        <dd>{event.dressCode}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-5 flex items-center justify-between border-t border-white/5 pt-4">
                    <span className="font-heading text-lg text-gold-gradient">
                      {formatZAR(event.price)}
                      <span className="ml-1 text-xs font-sans text-muted">
                        p/p
                      </span>
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/events/${event.slug}`}>
                        <Ticket className="size-3.5" aria-hidden />
                        Buy Ticket
                      </Link>
                    </Button>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
