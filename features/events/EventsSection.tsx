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

        {/* Large horizontal feature cards — poster left (never cropped),
            details right; stacks on mobile */}
        <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:gap-10">
          {events.map((event, i) => (
            <Reveal key={event.slug} delay={i * 0.08}>
              <article className="group gold-ring grid overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1 hover:shadow-glow-fire md:grid-cols-5">
                {/* Poster — object-contain so text posters stay fully legible */}
                <div className="relative bg-black/40 md:col-span-2">
                  <div className="relative aspect-[4/5] md:absolute md:inset-0 md:aspect-auto">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      sizes="(min-width: 768px) 40vw, 92vw"
                      className="object-contain"
                    />
                  </div>
                  {event.recurring && (
                    <Badge variant="fire" className="absolute left-4 top-4">
                      {event.recurring}
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col p-6 md:col-span-3 md:p-9">
                  <h3 className="font-heading text-2xl leading-snug text-foreground transition-colors duration-300 group-hover:text-gold-light md:text-3xl">
                    {event.title}
                  </h3>
                  <p className="mt-3 text-base leading-relaxed text-muted">
                    {event.description}
                  </p>

                  <dl className="mt-6 grid gap-3 text-sm text-muted sm:grid-cols-2">
                    <div className="flex items-center gap-2.5">
                      <CalendarDays className="size-4 shrink-0 text-gold" aria-hidden />
                      <dt className="sr-only">Date</dt>
                      <dd>{formatEventDate(event.date)}</dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="size-4 shrink-0 text-gold" aria-hidden />
                      <dt className="sr-only">Time</dt>
                      <dd>{event.time}</dd>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Users className="size-4 shrink-0 text-gold" aria-hidden />
                      <dt className="sr-only">Availability</dt>
                      <dd>{event.availableSeats} seats available</dd>
                    </div>
                    {event.dressCode ? (
                      <div className="flex items-center gap-2.5">
                        <Shirt className="size-4 shrink-0 text-gold" aria-hidden />
                        <dt className="sr-only">Theme / dress code</dt>
                        <dd>{event.dressCode}</dd>
                      </div>
                    ) : null}
                  </dl>

                  <div className="mt-auto flex flex-col gap-4 border-t border-white/5 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <span className="font-heading text-2xl text-gold-gradient md:text-3xl">
                      {formatZAR(event.price)}
                      <span className="ml-1.5 font-sans text-sm text-muted">
                        per person
                      </span>
                    </span>
                    <Button asChild variant="outline">
                      <Link href={`/events/${event.slug}`}>
                        <Ticket className="size-4" aria-hidden />
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
