import Image from "next/image";
import { Award } from "lucide-react";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getChef } from "@/services/content";

export async function Chef() {
  const chef = await getChef();

  return (
    <section id="chef" className="relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Meet Our Chef" title="The Man Behind the Flame" />

        <div className="grid items-center gap-14 lg:grid-cols-5 lg:gap-20">
          <Reveal from="left" className="relative lg:col-span-2">
            <div className="img-zoom gold-ring relative aspect-[3/4] overflow-hidden rounded-3xl">
              <Image
                src={chef.portrait}
                alt={`Portrait of ${chef.name}`}
                fill
                sizes="(min-width: 1024px) 38vw, 90vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
              />
            </div>
            <div
              aria-hidden
              className="absolute -bottom-8 -left-8 -z-10 size-48 rounded-full bg-gold/10 blur-3xl"
            />
          </Reveal>

          <div className="lg:col-span-3">
            <Reveal>
              <h3 className="font-heading text-3xl text-foreground md:text-4xl">
                {chef.name}
              </h3>
              <p className="eyebrow mt-2">{chef.title}</p>
            </Reveal>

            {chef.bio.map((paragraph, i) => (
              <Reveal key={i} delay={0.12 + i * 0.1}>
                <p className="mt-5 leading-relaxed text-muted">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.35}>
              <blockquote className="font-accent mt-8 rounded-2xl border border-gold/20 bg-gold/5 p-6 text-xl italic leading-relaxed text-gold-light">
                “{chef.philosophy}”
              </blockquote>
            </Reveal>

            <Reveal delay={0.45}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {chef.awards.map((award) => (
                  <li
                    key={award}
                    className="glass flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-foreground/85"
                  >
                    <Award className="size-4 shrink-0 text-gold" aria-hidden />
                    {award}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
