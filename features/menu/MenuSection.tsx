"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Leaf, Sparkles, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { cn, formatZAR } from "@/lib/utils";
import type { MenuCategory, MenuItem } from "@/types";

function SpiceIndicator({ level }: { level: MenuItem["spiceLevel"] }) {
  if (level === 0) return null;
  const labels = ["", "Mild", "Medium", "Hot"];
  return (
    <span
      className="flex items-center gap-0.5"
      role="img"
      aria-label={`Spice level: ${labels[level]}`}
      title={labels[level]}
    >
      {Array.from({ length: level }).map((_, i) => (
        <Flame
          key={i}
          className="size-3.5 fill-flame-red/70 text-flame-red"
          aria-hidden
        />
      ))}
    </span>
  );
}

function MenuCard({ item, index }: { item: MenuItem; index: number }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 32, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
      className="group gold-ring relative overflow-hidden rounded-3xl transition-all duration-500 hover:-translate-y-1.5 hover:shadow-glow-gold"
    >
      <div className="img-zoom relative aspect-[16/10]">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent"
        />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {item.popular && (
            <Badge variant="fire">
              <TrendingUp className="size-3" aria-hidden /> Popular
            </Badge>
          )}
          {item.chefRecommendation && (
            <Badge variant="gold">
              <Sparkles className="size-3" aria-hidden /> Chef's Pick
            </Badge>
          )}
          {item.vegetarian && (
            <Badge variant="green">
              <Leaf className="size-3" aria-hidden /> Veg
            </Badge>
          )}
        </div>
      </div>

      <div className="p-5 md:p-6">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-heading text-lg leading-snug text-foreground transition-colors duration-300 group-hover:text-gold-light md:text-xl">
            {item.name}
          </h3>
          <p className="font-heading shrink-0 text-lg text-gold-gradient md:text-xl">
            {formatZAR(item.price)}
          </p>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {item.description}
        </p>
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3 text-xs text-muted">
          <span>{item.calories} kcal</span>
          <SpiceIndicator level={item.spiceLevel} />
        </div>
      </div>
    </motion.article>
  );
}

export function MenuSection({ categories }: { categories: MenuCategory[] }) {
  const [active, setActive] = useState(categories[0]?.id);
  const activeCategory = categories.find((c) => c.id === active) ?? categories[0];

  return (
    <section id="menu" className="relative scroll-mt-24 bg-surface/40 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Signature Menu"
          title="A Menu Forged in Flame"
          description="Twelve chapters of fire-driven cuisine — from oak-ember steaks to torched desserts and smoked-gold cocktails."
        />

        {/* Category tabs */}
        <div
          role="tablist"
          aria-label="Menu categories"
          className="scrollbar-none -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 pb-2 md:mx-0 md:flex-wrap md:justify-center md:overflow-visible md:px-0"
        >
          {categories.map((category) => {
            const selected = category.id === active;
            return (
              <button
                key={category.id}
                role="tab"
                aria-selected={selected}
                aria-controls={`menu-panel-${category.id}`}
                id={`menu-tab-${category.id}`}
                onClick={() => setActive(category.id)}
                className={cn(
                  "relative shrink-0 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-400 cursor-pointer",
                  selected
                    ? "text-[#1a1104]"
                    : "glass text-muted hover:border-gold/30 hover:text-gold-light",
                )}
              >
                {selected && (
                  <motion.span
                    layoutId="menu-tab-pill"
                    aria-hidden
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="absolute inset-0 rounded-full bg-[linear-gradient(120deg,#f4d67a,#d4af37_45%,#ff8a00)] shadow-glow-gold"
                  />
                )}
                <span className="relative z-10">{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* Cards */}
        <div
          role="tabpanel"
          id={`menu-panel-${activeCategory.id}`}
          aria-labelledby={`menu-tab-${activeCategory.id}`}
        >
          <AnimatePresence mode="popLayout">
            <motion.div
              key={activeCategory.id}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-7"
            >
              {activeCategory.items.map((item, i) => (
                <MenuCard key={item.id} item={item} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
