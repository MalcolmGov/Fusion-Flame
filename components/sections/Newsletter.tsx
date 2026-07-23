import { Reveal } from "@/components/effects/Reveal";
import { Embers } from "@/components/effects/Embers";
import { NewsletterForm } from "@/features/bookings/NewsletterForm";

export function Newsletter() {
  return (
    <section
      id="newsletter"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      <Embers count={10} />
      <div className="mx-auto max-w-3xl px-5 text-center md:px-8">
        <Reveal>
          <p className="eyebrow mb-4">Stay in the Glow</p>
          <h2 className="font-heading text-4xl text-gold-gradient md:text-5xl">
            Join the Inner Circle
          </h2>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-muted">
            Exclusive offers, first invitations to events and seasonal menu
            previews — delivered with the same care as our plates.
          </p>
        </Reveal>
        <Reveal delay={0.15} className="mt-9">
          <NewsletterForm />
          <p className="mt-4 text-xs text-muted/70">
            No spam, ever. Unsubscribe anytime.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
