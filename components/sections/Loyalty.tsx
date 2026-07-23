import { Cake, Crown, Gift, Sparkles, Star, CalendarHeart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getWhatsAppLink } from "@/services/content";

const BENEFITS = [
  {
    icon: Star,
    title: "Earn Flame Points",
    text: "Every R10 spent earns a Flame Point — on dining, drinks and event tickets.",
  },
  {
    icon: Gift,
    title: "Reward Yourself",
    text: "Redeem points for courses, cocktails and chef's-table experiences.",
  },
  {
    icon: Cake,
    title: "Birthday Rewards",
    text: "A complimentary celebration dessert and double points all birthday month.",
  },
  {
    icon: Sparkles,
    title: "Exclusive Invites",
    text: "First access to tastings, menu launches and members-only evenings.",
  },
  {
    icon: CalendarHeart,
    title: "Priority Reservations",
    text: "Skip the waitlist with a dedicated members' booking line.",
  },
  {
    icon: Crown,
    title: "Ember → Gold → Inferno",
    text: "Three tiers of escalating perks the more moments you share with us.",
  },
];

export function Loyalty() {
  const joinHref = getWhatsAppLink(
    "Hi Fusion Flame, I'd like to join the Flame Points loyalty programme.",
  );

  return (
    <section
      id="loyalty"
      className="fire-ambience relative scroll-mt-24 py-24 md:py-36"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Loyalty Programme"
          title="Flame Points"
          description="The more you dine, the brighter you burn. Membership is free — rewards are anything but."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {BENEFITS.map((benefit, i) => (
            <Reveal key={benefit.title} delay={(i % 3) * 0.1}>
              <div className="glass group h-full rounded-3xl p-7 transition-all duration-500 hover:border-gold/30 hover:shadow-glow-gold">
                <span className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-gold/20 to-flame-orange/10 text-gold transition-transform duration-500 group-hover:scale-110">
                  <benefit.icon className="size-6" aria-hidden />
                </span>
                <h3 className="font-heading mt-5 text-xl text-foreground">
                  {benefit.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {benefit.text}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14 text-center">
          <Button asChild size="lg">
            <a href={joinHref} target="_blank" rel="noopener noreferrer">
              Join Flame Points — Free
            </a>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
