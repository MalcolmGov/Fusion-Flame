import Image from "next/image";
import { InstagramIcon } from "@/components/ui/social-icons";
import { Reveal } from "@/components/effects/Reveal";
import { SectionHeading } from "@/components/effects/SectionHeading";
import { getInstagramFeed, getRestaurant } from "@/services/content";

export async function InstagramFeed() {
  const [feed, restaurant] = await Promise.all([
    getInstagramFeed(),
    getRestaurant(),
  ]);
  if (feed.length === 0) return null;
  const instagramUrl =
    restaurant.social.find((s) => s.platform === "Instagram")?.url ??
    "https://instagram.com";

  return (
    <section
      id="instagram"
      aria-label="Instagram feed"
      className="relative scroll-mt-24 py-24 md:py-32"
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="@fusionflame"
          title="Follow the Fire"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
          {feed.map((post, i) => (
            <Reveal key={post.id} delay={(i % 6) * 0.06}>
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View on Instagram: ${post.alt}`}
                className="img-zoom group relative block aspect-square overflow-hidden rounded-2xl border border-white/5"
              >
                <Image
                  src={post.src}
                  alt={post.alt}
                  fill
                  sizes="(min-width: 768px) 16vw, 45vw"
                  className="object-cover"
                />
                <span
                  aria-hidden
                  className="absolute inset-0 flex items-center justify-center bg-black/55 opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100"
                >
                  <InstagramIcon className="size-7 text-gold-light" />
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
