import Image from "next/image";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";

const ABOUT_IMAGES = {
  main: "https://aoojryj3c58valkr.public.blob.vercel-storage.com/food/grilled-prawns-platter.jpg",
  accent:
    "https://aoojryj3c58valkr.public.blob.vercel-storage.com/food/savoury-platter-blooms.jpg",
};

export function About() {
  return (
    <section id="about" className="fire-ambience relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Our Story" title="A New Chapter Begins" />

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
                Authentic flavours,
                <span className="text-fire-gradient"> unforgettable experiences.</span>
              </h3>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-6 leading-relaxed text-muted">
                Fusion Flame is a family restaurant in the heart of Edenvale,
                opening its doors at Eden Terrace Shopping Centre on 21 August
                2026. We bring together the rich flavours of authentic Indian
                cuisine with a modern twist — traditional favourites, grilled
                specialties and signature dishes that celebrate the diverse
                flavours of South Africa.
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <p className="mt-4 leading-relaxed text-muted">
                Every Sunday we lay on a generous buffet experience — from time
                to time complete with a spit braai, traditional braai and other
                culinary delights — while our entertainment area and dance floor
                set a relaxed supper-club atmosphere where great food, music and
                unforgettable memories come together.
              </p>
            </Reveal>
            <Reveal delay={0.4}>
              <p className="mt-4 leading-relaxed text-muted">
                Fusion Flame comes to you from the family behind Curry Lounge
                Edenmeadows — which continues to serve you with the same love
                and authentic flavours as a takeaway outlet at Edenmeadows
                Shopping Centre.
              </p>
            </Reveal>
            <Reveal delay={0.5}>
              <blockquote className="font-accent mt-8 border-l-2 border-gold/60 pl-6 text-xl italic leading-relaxed text-foreground/85">
                &ldquo;Good Food, Good Mood, Good Vibes.&rdquo;
                <footer className="eyebrow mt-3 not-italic">
                  — The Fusion Flame Family
                </footer>
              </blockquote>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
