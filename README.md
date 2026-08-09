# Fusion Flame — Premium Restaurant Website

A flagship digital experience for **Fusion Flame**, a premium contemporary
restaurant in Edenvale, Johannesburg. Built with Next.js 15, React 19,
Tailwind CSS v4, Framer Motion, GSAP, Lenis and Yoco.

## Features

- Cinematic GSAP hero with parallax, floating embers and animated stats
- 12-category interactive signature menu with spice / veg / chef badges
- Signature-dish carousel (Embla, autoplay) and masonry gallery with fullscreen viewer
- Event listings with full **Yoco ticket checkout** → QR-coded digital tickets
- Luxury reservation flow (React Hook Form + Zod, confirmation screen, admin-ready API)
- Private events, gallery, weekly specials
- WhatsApp floating support button + mobile sticky action bar (Reserve / WhatsApp / Call)
- SEO: Restaurant + Event JSON-LD, Open Graph, Twitter cards, dynamic sitemap, robots
- Accessible: keyboard navigation, ARIA labels, focus states, reduced-motion support

## Getting Started

```bash
npm install
cp .env.example .env.local   # add Yoco keys when ready
npm run dev
```

Open http://localhost:3000.

## Payments — Yoco

Event tickets are sold through **Yoco Checkout** — the customer is redirected
to Yoco's hosted payment page (cards, Apple Pay, Google Pay) and back.

- Start checkout: `POST /api/payments/yoco/checkout` (amount always computed
  server-side from the event's price × quantity, never trusted from the client)
- Webhook (source of truth for payment success — **never** the redirect URL,
  per Yoco's own guidance): `POST /api/payments/yoco/webhook`, HMAC-SHA256
  signature verified (`lib/yoco.ts`)
- Ticket status: `GET /api/payments/yoco/status?token=…` — the success page
  polls this against our own webhook-updated payment record
  (`lib/payments.ts`, stored in Vercel Blob keyed by an unguessable token —
  never the redirect URL alone), so a slow webhook just shows a brief
  "confirming your payment" state rather than a false negative
- **Sandbox**: with no `YOCO_SECRET_KEY`, checkout completes instantly with a
  synthesized ticket — no Blob, no webhook, the full journey is testable with
  zero keys

### Going live

1. In the Yoco Business Portal → Developers → API keys, copy the **test**
   secret key first to prove the flow, then the **live** key once the
   business is verified. Set `YOCO_SECRET_KEY` in Vercel.
2. Register the webhook once (needs the secret key you just set):
   ```bash
   curl -X POST https://payments.yoco.com/api/webhooks \
     -H "Authorization: Bearer $YOCO_SECRET_KEY" \
     -H "Content-Type: application/json" \
     -d '{"name":"fusion-flame","url":"https://www.fusionflame.co.za/api/payments/yoco/webhook"}'
   ```
   The response's `secret` (a `whsec_...` value, shown only once) becomes
   `YOCO_WEBHOOK_SECRET` in Vercel.
3. Repeat step 2 with the live key when going live (test and live mode each
   need their own webhook registration).

## Admin Panel (built-in CMS)

Everything on the site is managed from **`/admin`** — no code changes or
redeploys needed:

- **Menu & Pricing** — categories, dishes, prices, badges, availability
- **Events & Tickets** — dates, ticket prices, seats, theme/dress code
- **Announcements & Ads** — the promo banner at the top of every page
- Signature dishes, gallery, private events, FAQ, Instagram grid, restaurant
  details (hours, contacts, hero image)

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
app/          App Router pages + API routes (reservations, payments, newsletter)
components/   ui primitives, layout chrome, homepage sections, effects
features/     menu, bookings, events, tickets, gallery
lib/          utils, zod validation, Yoco + email + payment-ledger helpers
services/     typed content accessors (CMS seam)
data/         placeholder JSON content
types/        shared domain types
```

## Deployment (Vercel)

1. Import the repo at vercel.com/new (or `vercel link`).
2. Set the env vars from `.env.example` in Project → Settings → Environment
   Variables (`YOCO_SECRET_KEY` + `YOCO_WEBHOOK_SECRET` as sensitive/production
   secrets, `NEXT_PUBLIC_SITE_URL` to the production domain).
3. Push to `main` — Vercel builds and deploys automatically.
