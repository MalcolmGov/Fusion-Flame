"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types";

/** Three gentle elevation tiers so cards read as floating at different
 *  heights rather than sitting in a rigid row — applied on the outer
 *  wrapper so it composes with the independent bob animation inside. */
function tierClass(index: number) {
  switch (index % 3) {
    case 0:
      return "md:-translate-y-5";
    case 2:
      return "md:translate-y-5";
    default:
      return "";
  }
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start", dragFree: true }, [
    Autoplay({ delay: 2800, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((current) =>
        current === null ? null : (current + dir + images.length) % images.length,
      ),
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section id="gallery" className="relative scroll-mt-24 overflow-hidden py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Experience"
          title="Moments in the Glow"
          description="Fire, gold and celebration — a taste of what leaves our kitchen, drifting by."
        />
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y py-8 md:py-12">
          {images.map((img, i) => (
            <div
              key={img.id}
              className={cn(
                "min-w-0 shrink-0 basis-[62%] px-3 transition-transform duration-700 sm:basis-[38%] md:basis-[28%] lg:basis-[21%]",
                tierClass(i),
              )}
            >
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View larger: ${img.alt}`}
                style={{ animationDelay: `${(i % 5) * 1.1}s` }}
                className={cn(
                  "img-zoom group animate-float relative block w-full cursor-pointer overflow-hidden rounded-3xl border border-white/10 bg-card shadow-luxe transition-[border-color,box-shadow] duration-500 hover:border-gold/40 hover:shadow-glow-gold",
                  img.tall ? "aspect-[3/4]" : "aspect-[4/5]",
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 21vw, (min-width: 640px) 38vw, 62vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/5 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold-light">
                      {img.category}
                    </span>
                    <p className="mt-0.5 truncate text-xs text-white/80">{img.alt}</p>
                  </div>
                  <Expand className="size-4 shrink-0 text-white/80" />
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Manual controls */}
      <div className="mt-2 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Slide left"
          onClick={() => emblaApi?.scrollPrev()}
          className="glass flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold-light"
        >
          <ArrowLeft className="size-4" aria-hidden />
        </button>
        <button
          type="button"
          aria-label="Slide right"
          onClick={() => emblaApi?.scrollNext()}
          className="glass flex size-11 cursor-pointer items-center justify-center rounded-full text-muted transition-all duration-300 hover:border-gold/40 hover:text-gold-light"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={images[lightbox].alt}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/92 backdrop-blur-xl"
            onClick={close}
          >
            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="relative max-h-[86vh] w-[min(94vw,1200px)]"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightbox].src}
                alt={images[lightbox].alt}
                width={1600}
                height={1100}
                sizes="94vw"
                className="max-h-[80vh] w-full rounded-2xl object-contain"
                priority
              />
              <p className="mt-4 text-center text-sm text-muted">{images[lightbox].alt}</p>
            </motion.div>

            <button
              type="button"
              onClick={close}
              aria-label="Close gallery viewer"
              className="glass absolute right-5 top-5 flex size-12 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:text-gold-light"
            >
              <X className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Previous image"
              className="glass absolute left-4 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:text-gold-light md:left-8"
            >
              <ArrowLeft className="size-5" aria-hidden />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Next image"
              className="glass absolute right-4 top-1/2 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full text-white transition-colors hover:text-gold-light md:right-8"
            >
              <ArrowRight className="size-5" aria-hidden />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
