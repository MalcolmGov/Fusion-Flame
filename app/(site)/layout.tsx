import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import {
  getAnnouncement,
  getRestaurant,
  getWhatsAppLink,
} from "@/services/content";
import { getSiteUrl } from "@/lib/site";

async function RestaurantJsonLd() {
  const r = await getRestaurant();
  const siteUrl = getSiteUrl();
  const data = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: r.name,
    image: `${siteUrl}/logo.jpeg`,
    url: siteUrl,
    telephone: r.phone,
    email: r.email,
    servesCuisine: ["Contemporary", "Grill", "Steakhouse", "Seafood"],
    priceRange: "$$$",
    address: {
      "@type": "PostalAddress",
      streetAddress: r.address.street,
      addressLocality: `${r.address.suburb}, ${r.address.city}`,
      postalCode: r.address.postalCode,
      addressCountry: "ZA",
    },
    openingHoursSpecification: r.hours.map((h) => ({
      "@type": "OpeningHoursSpecification",
      dayOfWeek: h.days,
      opens: h.open,
      closes: h.close,
    })),
    acceptsReservations: true,
    sameAs: r.social.map((s) => s.url),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [restaurant, whatsappHref, announcement] = await Promise.all([
    getRestaurant(),
    getWhatsAppLink(),
    getAnnouncement(),
  ]);

  return (
    <>
      <RestaurantJsonLd />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:text-sm focus:text-black"
      >
        Skip to content
      </a>
      <Navbar phone={restaurant.phone} announcement={announcement} />
      <main id="main">{children}</main>
      <Footer />
      <WhatsAppFloat href={whatsappHref} />
      <MobileStickyBar phone={restaurant.phone} whatsappHref={whatsappHref} />
    </>
  );
}
