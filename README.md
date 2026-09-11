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
- Design is still pending — a visual reference is coming before any screens are
  built. Until then, work here is scaffolding and structure only.

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

## Status

Early scaffolding only — both apps are fresh framework starters, not yet wired
to any backend, auth, or design system.

## Development

```bash
# Web
cd apps/web && npm run dev

# Mobile
cd apps/mobile && npm run start
```
