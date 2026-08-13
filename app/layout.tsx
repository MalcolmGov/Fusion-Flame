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
    default: "Fusion Flame — Premium Contemporary Dining | Johannesburg",
    template: "%s | Fusion Flame",
  },
  description:
    "Ignite your taste experience at Fusion Flame — premium flame-grilled cuisine, signature cocktails, live entertainment and unforgettable moments in Edenvale, Johannesburg.",
  keywords: [
    "Fusion Flame",
    "premium restaurant Johannesburg",
    "fine dining Edenvale",
    "steakhouse Johannesburg",
    "flame grill restaurant",
    "private dining Johannesburg",
    "restaurant events Edenvale",
  ],
  openGraph: {
    type: "website",
    locale: "en_ZA",
    url: siteUrl,
    siteName: "Fusion Flame",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Where exceptional cuisine meets unforgettable moments. Premium flame-grilled dining, cocktails and live entertainment in Edenvale.",
    // Image comes from app/opengraph-image.tsx (file convention) — a
    // designed 1200×630 share card, not the raw square logo.
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Flame — Ignite Your Taste Experience",
    description:
      "Premium flame-grilled dining, cocktails and live entertainment in Edenvale, Johannesburg.",
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
