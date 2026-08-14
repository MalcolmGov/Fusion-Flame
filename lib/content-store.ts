/** Runtime content store — the seam that makes the site admin-manageable.
 *
 *  Storage backends:
 *  - Production (Vercel): JSON documents in Vercel Blob (`content/<key>.json`).
 *    Requires a connected Blob store (BLOB_READ_WRITE_TOKEN).
 *  - Local dev: reads/writes the JSON files in data/ directly.
 *  - The bundled data/*.json always serve as defaults when nothing is stored.
 *
 *  Reads are uncached (see readCollection); the admin save path revalidates
 *  the prerendered pages so published changes appear without a redeploy. */

import { promises as fs } from "fs";
import path from "path";
import { head, put } from "@vercel/blob";

import restaurantDefault from "@/data/restaurant.json";
import menuDefault from "@/data/menu.json";
import signatureDefault from "@/data/signature-dishes.json";
import eventsDefault from "@/data/events.json";
import testimonialsDefault from "@/data/testimonials.json";
import galleryDefault from "@/data/gallery.json";
import offersDefault from "@/data/offers.json";
import privateEventsDefault from "@/data/private-events.json";
import chefDefault from "@/data/chef.json";
import instagramDefault from "@/data/instagram.json";
import faqDefault from "@/data/faq.json";
import announcementDefault from "@/data/announcement.json";

export const COLLECTION_KEYS = [
  "restaurant",
  "menu",
  "signature-dishes",
  "events",
  "testimonials",
  "gallery",
  "offers",
  "private-events",
  "chef",
  "instagram",
  "faq",
  "announcement",
] as const;

export type CollectionKey = (typeof COLLECTION_KEYS)[number];

const DEFAULTS: Record<CollectionKey, unknown> = {
  restaurant: restaurantDefault,
  menu: menuDefault,
  "signature-dishes": signatureDefault,
  events: eventsDefault,
  testimonials: testimonialsDefault,
  gallery: galleryDefault,
  offers: offersDefault,
  "private-events": privateEventsDefault,
  chef: chefDefault,
  instagram: instagramDefault,
  faq: faqDefault,
  announcement: announcementDefault,
};

export function isCollectionKey(value: string): value is CollectionKey {
  return (COLLECTION_KEYS as readonly string[]).includes(value);
}

export function contentTag(key: CollectionKey) {
  return `content-${key}`;
}

const blobEnabled = () => Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const blobPath = (key: CollectionKey) => `content/${key}.json`;
const localPath = (key: CollectionKey) =>
  path.join(process.cwd(), "data", `${key}.json`);

async function readRaw(key: CollectionKey): Promise<unknown> {
  if (blobEnabled()) {
    try {
      const meta = await head(blobPath(key));
      const res = await fetch(`${meta.url}?t=${Date.now()}`, {
        cache: "no-store",
      });
      if (res.ok) return await res.json();
    } catch {
      // Not stored yet (or transient failure) — fall through to defaults.
    }
    return DEFAULTS[key];
  }

  try {
    return JSON.parse(await fs.readFile(localPath(key), "utf8"));
  } catch {
    return DEFAULTS[key];
  }
}

/** Reads are deliberately UNCACHED. The persistent data cache survives
 *  deployments and only ever revalidated through the admin save path, which
 *  let stale content resurface in builds — and worse, let the admin editor
 *  read stale data and publish it back over newer writes. Content documents
 *  are tiny and pages are prerendered, so fresh reads cost almost nothing. */
export async function readCollection<T = unknown>(
  key: CollectionKey,
): Promise<T> {
  return (await readRaw(key)) as T;
}

/** Persist a collection. Callers must revalidate the content tags afterwards
 *  (only allowed from route handlers / server actions). */
export async function writeCollection(key: CollectionKey, data: unknown) {
  const body = JSON.stringify(data, null, 2);

  if (blobEnabled()) {
    await put(blobPath(key), body, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
      cacheControlMaxAge: 60,
    });
    return;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "No Blob store connected. In Vercel, add a Blob store to this project (Storage → Create → Blob) so BLOB_READ_WRITE_TOKEN is set — then content can be saved.",
    );
  }

  await fs.writeFile(localPath(key), body + "\n", "utf8");
}
