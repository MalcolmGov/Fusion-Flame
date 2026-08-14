import type { Metadata } from "next";
import { Playfair_Display, Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteUrl } from "@/lib/site";

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
    default: "Fusion Flame — Authentic Indian Cuisine & Grill | Edenvale",
    template: "%s | Fusion Flame",
  },
  description:
    "Fusion Flame is a family restaurant at Eden Terrace Shopping Centre, Edenvale — authentic Indian cuisine with a modern twist, grilled specialties, Sunday buffets with spit braai, and a supper-club atmosphere. Good Food, Good Mood, Good Vibes.",
  keywords: [
    "Fusion Flame",
    "Indian restaurant Edenvale",
    "family restaurant Edenvale",
    "Sunday buffet Edenvale",
    "spit braai Edenvale",
    "grill restaurant Johannesburg",
    "supper club Johannesburg",
    "Eden Terrace Shopping Centre",
    "Curry Lounge Edenmeadows",
    "restaurant events Edenvale",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Fusion Flame",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Authentic Indian cuisine with a modern twist — grills, Sunday buffets and live entertainment at Eden Terrace Shopping Centre, Edenvale. Good Food, Good Mood, Good Vibes.",
    // Image comes from app/opengraph-image.tsx (file convention) — a
    // designed 1200×630 share card, not the raw square logo.
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Authentic Indian cuisine with a modern twist — grills, Sunday buffets and live entertainment in Edenvale. Good Food, Good Mood, Good Vibes.",
    // Falls back to opengraph-image.tsx.
  },
  alternates: { canonical: "/" },
  // Favicon/app icons come from app/favicon.ico, app/icon.png and
  // app/apple-icon.png (file convention) — no manual `icons` needed.
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${cormorant.variable}`}
    >
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
