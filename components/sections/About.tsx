import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import { Counter } from "@/components/effects/Counter";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getRestaurant } from "@/services/content";

const ABOUT_IMAGES = {
  main: "https://aoojryj3c58valkr.public.blob.vercel-storage.com/food/grilled-prawns-platter.jpg",
  accent:
    "https://aoojryj3c58valkr.public.blob.vercel-storage.com/food/savoury-platter-blooms.jpg",
};

export async function About() {
  const { stats } = await getRestaurant();

  const counters = [
    { label: "Years of Excellence", value: stats.yearsOfExcellence, suffix: "" },
    { label: "Guests Served", value: stats.guestsServed, suffix: "+" },
    { label: "Signature Dishes", value: stats.signatureDishes, suffix: "" },
    { label: "Events Hosted", value: stats.eventsHosted, suffix: "+" },
  ];

  return (
    <section id="about" className="fire-ambience relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Our Story"
          title="Born of Fire, Refined by Passion"
        />

        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          {/* Imagery */}
          <Reveal from="left" className="relative">
            <div className="img-zoom gold-ring relative aspect-[4/5] overflow-hidden rounded-3xl">
              <Image
                src={ABOUT_IMAGES.main}
                alt="Grilled prawn platter finished with fresh herbs at Fusion Flame"
                fill
                sizes="(min-width: 1024px) 45vw, 90vw"
                className="object-cover"
              />
            </div>
            <div className="img-zoom absolute -bottom-10 -right-4 hidden w-56 overflow-hidden rounded-2xl border border-white/10 shadow-luxe md:block lg:-right-10 lg:w-64">
              <Image
                src={ABOUT_IMAGES.accent}
                alt="Savoury platter dressed with edible blooms"
                width={512}
                height={384}
                className="aspect-[4/3] object-cover"
              />
            </div>
            <div
              aria-hidden
              className="absolute -left-6 -top-6 -z-10 size-40 rounded-full bg-flame-orange/10 blur-3xl"
            />
          </Reveal>

          {/* Story */}
          <div>
            <Reveal delay={0.1}>
              <h3 className="font-heading text-2xl leading-snug text-foreground md:text-3xl">
                A sanctuary of live fire, golden light and
                <span className="text-fire-gradient"> extraordinary flavour.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 leading-relaxed text-muted">
                Fusion Flame began with a single conviction: that fire is not
                merely a way of cooking, but a way of gathering. In the heart of
                Sandton, our custom-built open hearth anchors a dining room of
                smoked glass, brushed gold and candlelight — a stage where every
                evening becomes theatre.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 leading-relaxed text-muted">
                Chef Laurent Dlamini and his brigade marry African fire-craft
                with classical technique — dry-aged cuts kissed by oak embers,
                seafood flamed in chilli-gold butter, desserts torched at your
                table. Every plate honours the ingredient; every visit honours
                the moment.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <blockquote className="font-accent mt-8 border-l-2 border-gold/60 pl-6 text-xl italic leading-relaxed text-foreground/85">
                “We don&rsquo;t serve dinner. We serve the memory you&rsquo;ll
                retell for years.”
                <footer className="eyebrow mt-3 not-italic">
                  — Chef Laurent Dlamini
                </footer>
              </blockquote>
            </Reveal>

            {/* Animated counters */}
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {counters.map((c, i) => (
                <Reveal key={c.label} delay={0.1 * i}>
                  <div className="glass rounded-2xl p-5 text-center transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold">
                    <p className="font-heading text-3xl text-gold-gradient md:text-4xl">
                      <Counter target={c.value} suffix={c.suffix} />
                    </p>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">
                      {c.label}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
