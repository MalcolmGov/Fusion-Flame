import { Clock, Mail, MapPin, Navigation, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getFaq, getRestaurant } from "@/services/content";

export function Contact() {
  const restaurant = getRestaurant();
  const faq = getFaq();
  const directionsHref = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(restaurant.mapQuery)}`;
  const mapEmbedSrc = `https://www.google.com/maps?q=${encodeURIComponent(restaurant.mapQuery)}&output=embed`;

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 bg-surface/40 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Find Us"
          title="Visit Fusion Flame"
          description="In the golden heart of Sandton — valet at the door, fire at the hearth."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          {/* Info */}
          <Reveal from="left">
            <div className="glass h-full rounded-3xl p-8 md:p-10">
              <ul className="space-y-7">
                <li className="flex gap-4">
                  <span className="glass flex size-11 shrink-0 items-center justify-center rounded-xl text-gold">
                    <MapPin className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                      Address
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted">
                      {restaurant.address.street}, {restaurant.address.suburb}
                      <br />
                      {restaurant.address.city}, {restaurant.address.postalCode}
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="glass flex size-11 shrink-0 items-center justify-center rounded-xl text-gold">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                      Phone
                    </h3>
                    <a
                      href={`tel:${restaurant.phone.replace(/\s/g, "")}`}
                      className="mt-1 block text-sm text-muted transition-colors hover:text-gold-light"
                    >
                      {restaurant.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="glass flex size-11 shrink-0 items-center justify-center rounded-xl text-gold">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                      Email
                    </h3>
                    <a
                      href={`mailto:${restaurant.email}`}
                      className="mt-1 block text-sm text-muted transition-colors hover:text-gold-light"
                    >
                      {restaurant.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="glass flex size-11 shrink-0 items-center justify-center rounded-xl text-gold">
                    <Clock className="size-5" aria-hidden />
                  </span>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-foreground">
                      Operating Hours
                    </h3>
                    <ul className="mt-1 space-y-1 text-sm text-muted">
                      {restaurant.hours.map((h) => (
                        <li key={h.days} className="flex justify-between gap-6">
                          <span>{h.days}</span>
                          <span className="text-foreground/75">
                            {h.open} – {h.close}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              </ul>

              <Button asChild className="mt-9 w-full" variant="outline">
                <a href={directionsHref} target="_blank" rel="noopener noreferrer">
                  <Navigation className="size-4" aria-hidden />
                  Get Directions
                </a>
              </Button>
            </div>
          </Reveal>

          {/* Map + FAQ */}
          <div className="space-y-6">
            <Reveal from="right">
              <div className="gold-ring overflow-hidden rounded-3xl">
                <iframe
                  title="Map to Fusion Flame"
                  src={mapEmbedSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-72 w-full border-0 opacity-90 grayscale-[0.35] contrast-[1.05] md:h-80"
                />
              </div>
            </Reveal>

            <Reveal from="right" delay={0.15}>
              <div className="glass rounded-3xl p-6 md:p-8">
                <h3 className="font-heading text-xl text-foreground">
                  Frequently Asked
                </h3>
                <div className="mt-4 space-y-2">
                  {faq.slice(0, 4).map((item) => (
                    <details
                      key={item.q}
                      className="group rounded-xl border border-white/5 bg-white/[0.02] px-4 py-3 transition-colors open:border-gold/25"
                    >
                      <summary className="cursor-pointer list-none text-sm font-medium text-foreground/90 transition-colors group-open:text-gold-light">
                        {item.q}
                      </summary>
                      <p className="mt-2 text-sm leading-relaxed text-muted">
                        {item.a}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
