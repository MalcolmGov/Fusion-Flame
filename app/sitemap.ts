import type { MetadataRoute } from "next";
import { getEvents } from "@/services/content";
import { getSiteUrl } from "@/lib/paystack";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = getSiteUrl();

  const eventUrls: MetadataRoute.Sitemap = getEvents().map((event) => ({
    url: `${siteUrl}/events/${event.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...eventUrls,
  ];
}
