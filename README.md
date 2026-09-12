# Skillsbook

A listing platform for people's skills and small businesses. Anyone can create a
profile, pick a category, and post a small portfolio of what they do — a clean,
searchable directory rather than a generic social network.

## Platforms

- **Web** — `apps/web` (Next.js)
- **Mobile** — `apps/mobile` (Expo / React Native, targets iOS + Android)

Both are separate apps in this repo for now; nothing is shared between them yet
(no monorepo tooling, no shared package) until there's an actual reason to share
code — e.g. types, an API client, or design tokens.

## Concept

- Every profile belongs to a category (e.g. Photography, Web Development,
  Catering, Tailoring, Tutoring, Electrical, Plumbing, Events, Design...). The
  category list is a starting point, not fixed.
- A profile is intentionally lightweight: a name, category, short bio, a small
  portfolio (images/links), and contact info.
- Accounts are either an **individual** (trades under their own name) or a
  **business** (registered name plus a contact person). Both own listings; the
  difference is what we ask for at sign-up and what we can verify.

## Brand

The brand book (logo, colour, typography, illustration, UI, voice) lives on the
design canvas, "Brand" page:
https://claude.ai/code/artifact/b013b73f-d379-489b-8371-bcc5b2854590

Its tokens are the source of truth for `apps/web/src/app/globals.css` — colour,
type, radii and elevation are defined there once, so changing a brand value
changes the app. Keep the two in step.

## Data model

`supabase/migrations/0001_init.sql` defines it:

- `profiles` — one per auth user, `account_type` of `individual` or `business`
- `categories` — the 12 seeded categories
- `listings` — what someone offers; a listing with status `unclaimed` has no
  owner yet and carries a `claim_token` (this is what outreach links to)
- `portfolio_items`, `conversations`, `messages`, `reviews`

Row level security is on for every table: listings are publicly readable when
`live` or `unclaimed`, writable only by their owner; messages are readable only
by the two people in the conversation.

## Go-to-market: claim-your-listing outreach

The plan to seed the directory: find small businesses in a target area (starting
with Nairobi, Kenya), pre-create a listing for them from public info, then email
the business contact to invite them to claim and edit it.

This is not built yet. Before building it, it needs to be scoped carefully:

- Sourcing contact info from public business directories/listings (not scraping
  personal data or bypassing site terms of service / robots.txt).
- Outreach emails need to comply with anti-spam law in the sending and
  destination jurisdictions (e.g. Kenya's Data Protection Act, GDPR if any EU
  contacts, CAN-SPAM if any US contacts) — a real postal address, honest subject
  lines, working unsubscribe/opt-out, and a suppression list.
- Rate limits and a documented data-retention/deletion policy for anyone who
  never claims their listing.

## Setup

### 1. Supabase

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
   (region `eu-central-1` or `eu-west-2` are the closest to Kenya).
2. In the SQL editor, run `supabase/migrations/0001_init.sql`, then
   `supabase/seed.sql`.
3. Copy the project URL and the `anon` public key from Project Settings → API.

### 2. Web app, locally

```bash
cd apps/web
cp .env.example .env.local   # paste the URL and anon key
npm run dev
```

### 3. Vercel

1. Import the repo at [vercel.com/new](https://vercel.com/new).
2. Set **Root Directory** to `apps/web` — the repo holds two apps, so the
   default root will not build.
3. Add both `NEXT_PUBLIC_SUPABASE_*` variables for Production, Preview and
   Development.
4. Deploy. Then in Supabase → Authentication → URL Configuration, add the
   Vercel domain as a Site URL and a redirect URL.

The anon key is safe to expose — row level security is what protects the data,
which is why every table has policies. Never put the `service_role` key in this
app.

## Status

- Web app builds and runs; home page reads categories from Supabase and shows a
  setup notice until the environment variables are set.
- Auth session refresh is wired via `apps/web/src/proxy.ts` (Next.js 16 renamed
  middleware to proxy).
- Mobile app is still a fresh Expo starter.
- Sign-up, listings, messaging and the claim flow are designed but not built.

## Development

```bash
# Web
cd apps/web && npm run dev

# Mobile
cd apps/mobile && npm run start
```
