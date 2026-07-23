/** Typed content accessors. Today these read from JSON files in data/;
 *  a future CMS only needs to swap the implementation of this module. */

import menuData from "@/data/menu.json";
import signatureData from "@/data/signature-dishes.json";
import eventsData from "@/data/events.json";
import testimonialsData from "@/data/testimonials.json";
import galleryData from "@/data/gallery.json";
import offersData from "@/data/offers.json";
import privateEventsData from "@/data/private-events.json";
import chefData from "@/data/chef.json";
import restaurantData from "@/data/restaurant.json";
import instagramData from "@/data/instagram.json";
import faqData from "@/data/faq.json";

import type {
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

export function getMenu(): MenuCategory[] {
  return (menuData as MenuCategory[]).map((category) => ({
    ...category,
    items: category.items.filter((item) => item.available),
  }));
}

export function getSignatureDishes(): SignatureDish[] {
  return signatureData as SignatureDish[];
}

export function getEvents(): RestaurantEvent[] {
  return [...(eventsData as RestaurantEvent[])].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
  );
}

export function getEvent(slug: string): RestaurantEvent | undefined {
  return (eventsData as RestaurantEvent[]).find((e) => e.slug === slug);
}

export function getTestimonials(): Testimonial[] {
  return testimonialsData as Testimonial[];
}

export function getGallery(): GalleryImage[] {
  return galleryData as GalleryImage[];
}

export function getOffers(): SpecialOffer[] {
  return offersData as SpecialOffer[];
}

export function getPrivateEventTypes(): PrivateEventType[] {
  return privateEventsData as PrivateEventType[];
}

export function getChef(): ChefProfile {
  return chefData as ChefProfile;
}

export function getRestaurant(): RestaurantInfo {
  return restaurantData as RestaurantInfo;
}

export function getInstagramFeed() {
  return instagramData as { id: string; src: string; alt: string }[];
}

export function getFaq() {
  return faqData as { q: string; a: string }[];
}

export function getWhatsAppLink(customMessage?: string) {
  const { whatsapp, whatsappMessage } = getRestaurant();
  const text = encodeURIComponent(customMessage ?? whatsappMessage);
  return `https://wa.me/${whatsapp}?text=${text}`;
}
