"use client";

import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/effects/SectionHeading";
import type { Testimonial } from "@/types";

function Stars({ rating }: { rating: number }) {
  return (
    <span
      className="flex gap-0.5 text-gold"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: rating }).map((_, i) => (
        <Star key={i} className="size-4 fill-current" aria-hidden />
      ))}
    </span>
  );
}

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const [emblaRef] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4600, stopOnInteraction: false, stopOnMouseEnter: true })],
  );

  return (
    <section
      id="testimonials"
      aria-label="Guest reviews"
      className="relative scroll-mt-24 bg-surface/40 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Guest Stories"
          title="Loved by Thousands"
          description="Five-star moments, in our guests' own words."
        />
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="min-w-0 shrink-0 basis-[88%] px-3 sm:basis-[55%] lg:basis-[33%]"
            >
              <figure className="glass relative flex h-full flex-col rounded-3xl p-7 transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold md:p-8">
                <Quote
                  aria-hidden
                  className="absolute right-6 top-6 size-8 text-gold/15"
                />
                <Stars rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/85 md:text-base">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-white/5 pt-5">
                  <Image
                    src={t.avatar}
                    alt=""
                    width={44}
                    height={44}
                    className="size-11 rounded-full border border-gold/30 object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted">
                      Google Review ·{" "}
                      {new Date(t.date).toLocaleDateString("en-ZA", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
