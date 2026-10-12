# KAPOSA FUTEXI

Website, admin panel and analytics for KAPOSA FUTEXI. One Next.js app with Payload CMS, Postgres and Vercel.

Planning documents, read these first:

- [docs/content-lock.md](docs/content-lock.md) — every heading, button and text on the site
- [docs/architecture.md](docs/architecture.md) — system design, logging, analytics, performance budgets

## Stack

Next.js (App Router, TypeScript strict), Tailwind CSS v4, Motion, Payload CMS (admin at `/admin`), Postgres (Neon in production), Vercel Blob for images, pino structured logs, Sentry, Vitest, Playwright.

## Local setup

Requirements: Node 22+, npm, and a Postgres: the installed PostgreSQL service (port 5432), Docker Desktop (`npm run db:up`, port 5433), or a Neon connection string.

```bash
npm install
cp .env.example .env        # set PAYLOAD_SECRET, IP_HASH_SALT and DB_PASSWORD (or DATABASE_URL)
npm run db:create           # creates the futexi database if missing
npm run dev                 # http://localhost:3000
```

Alternative without the script (PowerShell):

```powershell
& "C:\Program Files\PostgreSQL\18\bin\createdb.exe" -U postgres futexi
```

First visit to `http://localhost:3000/admin` asks you to create the first admin user.

Generate secrets:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Scripts

| Script                               | What it does                                                 |
| ------------------------------------ | ------------------------------------------------------------ |
| `npm run dev`                        | Dev server with hot reload                                   |
| `npm run build` / `npm start`        | Production build and serve                                   |
| `npm run typecheck`                  | TypeScript, strict                                           |
| `npm run lint`                       | ESLint (Next core-web-vitals + TypeScript rules)             |
| `npm run format` / `format:check`    | Prettier with Tailwind class sorting                         |
| `npm run test:unit`                  | Pure unit tests, no database                                 |
| `npm run test:int`                   | Integration tests against the database                       |
| `npm run test:e2e`                   | Playwright browser tests (starts the dev server)             |
| `npm run generate:types`             | Regenerate `src/payload-types.ts` after changing collections |
| `npm run migrate:create` / `migrate` | Payload migrations for production                            |
| `npm run db:up` / `db:down`          | Local Postgres via Docker                                    |
| `npm run db:create`                  | Creates the database named in .env if missing                |
| `npm run vercel-build`               | What Vercel runs: migrations, then build                     |

## Project layout

```text
src/
  app/
    (site)/            public website: layout, pages, globals.css
    (payload)/         Payload admin and REST (generated, REST wrapped for logging)
    api/health         uptime check
  components/
    site/              header, footer, theme, page intro
    ui/                button and primitives
  content/             static copy from docs/content-lock.md
  lib/                 pure helpers (ids, whatsapp links, cn)
  payload/
    collections/       users, media, team-members, leads, api-logs
    globals/           site-settings, about-page
    access.ts          role helpers
  server/
    env.ts             zod-validated environment, fails the build when wrong
    logging/           logger, request meta, sanitizer, with-logging wrapper, persist
  proxy.ts             request id + bot flag on every request
tests/
  unit/                vitest, no database
  int/                 vitest, database
  e2e/                 playwright
```

## Logging

Every route handler and server action is wrapped with `withRoute` / `withAction` from `src/server/logging/with-logging.ts`. Each call emits one JSON log line and one row in the `api-logs` collection (written after the response is sent). Admin users see them under System > API Logs. See architecture doc §3.

## Analytics

Every page view, time on page, scroll depth and tracked click is stored first-party (`visitors`, `sessions`, `page-views`, `events`). The proxy issues the `kf_vid` (13 months) and `kf_sid` (30 minutes idle) cookies; the tracker in `src/components/tracking/tracker.tsx` batches to `/api/track`. Admin > Analytics shows KPIs, funnel, top pages, referrers, devices and a live feed. Each lead shows the visitor journey that led to the form. Retention runs daily via `/api/cron/cleanup` (Vercel Cron, `CRON_SECRET`). See architecture doc §4.

## Environments

| Env        | Database                       | Notes                                        |
| ---------- | ------------------------------ | -------------------------------------------- |
| local      | Docker Postgres or Neon branch | schema auto-pushed in dev                    |
| preview    | Neon branch                    | Vercel preview per PR                        |
| production | Neon main                      | `vercel-build` runs migrations, cron, Sentry |

Required variables are listed in `.env.example` and validated in `src/server/env.ts`.
