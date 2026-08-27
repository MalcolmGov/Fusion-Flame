/** Shared domain types. All content is data-driven so a future CMS can
 *  manage it without code changes. */

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  calories: number;
  /** 0 = none, 1 = mild, 2 = medium, 3 = hot */
  spiceLevel: 0 | 1 | 2 | 3;
  vegetarian: boolean;
  popular: boolean;
  chefRecommendation: boolean;
  seasonal?: boolean;
  available: boolean;
  image?: string;
}

export interface MenuCategory {
  id: string;
  label: string;
  items: MenuItem[];
}

export interface SignatureDish {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  image: string;
}

export interface RestaurantEvent {
  slug: string;
  title: string;
  description: string;
  image: string;
  /** ISO date */
  date: string;
  time: string;
  price: number;
  availableSeats: number;
  recurring?: string;
  /** Theme / dress code, e.g. "Black Tie" or "All-White Party" */
  dressCode?: string;
  /** "Good to Know" bullet points on the event page. Empty/absent hides
   *  the whole card — no more hardcoded, one-size-fits-all copy. */
  notes?: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  quote: string;
  date: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  /** masonry aspect hint */
  tall?: boolean;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  day: string;
  highlight: string;
  icon: string;
}

export interface PrivateEventType {
  id: string;
  title: string;
  description: string;
  image?: string;
  capacity: string;
}

export interface ChefProfile {
  name: string;
  title: string;
  portrait: string;
  bio: string[];
  philosophy: string;
  awards: string[];
}

export interface Announcement {
  enabled: boolean;
  message: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface RestaurantInfo {
  name: string;
  tagline: string;
  /** Homepage hero background — managed from the admin panel. */
  heroImage?: string;
  phone: string;
  whatsapp: string;
  whatsappMessage: string;
  email: string;
  address: {
    street: string;
    suburb: string;
    city: string;
    postalCode: string;
    country: string;
  };
  mapQuery: string;
  hours: { days: string; open: string; close: string }[];
  social: { platform: string; url: string }[];
  stats: {
    yearsOfExcellence: number;
    guestsServed: number;
    signatureDishes: number;
    eventsHosted: number;
  };
}

/* ── Bookings & payments ─────────────────────────────────── */

export interface ReservationRequest {
  name: string;
  surname: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  seating: "indoor" | "outdoor";
  occasion?: string;
  specialRequests?: string;
}

export interface ReservationConfirmation {
  reference: string;
  reservation: ReservationRequest;
}

export interface TicketOrderRequest {
  eventSlug: string;
  quantity: number;
  name: string;
  surname: string;
  email: string;
  phone: string;
}

export interface YocoCheckoutResponse {
  redirectUrl: string;
  reference: string;
  /** true when no live Yoco key is configured (sandbox checkout) */
  mock?: boolean;
}

export interface DigitalTicket {
  reference: string;
  eventSlug: string;
  eventTitle: string;
  date: string;
  time: string;
  quantity: number;
  purchaser: string;
  email: string;
  amount: number;
  status: "paid" | "pending" | "failed" | "cancelled";
}
