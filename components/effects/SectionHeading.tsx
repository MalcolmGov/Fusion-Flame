import { Reveal } from "@/components/effects/Reveal";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  className,
}: SectionHeadingProps) {
  return (
    <Reveal
      className={cn(
        "mb-14 max-w-2xl md:mb-20",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      <p className="eyebrow mb-4">{eyebrow}</p>
      <h2 className="font-heading text-4xl leading-tight text-balance md:text-5xl lg:text-6xl">
        <span className="text-gold-gradient">{title}</span>
      </h2>
      {description ? (
        <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
          {description}
        </p>
      ) : null}
      <div
        aria-hidden
        className={cn(
          "mt-7 h-px w-24 bg-gradient-to-r from-transparent via-gold to-transparent",
          align === "center" ? "mx-auto" : "",
        )}
      />
    </Reveal>
  );
}
