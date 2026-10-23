# Phase 6 — Visual Polish: Architecture & Motion Choreography

Status: plan locked 2026-10-09, implemented the same day. Copy, section order and ids stay exactly as in `docs/content-lock.md`; this phase changes appearance and motion only.

> **Phase 8 (2026-10-21):** the palette changed with the showroom home. The accent token is now the ink colour (buttons, links, rings, glows, badges); the cyan→violet gradient is retired everywhere (the old --accent-from/--accent-to tokens resolve to ink); the wordmark is KAPOSA in ink + FUTEXI in muted ink, the italic serif accent lines are ink, the favicon is a white K on ink. WhatsApp actions are a green (#25D366) pill. Rows below that mention gradient fills describe the phase 6 look; the current tokens are in docs/content-lock.md §8.
>
> **Demo Motion v2 (2026-10-22):** the "no GSAP, no Three.js" row below still holds for the public site pages and for every demo on phones, tablets and reduced motion. On desktops with a mouse the four brand demo homes (Gym, Nova, Salon, Tuition) lazy-load GSAP, Lenis, a per-brand motion recipe and a Three.js hero scene after the page has loaded (components/demos-shared/motion-v2); the showroom home already loads Three.js on desktop. CI still measures /demo/booking on mobile, where none of it is requested. Details in docs/content-lock.md (demo note).

Direction in one line: **lit glass on deep navy**. One dominant hue (indigo-violet), one accent (cyan), one neutral family (navy greys). Depth comes from light, not from decoration: gradient hairlines, soft glows, glass surfaces, and motion that explains the product.

Hard constraints carried from earlier phases:

| Constraint | Why |
|---|---|
| No Framer Motion, GSAP, Three.js, Zustand | Lighthouse CI gates: performance ≥ 0.90, TBT ≤ 350 ms, script ≤ 190 KB on public pages |
| Motion = CSS keyframes and transitions on `transform`, `opacity`, `filter` only | Compositor-friendly, zero JavaScript on the main thread |
| Fonts stay Inter + Sora Latin subsets, two files | `tests/e2e/fonts.e2e.spec.ts` asserts exactly two woff2 downloads |
| No new client components | Hydration cost is already budgeted; this phase adds zero `'use client'` files |
| `prefers-reduced-motion` honoured globally | `src/app/_shared/base.css` zeroes animation and transition durations |
| Headings and section ids unchanged | `tests/e2e/home.e2e.spec.ts` checks ids and heading names |

---

## 1. Component hierarchy and data architecture

Atomic map of what this phase touches. Everything is a **Server Component** unless marked (client); no data fetching or state changes.

| Level | Component | File | Change |
|---|---|---|---|
| Atom | `Button` / `ButtonLink` | `src/components/ui/button.tsx` | Primary gains a light sweep on hover and a 2 px lift; secondary gains an accent border on hover |
| Atom | `IconBadge` | `src/components/home/section.tsx` | Fills with the accent gradient when its parent `.group` is hovered |
| Atom | `Eyebrow` (new) | `src/components/home/section.tsx` | Pill with a gradient dot, replaces the bare uppercase label in `SectionHeading`, `PageIntro`, Hero |
| Atom | `Avatar` | unchanged | Gets a glow ring from the card that contains it |
| Molecule | `Card` + `cardClasses` | `src/components/home/section.tsx` | Gradient border on hover (`glow-ring`), top highlight, lift, tinted shadow; classes exported so `<article>` and `<li>` can share them |
| Molecule | `SectionHeading` | `src/components/home/section.tsx` | Larger display sizes, tighter tracking, eyebrow pill |
| Molecule | `DemoPreview` | `src/components/demos/demo-preview.tsx` | Screenshot zooms on hover, bottom gradient with "Open live demo" pill, Live badge with pulsing dot |
| Molecule | `DemoCard` | `src/components/demos/demo-card.tsx` | Category chip coloured by the demo accent |
| Molecule | `PageIntro` | `src/components/site/page-intro.tsx` | Glow background, eyebrow pill, bigger title, entrance choreography |
| Organism | `Hero` | `src/components/home/hero.tsx` | Layered glows + faint grid, eyebrow pill, bigger headline with live gradient, staggered entrance |
| Organism | `HeroMockup` (client, unchanged logic) | `src/components/home/hero-mockup.tsx` | Floating wrapper and a perspective tilt that flattens on hover (desktop only) |
| Organism | `TrustStrip` | `src/components/home/trust-strip.tsx` | Items become pills on a glass strip |
| Organism | `WhatWeBuild`, `WhyUs` | existing | Inherit `Card` and `IconBadge` upgrades |
| Organism | `AiSection` / `AiDemoBox` (client, unchanged logic) | `ai-section.tsx`, `ai-demo-box.tsx` | Glow halo behind the chat box, "online" dot in the header |
| Organism | `BeforeAfter` | `before-after.tsx` | "After" card gets a permanent gradient border and glow; arrow gets a soft ping |
| Organism | `EveryScreen` (client, unchanged logic) | `every-screen.tsx` | Glow halo behind the device frame |
| Organism | `HowWeWork` | `how-we-work.tsx` | Large watermark step numbers, card lift, gradient connector |
| Organism | `Investment` | `investment.tsx` | Gradient ring around the glass card, starting price in gradient text |
| Organism | `AboutTeaser` | `about-teaser.tsx` | Team cards use `cardClasses`, avatar glow ring |
| Organism | `Technology` | `technology.tsx` | Pills respond to hover with accent border and lift |
| Organism | `HomeFaq` | `home-faq.tsx` | Summary hover colour, circled plus that rotates |
| Organism | `FinalCta` | `final-cta.tsx` | Second sentence in gradient, two floating glow blobs, grid |
| Organism | `Header` (client, unchanged logic) | `header.tsx` | Active link gets a surface pill |
| Organism | `Footer` | `footer.tsx` | Gradient hairline on top |
| Page | Services, About, Demos, Contact | `src/app/(site)/*` | Inner pages pick up `PageIntro`, `cardClasses`, demo card upgrades |

**State:** none added. The only interactive state (hero step cycling, device cycling, AI chips, theme, mobile nav, demo filter) already lives in local `useState` inside existing client components. A Zustand store would add a dependency and bundle weight for state that is never shared between components, so it is deliberately not used.

**Types:** `Eyebrow` takes `{ children: ReactNode; className?: string }`. `cardClasses` is a `string` constant. `DemoPreview` keeps its `Props` type. No other prop shapes change.

---

## 2. Responsive, utility-first styling strategy

Tailwind v4 with `@theme inline`; tokens live in `src/app/(site)/globals.css`. Additions:

| Token | Dark | Light | Used by |
|---|---|---|---|
| `--glow` | `color-mix(accent 28%, transparent)` | `color-mix(accent 16%, transparent)` | hero, page intro, final CTA, halos |
| `--shadow-card` | `0 24px 60px -32px rgba(99,102,241,.55)` | `0 24px 48px -28px rgba(11,15,26,.18)` | `Card` hover |
| `--grid-line` | `rgba(255,255,255,.05)` | `rgba(11,15,26,.06)` | `bg-grid` |

New utilities (all in `globals.css`):

| Utility | Purpose |
|---|---|
| `bg-grid` | 48 px grid of hairlines, faded with a radial mask; sits under hero and final CTA |
| `glow-blob` | Rounded, blurred radial accent; positioned by the caller |
| `glow-ring` | 1 px gradient border drawn with a masked `::after`; opacity 0 → 1 on hover, or always on with `glow-ring-on` |
| `shadow-card` | Reads `--shadow-card` |
| `text-gradient-live` | `text-gradient` with a 200% background that drifts; applied at `lg:` only |
| `btn-shine` | Diagonal light sweep on hover for primary buttons |
| `animate-rise`, `animate-rise-soft` | Entrance: 16 px rise with fade, or rise only (LCP-safe for the h1) |
| `animate-float` | 7 s vertical drift for hero mockup and CTA blobs |
| `animate-ping-soft` | 2.4 s expanding ring for status dots |

Breakpoints are mobile-first and unchanged. Decorative floats and tilts attach at `lg:` only, so phones get static glows and no continuous animation besides the existing marquee.

Global CSS needs: keyframes `kf-rise`, `kf-float`, `kf-drift`, `kf-ping-soft`, `kf-shine`. No custom scrollbars, no new font faces.

---

## 3. Animation choreography

**Spatial logic**

- Above the fold, content rises *up* into place, left column first, then the mockup. The eye lands on the headline, then follows the stagger to the buttons.
- The mockup floats slowly and leans 6° toward the text on desktop; hovering flattens it, so the visitor feels it "turn to face them".
- Scroll sections keep the existing 80 ms stagger reveal. Cards lift *toward* the pointer on hover; demo screenshots zoom in, inviting a click.
- Status dots (hero eyebrow, AI "online", Live badges) ping outward: a quiet signal that things are running.

**Timing families**

| Class | Duration | Ease | Stagger / delay |
|---|---|---|---|
| Entrance (hero, page intro) | 600 ms | `cubic-bezier(.22,1,.36,1)` | 90 ms per child, h1 at 0 ms with no fade |
| Scroll reveal (existing) | 600 ms | same | 80 ms, capped 600 ms |
| Hover lift / border / colour | 250 ms | ease-out | none |
| Screenshot zoom | 700 ms | same quint | none |
| Button sheen | 700 ms | ease | none |
| Ambient float | 7 s | ease-in-out, infinite | blobs offset 2 s |
| Gradient drift (desktop only) | 10 s | linear, infinite | none |
| Ping | 2.4 s | `cubic-bezier(0,0,.2,1)`, infinite | none |

**Hardware acceleration:** every animation uses `transform` and `opacity`; `filter: blur` is static on blobs. `background-position` drift is limited to the hero headline on `lg:`.

**Largest Contentful Paint guard:** the hero `h1` never starts at `opacity: 0`. It uses `animate-rise-soft` (transform only), so the browser can count its first paint as LCP without waiting for a fade.

**Phones:** the entrance choreography (`lg:animate-rise`, `lg:animate-rise-soft`) runs on desktop widths only. On phones the hero and page intros render in their final state immediately, so mobile Speed Index and LCP are identical to the pre-polish build.

**Reduced motion:** `base.css` already forces animation and transition durations to 0.01 ms under `prefers-reduced-motion: reduce`; the hero cycling and device cycling components already stop their timers. Nothing new to wire.

---

## 4. Security architecture

- No `dangerouslySetInnerHTML` is introduced; the only existing use is the JSON-LD script, unchanged.
- No user input is rendered by this phase. Contact form validation (zod, server action) is untouched.
- No inline scripts, no external scripts, no third-party fonts or CDNs added.
- All hrefs stay as they were (internal routes and the validated WhatsApp link builder).
- `npm audit` runs in CI as before.

---

## Verification plan

1. `npm run typecheck`, `npm run lint`, `npm run format:check`, `npm run test:unit`.
2. `node scripts/capture-site-sections.mjs <dir>` before and after, compare in both themes at 1440 and 390 widths.
3. Playwright e2e `home`, `frontend`, `fonts` specs.
4. Lighthouse on `/` and `/demos/booking` with the production build; CI numbers are authoritative, local numbers on this Windows box are noisy.

---

## Results (2026-10-09, local machine)

Two adjustments were made after the first measurement, both invisible to the visitor:

- Hover-only pseudo-elements. The gradient ring on cards and the sheen on primary buttons are created only under `@media (hover: hover)`. Phones never build those masked layers; the three always-on rings (AI box, After card, Investment) stay on every device.
- Entrance choreography and the background grid are desktop-only (`lg:`), so mobile first paint is unchanged.

Fair comparison: the committed code (worktree, port 3101) and the polished code (port 3100) were served at the same time and measured in the same Lighthouse CI passes, mobile emulation, five runs, alternating URLs. Medians:

| Page | Build | Performance | LCP ms | TBT ms | Speed Index |
|---|---|---|---|---|---|
| `/` | before | 86 | 3263 | 298 | 2796 |
| `/` | after | 89 | 3156 | 227 | 2648 |
| `/demos/booking` | before | 90 | 3356 | 136 | 2083 |
| `/demos/booking` | after | 92 | 3107 | 154 | 1855 |

Per-run deltas (after minus before) on `/`: +2, -3, +9, +7, +1. The polish costs nothing measurable; Lighthouse CI assertions passed on the polished build. Numbers on this Windows machine swing by ±10 points between runs (antivirus scanning freshly written build files was one identified cause), so CI remains the authority.

Idle-time check (CDP `Performance.getMetrics`, 4 s after load on `/`, mobile): the only continuous main-thread work is the pre-existing trust-strip marquee (about 60 style recalcs per second, roughly 1% CPU). The new ping and ring animations add zero idle cost.
