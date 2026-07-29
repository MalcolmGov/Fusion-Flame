"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Star, ChevronDown, Music, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Embers } from "@/components/effects/Embers";

gsap.registerPlugin(useGSAP);

const DEFAULT_HERO_IMAGE =
  "https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=2600&auto=format&fit=crop";

export function Hero({ backgroundImage }: { backgroundImage?: string }) {
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "22%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  useGSAP(
    () => {
      const prefersReduced = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      if (prefersReduced) {
        gsap.set("[data-hero-reveal]", { opacity: 1, y: 0, scale: 1 });
        return;
      }
      gsap
        .timeline({ defaults: { ease: "power4.out" }, delay: 1.5 })
        .fromTo(
          "[data-hero-bg]",
          { scale: 1.18, opacity: 0.4 },
          { scale: 1, opacity: 1, duration: 2.2, ease: "power2.out" },
        )
        .fromTo(
          "[data-hero-reveal='eyebrow']",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=1.6",
        )
        .fromTo(
          "[data-hero-reveal='line']",
          { opacity: 0, y: 70, rotateX: 35 },
          { opacity: 1, y: 0, rotateX: 0, duration: 1.15, stagger: 0.18 },
          "-=1.2",
        )
        .fromTo(
          "[data-hero-reveal='sub']",
          { opacity: 0, y: 26 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.7",
        )
        .fromTo(
          "[data-hero-reveal='cta']",
          { opacity: 0, y: 24, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.8, stagger: 0.12 },
          "-=0.55",
        )
        .fromTo(
          "[data-hero-reveal='stat']",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
          "-=0.4",
        )
        .fromTo(
          "[data-hero-reveal='scroll']",
          { opacity: 0 },
          { opacity: 1, duration: 0.8 },
          "-=0.2",
        );
    },
    { scope: container },
  );

  return (
    <section
      ref={container}
      aria-label="Welcome to Fusion Flame"
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
    >
      {/* Cinematic background with parallax */}
      <motion.div
        data-hero-bg
        style={{ y: bgY }}
        className="absolute inset-0 -bottom-32"
      >
        <Image
          src={backgroundImage || DEFAULT_HERO_IMAGE}
          alt="Moody, candle-lit dining room at Fusion Flame"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>

      {/* Dark + fire gradient overlays */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/55 to-background"
      />
      <div
        aria-hidden
        className="absolute inset-0 animate-flame-pulse bg-[radial-gradient(58%_45%_at_50%_100%,rgba(250,105,6,0.17)_0%,rgba(249,19,4,0.05)_45%,transparent_70%)]"
      />

      <Embers count={22} />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 mx-auto max-w-5xl px-5 pb-28 pt-36 text-center md:pb-32"
      >
        <p
          data-hero-reveal="eyebrow"
          className="eyebrow mb-6 opacity-0 md:text-sm"
        >
          Premium Contemporary Dining · Sandton
        </p>

        <h1 className="font-heading text-5xl leading-[1.05] sm:text-6xl md:text-7xl lg:text-8xl">
          <span data-hero-reveal="line" className="block opacity-0">
            Ignite Your
          </span>
          <span data-hero-reveal="line" className="block opacity-0">
            <span className="text-gold-shimmer">Taste</span>{" "}
            <span className="text-fire-gradient">Experience</span>
          </span>
        </h1>

        <p
          data-hero-reveal="sub"
          className="font-accent mx-auto mt-7 max-w-xl text-xl italic leading-relaxed text-foreground/80 opacity-0 md:text-2xl"
        >
          Where exceptional cuisine meets unforgettable moments.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <div data-hero-reveal="cta" className="opacity-0">
            <Button asChild size="lg">
              <Link href="/#reservations">Reserve a Table</Link>
            </Button>
          </div>
          <div data-hero-reveal="cta" className="opacity-0">
            <Button asChild size="lg" variant="outline">
              <Link href="/#menu">View Menu</Link>
            </Button>
          </div>
        </div>

        {/* Floating stats */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <div
            data-hero-reveal="stat"
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs text-foreground/85 opacity-0"
          >
            <span className="flex text-gold" aria-label="Five star rating">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" aria-hidden />
              ))}
            </span>
            5000+ Happy Guests
          </div>
          <div
            data-hero-reveal="stat"
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs text-foreground/85 opacity-0"
          >
            <Clock className="size-3.5 text-gold" aria-hidden />
            Open Daily
          </div>
          <div
            data-hero-reveal="stat"
            className="glass flex items-center gap-2 rounded-full px-5 py-2.5 text-xs text-foreground/85 opacity-0"
          >
            <Music className="size-3.5 text-gold" aria-hidden />
            Live Entertainment
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <div
        data-hero-reveal="scroll"
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 opacity-0"
      >
        <Link
          href="/#about"
          aria-label="Scroll to discover Fusion Flame"
          className="flex flex-col items-center gap-2 text-muted transition-colors hover:text-gold-light"
        >
          <span className="text-[10px] uppercase tracking-[0.4em]">Discover</span>
          <motion.span
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown className="size-5" aria-hidden />
          </motion.span>
        </Link>
      </div>
    </section>
  );
}
