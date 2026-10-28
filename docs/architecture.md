# KAPOSA FUTEXI — Architecture v1

Status: FOR REVIEW. Companion to content-lock.md. Nothing is built yet.
Date: 2026-10-07

Requirements this document satisfies:
1. Senior-level, correct architecture with clear boundaries.
2. Every API call is logged (who, what, when, how long, result).
3. Every page visit is tracked in detail and linked to leads.
4. Performance budgets are defined, measured and enforced.

---

## 1. System overview

```text
BROWSER
  (site)   marketing pages        static + ISR, React Server Components
  (demos)  demo mini-sites        static
  /admin   Payload admin          server-rendered, authenticated
  tracker  tiny client script     sendBeacon -> /api/track

NEXT.JS ON VERCEL  (one app, one deploy)
  middleware.ts        request-id, security headers, bot flag, geo
  app/api/track        page views + events        -> Postgres (non-blocking)
  app/api/health       uptime check
  app/api/cron/*       retention cleanup, daily digest
  server actions       contact form -> leads table -> email -> WhatsApp link
  Payload CMS          collections, auth, media, admin UI, REST/Local API
  lib/logger           pino structured JSON, bound to request-id
  lib/with-logging     wraps every handler and action -> api_logs

DATA
  Neon Postgres        content, leads, api_logs, visitors, sessions, page_views, events
  Vercel Blob          images

OBSERVABILITY
  Vercel logs          JSON lines from pino (optional Axiom drain for search)
  Sentry               errors + stack traces, free tier
  Vercel Speed Insights real-user Core Web Vitals
  PostHog (optional)   session replay + funnels, free tier, switched by env var
```

One codebase, one deploy, one database. No separate backend service. Everything the admin needs to see lives inside /admin.

---

## 2. Folder structure

```text
futexi/
  app/
    (site)/                     main website, shared layout
      layout.tsx                Header, Footer, ThemeProvider, Tracker
      page.tsx                  Home
      services/page.tsx
      demos/page.tsx
      demos/[slug]/page.tsx     case study template
      about/page.tsx
      contact/page.tsx
      privacy/page.tsx
      terms/page.tsx
    (demos)/                    demo sites, own root layout + demo.css theme, noindex, Tracker
      demo/booking/             Nova Studio: landing + 5-step booking flow (live slots, WhatsApp confirm)
      demo/salon/
      demo/restaurant/
      demo/interior/
      demo/tuition/
      demo/ai-business/
    (payload)/                  Payload admin + REST, generated
      admin/[[...segments]]/
      api/[...slug]/
    api/
      track/route.ts            analytics ingest
      health/route.ts
      cron/cleanup/route.ts
      cron/digest/route.ts
    layout.tsx                  root: html, body, fonts
    not-found.tsx
    error.tsx
  components/
    site/                       Header, Hero, TrustStrip, Investment, FAQ ...
    case-study/                 10-section template
    demos/                      BookingFlow, Menu, Gallery, WhatsAppButton
    ui/                         shadcn primitives
    tracking/                   Tracker, useTrack()
  content/
    site.ts                     all marketing copy, typed
    demos.ts                    7 case studies
    ai-script.ts                scripted AI conversations
    faq.ts
  payload/
    payload.config.ts
    collections/
      Users.ts
      TeamMembers.ts
      Media.ts
      Leads.ts
      ApiLogs.ts
      Visitors.ts
      Sessions.ts
      PageViews.ts
      Events.ts
      DemoBookings.ts           appointments from the Booking demo (unique date+time), 90 day retention
    globals/
      SiteSettings.ts
      AboutPage.ts
    admin/
      Dashboard.tsx             custom view: traffic + leads
      LeadJourney.tsx           custom field: visitor's page history
    hooks/
      revalidate.ts             on change -> revalidateTag
  server/
    actions/
      submit-contact.ts
    logging/
      logger.ts                 pino instance
      with-logging.ts           handler and action wrapper
      sanitize.ts               mask phone, email, strip secrets
    analytics/
      ingest.ts                 validate + write page views and events
      session.ts                session stitching rules
      bots.ts                   UA and heuristic bot filter
    email/
      resend.ts
      templates/
    rate-limit.ts
    env.ts                      validated env (zod), fails build if missing
  lib/
    utils.ts
    whatsapp.ts                 build wa.me links with prefilled text
  middleware.ts
  tests/
    unit/                       vitest
    e2e/                        playwright
  .github/workflows/ci.yml
  docs/
```

Rules:
- Pages render content; they never talk to the database directly. They call functions in `server/`.
- Every boundary validates with zod: form input, track payload, env, cron auth.
- Nothing in `components/` imports from `payload/` or `server/`. Data flows down as props.

---

## 3. Request lifecycle and API logging

### 3.1 Request ID
`middleware.ts` runs on every request:
1. Generate `x-request-id` (UUID v7, time-sortable) if not present.
2. Add security headers: HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP (report-only first, enforce after one week).
3. Read Vercel geo headers (country, city) and attach as request headers for downstream use.
4. Flag obvious bots from User-Agent so analytics can skip them.

### 3.2 The logging wrapper
Every route handler and server action is wrapped:

```ts
export const POST = withLogging('track.ingest', async (req, ctx) => { ... })
export const submitContact = withAction('contact.submit', async (input, ctx) => { ... })
```

The wrapper:
- Starts a timer, binds the logger to `request_id`, `route`, `visitor_id`, `user_id`.
- Runs the handler inside try/catch. Errors are captured to Sentry with the request id.
- Emits one structured JSON line to stdout (Vercel keeps these, Axiom indexes them if enabled).
- Inserts one row into `api_logs` using `after()` from `next/server`, so the response is sent first and the write never delays the user.

### 3.3 api_logs row

| Column | Example | Note |
|---|---|---|
| id | uuid | |
| request_id | 019245f3-... | same id in stdout, Sentry, DB |
| ts | 2026-10-07T10:21:33Z | |
| kind | route / action / payload | |
| name | contact.submit | logical name, not just the path |
| method | POST | |
| path | /contact | |
| status | 200 | |
| duration_ms | 184 | |
| visitor_id | uuid | from cookie, null for admin |
| user_id | uuid | admin user, null for public |
| ip_hash | sha256(ip + daily salt) | never raw IP |
| country / city | IN / Chennai | from Vercel geo |
| user_agent | ... | truncated to 255 |
| referer | https://instagram.com/... | |
| input_summary | {"need":"Booking Website","budget":"..."} | sanitized: phone and email masked, no free text |
| error_code | VALIDATION_FAILED | |
| error_message | ... | truncated, no stack (stack goes to Sentry) |

What is never logged: passwords, session tokens, full form text, raw phone numbers, raw emails, raw IPs.

Payload's own REST and admin calls go through the same wrapper via Payload's `onInit` and `endpoints` hooks, so admin activity (who edited what) is also in `api_logs` with `user_id`.

### 3.4 Where to look
- Admin > API Logs: filter by name, status, date, user. Read-only.
- Vercel > Logs: raw JSON lines, searchable by request_id.
- Sentry: errors grouped, each with request_id.
- Retention: 90 days in Postgres, deleted by the daily cron. Older history stays in Axiom if enabled.

---

## 4. Visitor analytics

### 4.1 What "who visits which page" means here
Visitors are anonymous until they act. The system assigns each browser a visitor id, records every page view and key click, and when that visitor submits the contact form or taps WhatsApp, the whole journey is attached to the lead. The admin then sees: "This lead came from Instagram, viewed the Salon demo three times, opened pricing, then submitted the form."

Identity of a visitor who never submits anything is not knowable, and we do not try to fingerprint around that.

### 4.2 Identifiers

| Id | Lives in | Lifetime | Purpose |
|---|---|---|---|
| visitor_id | first-party cookie `kf_vid`, httpOnly=false, SameSite=Lax | 13 months | same person across visits |
| session_id | cookie `kf_sid` | 30 min idle timeout, max 4 h | one visit |
| lead_id | leads table | permanent | linked to visitor_id on form submit |

### 4.3 Tracker (client)
A 2 KB script in the `(site)` and `(demos)` layouts:
- On route change (App Router navigation): send `page_view` with path, title, referrer, UTM params, screen size, theme.
- On leave or next navigation: send `page_leave` with `duration_ms` and `max_scroll_pct` for the previous page.
- On marked elements (`data-track="whatsapp_click"`): send `event` with name and props.
- Transport: `navigator.sendBeacon` to `/api/track`, batched every 2 seconds, never blocks rendering.
- Respects `prefers-reduced-data` and does nothing for flagged bots.

Tracked events: `page_view`, `page_leave`, `cta_click` (which CTA, where), `whatsapp_click`, `demo_open` (slug), `demo_filter`, `ai_demo_chip` (chip name), `theme_toggle`, `form_start`, `form_submit`, `form_error`, `outbound_click`.

### 4.4 Ingest (server)
`/api/track`:
1. zod-validate the batch (max 20 items, each field bounded).
2. Drop bots and duplicates (same visitor, same path, within 1 s).
3. Upsert visitor (first_seen, last_seen, first referrer, first UTM, device, country).
4. Stitch session: reuse `kf_sid` if last activity < 30 min, else create a new session with landing_path and referrer.
5. Insert page_views and events in one transaction.
6. Rate limit: 60 requests per minute per visitor id, 600 per minute per ip_hash.

### 4.5 Tables

| Table | Key columns | Indexes |
|---|---|---|
| visitors | id, first_seen, last_seen, first_referrer, first_utm_source/medium/campaign, device, browser, os, country, city, lead_id, visits_count | (last_seen), (lead_id) |
| sessions | id, visitor_id, started_at, ended_at, landing_path, exit_path, referrer, utm_*, page_count, duration_ms, device, country | (visitor_id, started_at), (started_at) |
| page_views | id, session_id, visitor_id, path, title, referrer, ts, duration_ms, max_scroll_pct, theme | (visitor_id, ts), (path, ts), (session_id) |
| events | id, session_id, visitor_id, name, props jsonb, path, ts | (name, ts), (visitor_id, ts) |
| leads | id, name, business_name, email, whatsapp, business_type, need, budget, details, visitor_id, source_utm jsonb, status (new/contacted/quoted/won/lost), notes, created_at | (status, created_at), (visitor_id) |

Writes go through Payload's Local API inside `after()`, so they never sit on the response path (measured: the ingest route answers in about 4 ms). Dashboard aggregates use raw SQL through Payload's Drizzle instance. If traffic grows, swap the ingest writes to direct Drizzle inserts; the schema and admin UI stay the same.

### 4.6 Admin views
- Dashboard: visitors, sessions, page views, WhatsApp clicks, form submits, leads for today, 7 days, 30 days. Top pages, top referrers, top UTM sources, device split, country split, the Instagram to Demo to CTA to WhatsApp funnel.
- Visitors: list with last seen, country, pages, lead link. Click one to see the full timeline.
- Leads: list with status, source, and the journey panel (every page and event before the submit).
- Live: last 50 page views, auto-refresh.

### 4.7 Privacy
- No raw IPs stored. Country and city only.
- No third-party cookies. PostHog, if enabled, is loaded only after the visitor accepts the small privacy notice.
- Privacy Policy page states what is collected and why.
- Retention: page_views and events 180 days, api_logs 90 days, visitors and leads kept.
- Lead delete in admin also deletes the linked visitor history.

---

## 5. Performance

### 5.1 Budgets (mobile, enforced in CI)

Lab numbers come from Lighthouse mobile emulation (slow 4G, 4x CPU slowdown). Lighthouse's model charges all JavaScript that finishes before the first paint against LCP, so lab LCP for a React/Next page sits near 3 s even when the heading paints at first paint (observed in the trace: paint at 0.36 s unthrottled). Field LCP from real visitors is the number that matters; Vercel Speed Insights tracks it.

| Metric (lab, mobile) | Budget | Measured 2026-10-07 (home) |
|---|---|---|
| Lighthouse Performance | >= 90 | 92 to 93 |
| Accessibility, Best Practices, SEO | >= 95 each | 100, 100, 100 |
| FCP | < 1.5 s | 0.9 s |
| LCP | < 3.5 s lab, < 2.5 s field (p75) | 3.0 s lab |
| CLS | < 0.05 | 0 |
| TBT | < 300 ms | 140 to 170 ms |
| JS shipped on Home | < 190 KB compressed | 173 KB |
| Fonts | 2 families, < 90 KB | 73 KB |
| Redirects before first paint | 0 | 0 (Payload's Critical-CH header scoped to /admin) |
| Console errors | 0 | 0 |

Gates live in lighthouserc.json and run in CI against the built app on three pages: home, a case study, contact.

### 5.2 How we hit them
- Rendering: all `(site)` and `(demos)` pages are statically generated. CMS-driven parts use ISR with `revalidateTag`. Payload `afterChange` hooks call revalidate, so an admin edit is live within seconds while pages still serve from the CDN.
- Server Components by default. Client components only for interaction: header, theme toggle, tracker, AI demo box, booking flow, filters, animations.
- Images: `next/image` with AVIF and WebP, explicit `sizes`, blur placeholders. Payload generates three sizes on upload.
- Fonts: `next/font` with Sora and Inter, subset to Latin, `display: swap`.
- Animation: no animation library. Scroll reveals are CSS transitions driven by one IntersectionObserver client component; hero, AI demo and device mock use CSS transitions. Animate `transform` and `opacity` only. Honour `prefers-reduced-motion`. (Motion was tried in Phase 3 and removed: it cost ~35 KB gzipped plus hydration for every revealed section.)
- Code splitting: each demo is its own route group and bundle. Heavy pieces (booking calendar, gallery lightbox) are `dynamic()` imported.
- Below-the-fold sections use `content-visibility: auto`.
- Logging and analytics writes run in `after()` or via `sendBeacon`. They never sit on the request path.
- Database: Neon pooled connection string, indexes above, no N+1 in admin views, dashboard counts from a nightly materialised summary table (`daily_stats`) rather than scanning page_views.
- Edge middleware does only header work. No DB calls in middleware.
- Caching: immutable static assets, `stale-while-revalidate` on ISR pages, `Cache-Control: no-store` on /api and /admin.

### 5.3 Measurement
- Vercel Speed Insights for real users.
- Lighthouse CI on every pull request, fails the build if a budget is missed. Three runs per page, best run counts (`optimistic`), server warmed first. The CI runner is the authoritative measurement: local Windows runs swing by 20 points from Defender scans and other background load, so use `npm run lighthouse` locally only as a smoke check.
- Known lab finding (2026-10-07): the rupee sign (U+20B9) sits in Inter's Latin-Extended subset, an 83 KB download. A local `KF Rupee` font-face (unicode-range U+20B9, system fonts) serves it instead. A Playwright test asserts only two font files load.
- Sentry performance traces on server actions.
- Weekly digest email (cron) with traffic, leads and Core Web Vitals.

---

## 6. Cross-cutting correctness

| Concern | Decision |
|---|---|
| Validation | zod at every boundary: forms, track payload, env, cron secret, Payload field validators |
| Auth | Payload auth, email + password, roles: admin, editor. Admin routes behind Payload access control. Cron routes require `CRON_SECRET` header |
| Rate limiting | Upstash Ratelimit (free tier) on /api/track and the contact action. Fallback in-memory limiter for local dev |
| Spam | Honeypot field + Cloudflare Turnstile on the contact form |
| Errors | `error.tsx` per route group, `not-found.tsx`, Sentry on client and server, request_id shown on the error screen so a user can quote it |
| Security headers | CSP, HSTS, frame-ancestors none (except demo iframes from own origin), Referrer-Policy strict-origin-when-cross-origin |
| Secrets | Vercel env vars only. `server/env.ts` validates at build. `.env.example` committed |
| Email | Resend. Lead and feedback notifications to the owner as HTML cards (`src/server/email/notify.ts`: name, need/type/budget chips, WhatsApp/Call/Email buttons, message, details, source path, admin link; plain-text twin; all user text escaped). Reply-To is the lead |
| Backups | Neon point-in-time restore (7 days free). Weekly `pg_dump` to Blob via cron |
| Theme | next-themes, class strategy, cookie so SSR renders the right theme with no flash |
| i18n | English only for v1. Structure allows Tamil later |
| Accessibility | Semantic landmarks, focus states, 4.5:1 contrast in both themes, keyboard-operable booking flow |

---

## 7. Testing and CI

| Layer | Tool | What |
|---|---|---|
| Unit | Vitest | session stitching, bot filter, sanitizer, whatsapp link builder, zod schemas |
| Integration | Vitest + test Postgres | ingest writes correct rows, with-logging writes api_logs, retention deletes correctly |
| E2E | Playwright | contact form happy path and validation, booking flow end to end, theme toggle, tracker sends beacons, admin login and edit team member |
| Performance | Lighthouse CI | budgets in 5.1 on Home, Demos, one case study, one demo site |
| Static | TypeScript strict, ESLint, Prettier | on every commit via lint-staged |

GitHub Actions on every PR: typecheck, lint, unit, integration, build, Lighthouse. Vercel deploys a preview URL per PR. `main` deploys to production. Branch protection: one approval from another team member.

---

## 8. Environments

| Env | DB | URL | Notes |
|---|---|---|---|
| local | Docker Postgres or Neon branch | localhost:3000 | seed script creates admin user, team, demo leads |
| preview | Neon branch per PR | *.vercel.app | analytics writes go to the branch, never production |
| production | Neon main | kaposafutexi.com | cron enabled, Sentry enabled |

Required env vars: `DATABASE_URL`, `PAYLOAD_SECRET`, `BLOB_READ_WRITE_TOKEN`, `RESEND_API_KEY`, `CRON_SECRET`, `IP_HASH_SALT`, `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`, `SENTRY_DSN`, `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_POSTHOG_KEY` (optional), `TURNSTILE_SECRET_KEY`, `NEXT_PUBLIC_TURNSTILE_SITE_KEY`.

---

## 9. Build phases (updated)

| Phase | Work | Done when | Time |
|---|---|---|---|
| 1 | Scaffold: Next.js, TypeScript strict, Tailwind, fonts, theme, Payload + Neon + Blob, middleware, logger, with-logging, env validation, CI, Sentry | Admin login works on a preview URL. Every request writes an api_logs row | 3 to 4 days |
| 2 | Tracker + ingest + tables + dashboard + leads collection | Page views and events visible in admin. Contact form creates a lead with journey | 3 days |
| 3 | Home page, all sections, both themes | Home passes Lighthouse budgets | 4 to 5 days |
| 4 | Case-study template + Booking demo | Case study and live demo pass budgets | 4 to 5 days |
| 5 | Services, About, Contact, Privacy, Terms, domain, email, cron | Live on kaposafutexi.com | 2 days |
| 6 | Salon, AI business, Restaurant demos | One per week | 3 weeks |
| 7 | Interior, Tuition, Before/After polish | All seven live | 2 weeks |

Go live after Phase 5, about 3 to 4 weeks, with one demo and full logging, analytics and admin in place.

---

## 10. Decisions to confirm

1. PostHog session replay: on or off at launch. Recommendation: on, it is free and shows exactly what visitors do.
2. Axiom log drain: on or off. Recommendation: off at launch, Postgres 90 days is enough. Turn on if traffic grows.
3. Retention periods above (180 days analytics, 90 days API logs). Change if you want longer.
4. Weekly digest email recipients: all three of you, or one.
