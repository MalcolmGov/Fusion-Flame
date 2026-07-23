import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.14em]",
  {
    variants: {
      variant: {
        gold: "bg-gold/15 text-gold-light border border-gold/30",
        fire: "bg-flame-orange/15 text-flame-orange border border-flame-orange/30",
        green: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
        muted: "bg-white/5 text-muted border border-white/10",
      },
    },
    defaultVariants: { variant: "gold" },
  },
);

export function Badge({
  className,
  variant,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
