# KAPOSA FUTEXI — Launch Checklist

Status: ready to execute. Each step needs an account only you can create. Do them in order; each takes 5 to 15 minutes.
Date: 2026-10-07

## 0. Before you start

- [ ] GitHub push works (`git push -u origin main` from the project folder). Add `kp-sankar` as a collaborator on `kps-code/futexi`, or sign in as `kps-code`.
- [ ] Admin content filled: Site Settings, three Team Members, About Page.
- [ ] Review `docs/content-lock.md` §12 open items: Instagram handle, GitHub URL, Privacy and Terms text.

## 1. Database: Neon (free)

1. Create an account at neon.tech, then a project named `futexi` in the Singapore region (closest to Chennai).
2. Copy the **pooled** connection string (ends with `-pooler` in the host, `?sslmode=require`).
3. Keep it for step 3. Never paste it into any file in the repo.

## 2. Email: Resend (free)

1. Create an account at resend.com. Create an API key named `futexi-production`.
2. Add and verify the domain `kaposafutexi.com` (DNS records are shown there; they go into the domain registrar in step 5).
3. Until the domain is verified, leads still save in the admin; only the email notification is skipped.
4. The same key powers admin emails ("Forgot password" on /admin/login, sent from `LEAD_FROM_EMAIL`). With Resend's test sender (`onboarding@resend.dev`) those emails reach only the Resend account owner's address; after the domain is verified they reach every team member.

## 3. Hosting: Vercel (free Hobby plan is enough to start)

1. Create an account at vercel.com with the GitHub account that owns `kps-code/futexi`. Import the repository.
2. Framework preset: Next.js. Build command: leave default (the `vercel-build` script runs migrations, then builds).
3. Environment variables (Production and Preview):

| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon pooled connection string |
| `PAYLOAD_SECRET` | run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `IP_HASH_SALT` | run the same command again (a different value) |
| `NEXT_PUBLIC_SITE_URL` | `https://kaposafutexi.com` (Preview: leave unset, Vercel preview URLs vary) |
| `CRON_SECRET` | run the command again (min 16 chars) |
| `RESEND_API_KEY` | from step 2 |
| `LEAD_NOTIFY_EMAIL` | `kpsankar1398kp@gmail.com` |
| `LEAD_FROM_EMAIL` | `KAPOSA FUTEXI <hello@kaposafutexi.com>` once the domain is verified |
| `LOG_LEVEL` | `info` |

4. Storage: add **Vercel Blob** to the project (Storage tab). It injects `BLOB_READ_WRITE_TOKEN` automatically. Team photos upload there.
5. Deploy. The first deploy runs `payload migrate` against Neon, then builds. Open `/admin` on the Vercel URL and create the first admin user (it gets the built-in Admin role automatically).
5a. Team access: Admin → Roles has Admin and Editor; create more roles if needed (per menu: no access / view / edit). Admin → Users → Create New → choose the role. That person sees only what the role allows.
6. Seed content into production once, from your PC with the Neon URL: `DATABASE_URL=<neon pooled url> npm run seed`. This creates the three team members and the eight FAQ entries, and fills Site Settings, About, Home Page texts and the AI Assistant Demo if they are empty.
7. In the admin, open Settings → Site Settings → Branding to upload a logo (SVG or transparent PNG, about 40 px tall, under 20 KB; optional white version for the dark theme), a site icon for the browser tab (square, 512 x 512) and to pick the default theme for first-time visitors (light at launch). Then open the SEO tab and upload a 1200 x 630 share image if you want your own; otherwise the built-in one is used in WhatsApp and Instagram link previews. For testimonials: Content → Testimonials → Create New, enter the client's name and business, Save, copy the Feedback link and send it on WhatsApp. The client fills in the rating and quote; tick Visible to publish it on the home page.
7. Turn on **Speed Insights** and **Web Analytics** in the Vercel project (free). Speed Insights gives real-visitor LCP, the number that matters.
8. Cron: `vercel.json` already schedules `/api/cron/cleanup` daily at 02:00 IST. Vercel reads it on deploy.

## 4. Error reporting: Sentry (optional, free)

1. Create a Next.js project at sentry.io. Copy the DSN.
2. Add `SENTRY_DSN` and `NEXT_PUBLIC_SENTRY_DSN` (same value) and `SENTRY_AUTH_TOKEN` (for source maps) to Vercel. Redeploy.
3. Without these, errors still log to Vercel logs; nothing breaks.

## 5. Domain: kaposafutexi.com

1. Buy the domain at any registrar (GoDaddy, Namecheap, Hostinger). Keep auto-renew on.
2. In Vercel, Project → Settings → Domains, add `kaposafutexi.com` and `www.kaposafutexi.com` (redirect www to the bare domain).
3. At the registrar, add the DNS records Vercel shows (an A record and a CNAME). Add the Resend records from step 2 as well.
4. Wait for the green tick in Vercel (usually under an hour). HTTPS is automatic.

## 6. After the first production deploy

- [ ] Visit the home page, a demo, the contact form. Submit a test lead and confirm it appears in the admin and the email arrives.
- [ ] Make a test booking on `/demo/booking/book` and check Demo Bookings in the admin.
- [ ] Check Admin → Analytics shows your own visits.
- [ ] Run Lighthouse on the production URL from Chrome DevTools (mobile). Expect performance 90+, the rest 100.
- [ ] Add the production URL to Instagram bio and the WhatsApp Business profile.
- [ ] Search Console: add the property, submit `https://kaposafutexi.com/sitemap.xml`.

## 7. Post-launch rhythm

- One demo-related Instagram post per week, each linking to its case study (`/demos/<slug>`).
- Review Admin → Analytics every Monday: top pages, referrers, the funnel, new leads.
- Keep `main` green: CI runs typecheck, lint, unit, integration, build, Lighthouse on every push.

## Costs

Neon free, Resend free (3,000 emails a month), Vercel Hobby free, Sentry free tier, Blob free up to 1 GB. The domain is the only paid item, roughly ₹800 to ₹1,200 a year.
