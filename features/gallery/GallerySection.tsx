"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "@/types";

const ALL = "All";

/** Bento sizing is derived from position, not hardcoded per photo, so the
 *  layout stays intentional-looking no matter how the admin edits the set:
 *  the first tile in any filtered view is the hero cell, and any photo
 *  flagged "tall" in the admin gets extra vertical room. */
function cellClass(index: number, tall?: boolean) {
  if (index === 0) return tall ? "col-span-2 row-span-2" : "col-span-2";
  return tall ? "row-span-2" : "";
}

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const categories = useMemo(
    () => [ALL, ...Array.from(new Set(images.map((img) => img.category)))],
    [images],
  );
  const [active, setActive] = useState(ALL);
  const filtered = useMemo(
    () => (active === ALL ? images : images.filter((img) => img.category === active)),
    [images, active],
  );

  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((current) =>
        current === null
          ? null
          : (current + dir + filtered.length) % filtered.length,
      ),
    [filtered.length],
  );

  useEffect(() => {
    setLightbox(null);
  }, [active]);

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
    <section id="gallery" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Experience"
          title="Moments in the Glow"
          description="Fire, gold and celebration — a taste of what leaves our kitchen."
        />

        {/* Category filter */}
        <div
          role="tablist"
          aria-label="Gallery categories"
          className="scrollbar-none -mx-5 mb-10 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
        >
          {categories.map((category) => {
            const selected = category === active;
            return (
              <button
                key={category}
                role="tab"
                aria-selected={selected}
                onClick={() => setActive(category)}
                className={cn(
                  "relative shrink-0 cursor-pointer rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-400",
                  selected
                    ? "text-[#1a1104]"
                    : "glass text-muted hover:border-gold/30 hover:text-gold-light",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="gallery-tab-pill"
                    aria-hidden
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#f2d26d,#dda943_45%,#fa6906)] shadow-glow-gold"
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            );
          })}
        </div>

        {/* Bento grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={active}
            className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 sm:[grid-auto-rows:170px] lg:grid-cols-4 lg:[grid-auto-rows:200px]"
          >
            {filtered.map((img, i) => (
              <motion.button
                key={img.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, delay: (i % 8) * 0.05, ease: [0.16, 1, 0.3, 1] }}
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View larger: ${img.alt}`}
                className={cn(
                  "img-zoom group relative block h-full w-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold",
                  cellClass(i, img.tall),
                )}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  sizes="(min-width: 1024px) 24vw, (min-width: 640px) 33vw, 50vw"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/75 via-black/10 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <div className="min-w-0">
                    <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-gold-light">
                      {img.category}
                    </span>
                    <p className="mt-0.5 truncate text-xs text-white/80">{img.alt}</p>
                  </div>
                  <Expand className="size-4 shrink-0 text-white/80" />
                </div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fullscreen viewer */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={filtered[lightbox].alt}
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
                src={filtered[lightbox].src}
                alt={filtered[lightbox].alt}
                width={1600}
                height={1100}
                sizes="94vw"
                className="max-h-[80vh] w-full rounded-2xl object-contain"
                priority
              />
              <p className="mt-4 text-center text-sm text-muted">
                {filtered[lightbox].alt}
              </p>
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
