"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { cn, formatZAR } from "@/lib/utils";
import type { SignatureDish } from "@/types";

export function SignatureCarousel({ dishes }: { dishes: SignatureDish[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, duration: 34 }, [
    Autoplay({ delay: 5600, stopOnInteraction: true }),
  ]);
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <section
      id="signature-dishes"
      aria-label="Signature dishes"
      className="fire-ambience relative scroll-mt-24 overflow-hidden py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Chef's Theatre"
          title="Signature Dishes"
          description="The plates that made our name — carved, flamed and finished before your eyes."
        />
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y">
          {dishes.map((dish, i) => (
            <div
              key={dish.id}
              className="min-w-0 shrink-0 basis-[88%] px-3 sm:basis-[72%] md:px-5 lg:basis-[62%]"
            >
              <motion.figure
                animate={{
                  scale: selected === i ? 1 : 0.93,
                  opacity: selected === i ? 1 : 0.45,
                }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="gold-ring group relative overflow-hidden rounded-[2rem]"
              >
                <div className="img-zoom relative aspect-[16/9]">
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    fill
                    sizes="(min-width: 1024px) 62vw, 88vw"
                    className="object-cover"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 p-6 md:p-10">
                  <p className="font-accent text-base italic text-gold-light md:text-lg">
                    {dish.tagline}
                  </p>
                  <h3 className="font-heading mt-1 text-2xl text-white md:text-4xl">
                    {dish.name}
                  </h3>
                  <p className="mt-2 hidden max-w-xl text-sm leading-relaxed text-white/70 md:block">
                    {dish.description}
                  </p>
                  <div className="mt-4 flex items-center gap-5">
                    <span className="font-heading text-xl text-gold-gradient md:text-2xl">
                      {formatZAR(dish.price)}
                    </span>
                    <Button asChild size="sm" variant="outline">
                      <Link href="/#reservations">Order at Your Table</Link>
                    </Button>
                  </div>
                </figcaption>
              </motion.figure>
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="mt-10 flex items-center justify-center gap-6">
        <button
          type="button"
          aria-label="Previous dish"
          onClick={() => emblaApi?.scrollPrev()}
          className="glass flex size-12 items-center justify-center rounded-full text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold-light hover:shadow-glow-gold cursor-pointer"
        >
          <ArrowLeft className="size-5" aria-hidden />
        </button>
        <div className="flex" role="tablist" aria-label="Dish slides">
          {dishes.map((dish, i) => (
            <button
              key={dish.id}
              role="tab"
              aria-selected={selected === i}
              aria-label={`Go to ${dish.name}`}
              onClick={() => emblaApi?.scrollTo(i)}
              className="group flex h-10 min-w-10 cursor-pointer items-center justify-center"
            >
              <span
                aria-hidden
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  selected === i
                    ? "w-10 bg-gradient-to-r from-gold to-flame-orange"
                    : "w-4 bg-white/15 group-hover:bg-white/30",
                )}
              />
            </button>
          ))}
        </div>
        <button
          type="button"
          aria-label="Next dish"
          onClick={() => emblaApi?.scrollNext()}
          className="glass flex size-12 items-center justify-center rounded-full text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold-light hover:shadow-glow-gold cursor-pointer"
        >
          <ArrowRight className="size-5" aria-hidden />
        </button>
      </div>
    </section>
  );
}
