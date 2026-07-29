/** Field-config-driven admin schema. Each collection declares its fields once;
 *  the generic editors in components/admin render the right UI. Client-safe. */

export type FieldType =
  | "text"
  | "textarea"
  | "number"
  | "boolean"
  | "select"
  | "date"
  | "image"
  | "string-list"
  | "object"
  | "object-list";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  help?: string;
  options?: { value: string | number; label: string }[];
  subfields?: FieldDef[];
  min?: number;
  max?: number;
}

export interface CollectionDef {
  key: string;
  label: string;
  description: string;
  kind: "singleton" | "list" | "menu";
  /** Fields of the singleton object, or of each list item. */
  fields: FieldDef[];
  /** Field used as the display label for list items. */
  itemLabelField?: string;
  /** Auto-generated unique id field on new list items (hidden in the UI). */
  hiddenIdField?: string;
}

const MENU_ITEM_FIELDS: FieldDef[] = [
  { name: "name", label: "Dish Name", type: "text" },
  { name: "description", label: "Description", type: "textarea" },
  { name: "price", label: "Price (R)", type: "number", min: 0 },
  { name: "calories", label: "Calories (kcal)", type: "number", min: 0 },
  {
    name: "spiceLevel",
    label: "Spice Level",
    type: "select",
    options: [
      { value: 0, label: "None" },
      { value: 1, label: "Mild 🔥" },
      { value: 2, label: "Medium 🔥🔥" },
      { value: 3, label: "Hot 🔥🔥🔥" },
    ],
  },
  { name: "vegetarian", label: "Vegetarian", type: "boolean" },
  { name: "popular", label: "Popular badge", type: "boolean" },
  { name: "chefRecommendation", label: "Chef's recommendation", type: "boolean" },
  {
    name: "available",
    label: "Available (shown on the site)",
    type: "boolean",
  },
  { name: "image", label: "Photo", type: "image" },
];

export const ADMIN_COLLECTIONS: CollectionDef[] = [
  {
    key: "announcement",
    label: "Announcements & Ads",
    description:
      "The promo banner shown at the top of every page — perfect for specials, events and adverts.",
    kind: "singleton",
    fields: [
      { name: "enabled", label: "Show the banner", type: "boolean" },
      { name: "message", label: "Message", type: "textarea" },
      { name: "linkLabel", label: "Button label", type: "text", help: "e.g. Get Tickets" },
      {
        name: "linkHref",
        label: "Button link",
        type: "text",
        help: "e.g. /events/steak-festival or a full URL",
      },
    ],
  },
  {
    key: "menu",
    label: "Menu & Pricing",
    description:
      "All menu categories, dishes, prices, badges and availability.",
    kind: "menu",
    fields: MENU_ITEM_FIELDS,
    itemLabelField: "name",
    hiddenIdField: "id",
  },
  {
    key: "events",
    label: "Events & Tickets",
    description:
      "Upcoming events with dates, ticket prices and seat availability.",
    kind: "list",
    itemLabelField: "title",
    fields: [
      { name: "title", label: "Event Title", type: "text" },
      {
        name: "slug",
        label: "URL slug",
        type: "text",
        help: "Lowercase with dashes, e.g. jazz-nights. Changing it changes the event's web address.",
      },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      { name: "date", label: "Date", type: "date" },
      { name: "time", label: "Time", type: "text", help: "e.g. 19:00 – 23:30" },
      { name: "price", label: "Ticket Price (R)", type: "number", min: 0 },
      { name: "availableSeats", label: "Available Seats", type: "number", min: 0 },
      {
        name: "recurring",
        label: "Recurring label (optional)",
        type: "text",
        help: "e.g. Every Friday — leave empty for one-off events",
      },
    ],
  },
  {
    key: "signature-dishes",
    label: "Signature Dishes",
    description: "The large homepage carousel of showcase dishes.",
    kind: "list",
    itemLabelField: "name",
    hiddenIdField: "id",
    fields: [
      { name: "name", label: "Dish Name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "price", label: "Price (R)", type: "number", min: 0 },
      { name: "image", label: "Photo", type: "image" },
    ],
  },
  {
    key: "offers",
    label: "Special Offers",
    description: "Weekly specials, happy hour and promo cards.",
    kind: "list",
    itemLabelField: "title",
    hiddenIdField: "id",
    fields: [
      { name: "title", label: "Offer Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "day", label: "When", type: "text", help: "e.g. Tuesdays or Mon – Fri · 16:00 – 18:00" },
      { name: "highlight", label: "Highlight", type: "text", help: "e.g. R295 or 2 for 1" },
      {
        name: "icon",
        label: "Icon",
        type: "select",
        options: [
          { value: "Flame", label: "Flame" },
          { value: "Beef", label: "Steak" },
          { value: "Martini", label: "Cocktail" },
          { value: "Wine", label: "Wine" },
          { value: "UtensilsCrossed", label: "Dining" },
          { value: "Baby", label: "Family" },
        ],
      },
    ],
  },
  {
    key: "gallery",
    label: "Gallery",
    description: "The masonry photo gallery on the homepage.",
    kind: "list",
    itemLabelField: "alt",
    hiddenIdField: "id",
    fields: [
      { name: "src", label: "Photo", type: "image" },
      { name: "alt", label: "Caption / alt text", type: "text" },
      { name: "category", label: "Category", type: "text", help: "e.g. Food, Interior, Cocktails" },
      { name: "tall", label: "Tall (portrait) tile", type: "boolean" },
    ],
  },
  {
    key: "testimonials",
    label: "Testimonials",
    description: "Guest reviews shown in the carousel.",
    kind: "list",
    itemLabelField: "name",
    hiddenIdField: "id",
    fields: [
      { name: "name", label: "Guest Name", type: "text" },
      { name: "quote", label: "Quote", type: "textarea" },
      {
        name: "rating",
        label: "Rating",
        type: "select",
        options: [5, 4, 3, 2, 1].map((n) => ({ value: n, label: `${n} stars` })),
      },
      { name: "avatar", label: "Avatar photo", type: "image" },
      { name: "date", label: "Review date", type: "date" },
    ],
  },
  {
    key: "private-events",
    label: "Private Events",
    description: "The private-event / functions cards.",
    kind: "list",
    itemLabelField: "title",
    hiddenIdField: "id",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "description", label: "Description", type: "textarea" },
      { name: "image", label: "Image", type: "image" },
      { name: "capacity", label: "Capacity", type: "text", help: "e.g. Up to 60 guests" },
    ],
  },
  {
    key: "chef",
    label: "Chef Profile",
    description: "The Meet Our Chef section.",
    kind: "singleton",
    fields: [
      { name: "name", label: "Name", type: "text" },
      { name: "title", label: "Title", type: "text" },
      { name: "portrait", label: "Portrait", type: "image" },
      { name: "bio", label: "Biography paragraphs", type: "string-list" },
      { name: "philosophy", label: "Philosophy quote", type: "textarea" },
      { name: "awards", label: "Awards", type: "string-list" },
    ],
  },
  {
    key: "restaurant",
    label: "Restaurant Details",
    description:
      "Name, hero image, contact details, address, opening hours, socials and stats.",
    kind: "singleton",
    fields: [
      { name: "name", label: "Restaurant Name", type: "text" },
      { name: "tagline", label: "Tagline", type: "text" },
      { name: "heroImage", label: "Homepage hero image", type: "image" },
      { name: "phone", label: "Phone", type: "text" },
      {
        name: "whatsapp",
        label: "WhatsApp number",
        type: "text",
        help: "Digits only with country code, e.g. 27115550199",
      },
      { name: "whatsappMessage", label: "WhatsApp pre-filled message", type: "text" },
      { name: "email", label: "Email", type: "text" },
      {
        name: "address",
        label: "Address",
        type: "object",
        subfields: [
          { name: "street", label: "Street", type: "text" },
          { name: "suburb", label: "Suburb", type: "text" },
          { name: "city", label: "City", type: "text" },
          { name: "postalCode", label: "Postal Code", type: "text" },
          { name: "country", label: "Country", type: "text" },
        ],
      },
      { name: "mapQuery", label: "Google Maps search text", type: "text" },
      {
        name: "hours",
        label: "Opening Hours",
        type: "object-list",
        subfields: [
          { name: "days", label: "Days", type: "text" },
          { name: "open", label: "Opens", type: "text" },
          { name: "close", label: "Closes", type: "text" },
        ],
      },
      {
        name: "social",
        label: "Social Links",
        type: "object-list",
        subfields: [
          {
            name: "platform",
            label: "Platform",
            type: "select",
            options: ["Instagram", "Facebook", "TikTok", "X"].map((p) => ({
              value: p,
              label: p,
            })),
          },
          { name: "url", label: "URL", type: "text" },
        ],
      },
      {
        name: "stats",
        label: "Homepage Counters",
        type: "object",
        subfields: [
          { name: "yearsOfExcellence", label: "Years of Excellence", type: "number" },
          { name: "guestsServed", label: "Guests Served", type: "number" },
          { name: "signatureDishes", label: "Signature Dishes", type: "number" },
          { name: "eventsHosted", label: "Events Hosted", type: "number" },
        ],
      },
    ],
  },
  {
    key: "instagram",
    label: "Instagram Feed",
    description: "The Follow the Fire photo grid.",
    kind: "list",
    itemLabelField: "alt",
    hiddenIdField: "id",
    fields: [
      { name: "src", label: "Photo", type: "image" },
      { name: "alt", label: "Caption / alt text", type: "text" },
    ],
  },
  {
    key: "faq",
    label: "FAQ",
    description: "Questions shown in the Contact section.",
    kind: "list",
    itemLabelField: "q",
    fields: [
      { name: "q", label: "Question", type: "text" },
      { name: "a", label: "Answer", type: "textarea" },
    ],
  },
];

export function getCollectionDef(key: string) {
  return ADMIN_COLLECTIONS.find((c) => c.key === key);
}
