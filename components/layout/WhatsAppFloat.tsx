"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface WhatsAppFloatProps {
  href: string;
}

/** Always-visible floating WhatsApp button with a soft green glow. */
export function WhatsAppFloat({ href }: WhatsAppFloatProps) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Fusion Flame on WhatsApp"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, type: "spring", stiffness: 200, damping: 16 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className="fixed bottom-24 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#25d366] text-[#062b16] shadow-[0_0_34px_-4px_rgba(37,211,102,0.8)] md:bottom-8 md:right-8"
    >
      <span
        aria-hidden
        className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25d366]/40 [animation-duration:2.6s]"
      />
      <MessageCircle className="size-7" aria-hidden />
    </motion.a>
  );
}
