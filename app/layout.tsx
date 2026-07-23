import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFloat } from "@/components/layout/WhatsAppFloat";
import { MobileStickyBar } from "@/components/layout/MobileStickyBar";
import { getRestaurant, getWhatsAppLink } from "@/services/content";
import { getSiteUrl } from "@/lib/paystack";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Fusion Flame — Premium Contemporary Dining | Johannesburg",
    template: "%s | Fusion Flame",
  },
  description:
    "Ignite your taste experience at Fusion Flame — premium flame-grilled cuisine, signature cocktails, live entertainment and unforgettable moments in Sandton, Johannesburg.",
  keywords: [
    "Fusion Flame",
    "premium restaurant Johannesburg",
    "fine dining Sandton",
    "steakhouse Johannesburg",
    "flame grill restaurant",
    "private dining Johannesburg",
    "restaurant events Sandton",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Fusion Flame",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Where exceptional cuisine meets unforgettable moments. Premium flame-grilled dining, cocktails and live entertainment in Sandton.",
    images: [{ url: "/logo.jpeg", width: 1254, height: 1254, alt: "Fusion Flame" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Premium flame-grilled dining, cocktails and live entertainment in Sandton, Johannesburg.",
    images: ["/logo.jpeg"],
  },
  alternates: { canonical: "/" },
  icons: { icon: "/logo.jpeg", apple: "/logo.jpeg" },
};

function RestaurantJsonLd() {
  const r = getRestaurant();
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const restaurant = getRestaurant();
  const whatsappHref = getWhatsAppLink();

  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="antialiased">
        <RestaurantJsonLd />
        <Providers>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[110] focus:rounded-full focus:bg-gold focus:px-5 focus:py-2 focus:text-sm focus:text-black"
          >
            Skip to content
          </a>
          <Navbar phone={restaurant.phone} />
          <main id="main">{children}</main>
          <Footer />
          <WhatsAppFloat href={whatsappHref} />
          <MobileStickyBar phone={restaurant.phone} whatsappHref={whatsappHref} />
        </Providers>
      </body>
    </html>
  );
}
