import type { Metadata } from "next";
import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Clock,
  MapPin,
  Shirt,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects/Reveal";
import { TicketCheckout } from "@/features/tickets/TicketCheckout";
import { PaymentNotice } from "@/features/tickets/PaymentNotice";
import {
  getEvent,
  getEvents,
  getRestaurant,
  isEventPast,
} from "@/services/content";
import { formatEventDate, formatZAR } from "@/lib/utils";
import { getSiteUrl } from "@/lib/site";
import type { RestaurantEvent, RestaurantInfo } from "@/types";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const events = await getEvents();
  return events.map((event) => ({ slug: event.slug }));
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEvent(slug);
  if (!event) return { title: "Event Not Found" };
  return {
    title: `${event.title} — Tickets`,
    description: event.description,
    openGraph: {
      title: `${event.title} | Fusion Flame`,
      description: event.description,
      images: [{ url: event.image }],
    },
    alternates: { canonical: `/events/${event.slug}` },
  };
}

function EventJsonLd({
  event,
  r,
}: {
  event: RestaurantEvent;
  r: RestaurantInfo;
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.title,
    description: event.description,
    image: event.image,
    startDate: event.date,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: r.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: r.address.street,
        addressLocality: `${r.address.suburb}, ${r.address.city}`,
        postalCode: r.address.postalCode,
        addressCountry: "ZA",
      },
    },
    offers: {
      "@type": "Offer",
      price: event.price,
      priceCurrency: "ZAR",
      availability:
        event.availableSeats > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      url: `${getSiteUrl()}/events/${event.slug}`,
    },
    organizer: { "@type": "Organization", name: r.name, url: getSiteUrl() },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const [event, restaurant] = await Promise.all([
    getEvent(slug),
    getRestaurant(),
  ]);
  if (!event) notFound();
  const past = isEventPast(event);

  return (
    <div className="relative pt-24 md:pt-28">
      <EventJsonLd event={event} r={restaurant} />

      {/* Hero banner */}
      <section className="relative h-[32vh] min-h-64 overflow-hidden md:h-[38vh]">
        {/* Decorative backdrop only — blurred so text-heavy poster uploads
            never fight the page's own heading. The full poster is shown
            un-cropped in the content area below. */}
        <Image
          src={event.image}
          alt=""
          aria-hidden
          fill
          priority
          sizes="100vw"
          className="scale-110 object-cover blur-xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-black/70 to-black/55"
        />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-5 pb-10 md:px-8">
          <nav aria-label="Breadcrumb" className="mb-4">
            <Link
              href="/#events"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/70 transition-colors hover:text-gold-light"
            >
              <ArrowLeft className="size-3.5" aria-hidden />
              All Events
            </Link>
          </nav>
          {event.recurring && (
            <Badge variant="fire" className="mb-3">
              {event.recurring}
            </Badge>
          )}
          <h1 className="font-heading text-4xl text-white md:text-6xl">
            <span className="text-gold-gradient">{event.title}</span>
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-5">
          <Reveal from="left" className="lg:col-span-3">
            {/* Full event poster/image, never cropped */}
            <div className="gold-ring mb-10 overflow-hidden rounded-3xl bg-black/40">
              <Image
                src={event.image}
                alt={`${event.title} — event poster`}
                width={1200}
                height={1500}
                sizes="(min-width: 1024px) 55vw, 92vw"
                priority
                className="h-auto w-full"
              />
            </div>

            <p className="text-lg leading-relaxed text-muted md:text-xl">
              {event.description}
            </p>

            <dl className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  icon: CalendarDays,
                  label: "Date",
                  value: formatEventDate(event.date),
                },
                { icon: Clock, label: "Time", value: event.time },
                {
                  icon: Users,
                  label: "Availability",
                  value: `${event.availableSeats} seats remaining`,
                },
                {
                  icon: MapPin,
                  label: "Venue",
                  value: `${restaurant.name}, ${restaurant.address.suburb}`,
                },
                ...(event.dressCode
                  ? [
                      {
                        icon: Shirt,
                        label: "Theme / Dress Code",
                        value: event.dressCode,
                      },
                    ]
                  : []),
              ].map((row) => (
                <div key={row.label} className="glass flex items-center gap-4 rounded-2xl p-5">
                  <row.icon className="size-5 shrink-0 text-gold" aria-hidden />
                  <div>
                    <dt className="text-[10px] uppercase tracking-[0.2em] text-muted">
                      {row.label}
                    </dt>
                    <dd className="mt-0.5 text-sm text-foreground">{row.value}</dd>
                  </div>
                </div>
              ))}
            </dl>

            <div className="glass mt-8 rounded-2xl p-6">
              <h2 className="font-heading text-xl text-foreground">
                Good to Know
              </h2>
              <ul className="mt-3 list-inside list-disc space-y-2 text-sm leading-relaxed text-muted">
                <li>Ticket price includes welcome drink on arrival.</li>
                <li>Dinner menu available à la carte throughout the event.</li>
                <li>Tickets are refundable up to 48 hours before the event.</li>
                <li>
                  {event.dressCode
                    ? `Theme / dress code: ${event.dressCode}.`
                    : "Smart casual dress code applies."}
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal from="right" delay={0.1} className="lg:col-span-2">
            {past ? (
              <div className="glass rounded-3xl p-8 text-center lg:sticky lg:top-28">
                <CalendarDays className="mx-auto size-8 text-muted" aria-hidden />
                <h2 className="font-heading mt-4 text-2xl text-foreground">
                  This Event Has Passed
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  Tickets are no longer available. Browse our upcoming events
                  — there&rsquo;s always another evening worth dressing up for.
                </p>
                <Button asChild className="mt-6">
                  <Link href="/#events">See Upcoming Events</Link>
                </Button>
              </div>
            ) : (
            <div className="lg:sticky lg:top-28">
              <Suspense fallback={null}>
                <PaymentNotice />
              </Suspense>
              <p className="mb-4 text-center font-heading text-3xl text-gold-gradient lg:text-left">
                {formatZAR(event.price)}
                <span className="ml-2 font-sans text-sm text-muted">
                  per person
                </span>
              </p>
              <TicketCheckout event={event} />
            </div>
            )}
          </Reveal>
        </div>
      </section>
    </div>
  );
}
