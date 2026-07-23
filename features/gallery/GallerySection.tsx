"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, ArrowLeft, ArrowRight, Expand } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import type { GalleryImage } from "@/types";

export function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightbox, setLightbox] = useState<number | null>(null);

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: 1 | -1) =>
      setLightbox((current) =>
        current === null
          ? null
          : (current + dir + images.length) % images.length,
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
    <section id="gallery" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="The Experience"
          title="Moments in the Glow"
          description="Fire, gold and celebration — glimpses of evenings at Fusion Flame."
        />

        {/* Masonry */}
        <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
          {images.map((img, i) => (
            <Reveal key={img.id} delay={(i % 4) * 0.08}>
              <button
                type="button"
                onClick={() => setLightbox(i)}
                aria-label={`View larger: ${img.alt}`}
                className="img-zoom group relative block w-full cursor-pointer overflow-hidden rounded-2xl border border-white/5 transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={800}
                  height={img.tall ? 1100 : 700}
                  sizes="(min-width: 1024px) 24vw, (min-width: 768px) 32vw, 46vw"
                  className={`w-full object-cover ${img.tall ? "aspect-[3/4]" : "aspect-[4/3]"}`}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/70 via-transparent to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                >
                  <span className="text-xs font-medium uppercase tracking-[0.18em] text-gold-light">
                    {img.category}
                  </span>
                  <Expand className="size-4 text-white/80" />
                </div>
              </button>
            </Reveal>
          ))}
        </div>
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
              <p className="mt-4 text-center text-sm text-muted">
                {images[lightbox].alt}
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
