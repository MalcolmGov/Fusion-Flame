"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

interface RevealProps extends PropsWithChildren {
  className?: string;
  delay?: number;
  /** direction the element travels FROM */
  from?: "bottom" | "left" | "right" | "none";
  once?: boolean;
}

/** Scroll-triggered reveal used across every section. */
export function Reveal({
  children,
  className,
  delay = 0,
  from = "bottom",
  once = true,
}: RevealProps) {
  const reduce = useReducedMotion();

  const offsets = {
    bottom: { y: 44, x: 0 },
    left: { y: 0, x: -44 },
    right: { y: 0, x: 44 },
    none: { y: 0, x: 0 },
  } as const;

  const variants: Variants = {
    hidden: reduce
      ? { opacity: 0 }
      : { opacity: 0, ...offsets[from], filter: "blur(6px)" },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-80px" }}
    >
      {children}
    </motion.div>
  );
}
