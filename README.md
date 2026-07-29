# Fusion Flame — Premium Restaurant Website

A flagship digital experience for **Fusion Flame**, a premium contemporary
restaurant in Sandton, Johannesburg. Built with Next.js 15, React 19,
Tailwind CSS v4, Framer Motion, GSAP, Lenis and Paystack.

## Features

- Cinematic GSAP hero with parallax, floating embers and animated stats
- 12-category interactive signature menu with spice / veg / chef badges
- Signature-dish carousel (Embla, autoplay) and masonry gallery with fullscreen viewer
- Event listings with full **Paystack ticket purchasing** → QR-coded digital tickets
- Luxury reservation flow (React Hook Form + Zod, confirmation screen, admin-ready API)
- Private events, testimonials, chef profile, weekly specials, Flame Points loyalty
- WhatsApp floating support button + mobile sticky action bar (Reserve / WhatsApp / Call)
- SEO: Restaurant + Event JSON-LD, Open Graph, Twitter cards, dynamic sitemap, robots
- Accessible: keyboard navigation, ARIA labels, focus states, reduced-motion support

## Getting Started

```bash
npm install
cp .env.example .env.local   # add Paystack keys when ready
npm run dev
```

Open http://localhost:3000.

## Paystack

Set `PAYSTACK_SECRET_KEY` (and optionally `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`).
Without keys the ticket checkout runs in **demo mode** so the full flow can be
tested end-to-end. Configure the webhook in the Paystack dashboard:

```
https://<your-domain>/api/paystack/webhook
```

Supported: ticket payments, secure server-side verification, webhook signature
validation, refunds (`lib/paystack.ts → refundTransaction`).

## Admin Panel (built-in CMS)

Everything on the site is managed from **`/admin`** — no code changes or
redeploys needed:

- **Menu & Pricing** — categories, dishes, prices, badges, availability
- **Events & Tickets** — dates, ticket prices, seats
- **Announcements & Ads** — the promo banner at the top of every page
- Signature dishes, gallery, offers, testimonials, private events, chef
  profile, FAQ, Instagram grid, restaurant details (hours, contacts, hero image)

Setup:

1. Set `ADMIN_PASSWORD` in Vercel (dev falls back to password `admin`).
2. Add a **Blob store** to the Vercel project (Storage → Create → Blob) —
   published content is stored there and served instantly via tag
   revalidation. Locally, edits write straight to `data/*.json`.
3. Sign in at `/admin`. Every editor has a **Publish** button; changes are
   live immediately. Image fields support direct upload (to Blob) or pasted
   Unsplash/Pexels URLs.

The bundled `data/*.json` files act as defaults until content is first
published, and everything flows through `services/content.ts`, so swapping in
an external CMS later remains a one-file change.

## Structure

```
app/          App Router pages + API routes (reservations, paystack, newsletter)
components/   ui primitives, layout chrome, homepage sections, effects
features/     menu, bookings, events, tickets, gallery
lib/          utils, zod validation, Paystack helpers
services/     typed content accessors (CMS seam)
data/         placeholder JSON content
types/        shared domain types
```

## Deployment (Vercel)

1. Import the repo at vercel.com/new (or `vercel link`).
2. Set the env vars from `.env.example` in Project → Settings → Environment
   Variables (`PAYSTACK_SECRET_KEY` as a sensitive/production secret,
   `NEXT_PUBLIC_SITE_URL` to the production domain).
3. Push to `main` — Vercel builds and deploys automatically.
