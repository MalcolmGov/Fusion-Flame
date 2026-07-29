/** Typed content accessors — the CMS seam.
 *
 *  All reads go through lib/content-store.ts, so content edited in the
 *  /admin panel is served at runtime (no code changes, no redeploys). */

import { readCollection } from "@/lib/content-store";
import type {
  Announcement,
  ChefProfile,
  GalleryImage,
  MenuCategory,
  PrivateEventType,
  RestaurantEvent,
  RestaurantInfo,
  SignatureDish,
  SpecialOffer,
  Testimonial,
} from "@/types";

export async function getMenu(): Promise<MenuCategory[]> {
  const menu = await readCollection<MenuCategory[]>("menu");
  return menu.map((category) => ({
    ...category,
    items: category.items.filter((item) => item.available),
  }));
}

export function getSignatureDishes(): Promise<SignatureDish[]> {
  return readCollection<SignatureDish[]>("signature-dishes");
}

export async function getEvents(): Promise<RestaurantEvent[]> {
  const events = await readCollection<RestaurantEvent[]>("events");
  return [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export async function getEvent(
  slug: string,
): Promise<RestaurantEvent | undefined> {
  const events = await readCollection<RestaurantEvent[]>("events");
  return events.find((e) => e.slug === slug);
}

export function getTestimonials(): Promise<Testimonial[]> {
  return readCollection<Testimonial[]>("testimonials");
}

export function getGallery(): Promise<GalleryImage[]> {
  return readCollection<GalleryImage[]>("gallery");
}

export function getOffers(): Promise<SpecialOffer[]> {
  return readCollection<SpecialOffer[]>("offers");
}

export function getPrivateEventTypes(): Promise<PrivateEventType[]> {
  return readCollection<PrivateEventType[]>("private-events");
}

export function getChef(): Promise<ChefProfile> {
  return readCollection<ChefProfile>("chef");
}

export function getRestaurant(): Promise<RestaurantInfo> {
  return readCollection<RestaurantInfo>("restaurant");
}

export function getInstagramFeed() {
  return readCollection<{ id: string; src: string; alt: string }[]>(
    "instagram",
  );
}

export function getFaq() {
  return readCollection<{ q: string; a: string }[]>("faq");
}

export function getAnnouncement(): Promise<Announcement> {
  return readCollection<Announcement>("announcement");
}

export async function getWhatsAppLink(customMessage?: string) {
  const { whatsapp, whatsappMessage } = await getRestaurant();
  const text = encodeURIComponent(customMessage ?? whatsappMessage);
  return `https://wa.me/${whatsapp}?text=${text}`;
}
