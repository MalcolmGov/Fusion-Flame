import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";

export function About() {
  return (
    <section id="about" className="fire-ambience relative scroll-mt-24 py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading eyebrow="Our Story" title="A New Chapter Begins" />

        <div className="mx-auto max-w-3xl">
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
