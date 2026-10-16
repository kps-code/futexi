# Student Projects page — plan

Status: plan only, nothing built. Date: 2026-10-13.
Goal: a second "sales machine" for final-year college students (BE / BTech / MCA / BSc CS) in Tamil Nadu, without mixing it into the business portfolio.

## 1. Where it lives

| Stage | URL | Notes |
|---|---|---|
| Now | `futexi.vercel.app/students` | Own layout (own header, footer, colours), not in the main site menu. One small "For students" link in the main footer. |
| After the domain | `projects.kaposafutexi.com` | Same code, same deploy. A host rule in `src/proxy.ts` serves the `(students)` route group on that subdomain. No second project, no second database. |

Why not the main site: a business owner paying ₹25,000 for a website should not see "₹2,999 college projects" next to it. Separate URL, separate audience, same team.

## 2. Positioning (important)

"Built with you, explained to you." Every package includes a live explanation session and viva questions. The student must understand the code; we are mentors who build alongside, not a copy shop. Many colleges forbid fully outsourced projects, so the wording on the page and in WhatsApp must stay on the mentoring side.

## 3. Page sections (top to bottom)

1. **Hero**: "Your final-year project, built with you in 2 weeks." Sub: web, mobile and AI projects with report, PPT and a one-to-one explanation. Buttons: "See project ideas", "WhatsApp us".
2. **Trust line**: real engineers (3 years industry), modern stacks, plagiarism-free, on time.
3. **Project ideas catalog**: 15 ideas in 4 tracks (see §4). Each card: title, stack, difficulty, what you get. Filter chips by track.
4. **Packages**: 3 packages + custom (see §5).
5. **What you get**: source code (GitHub), report (abstract, SRS, UML, screenshots), PPT, demo video, 1-hour explanation call, viva Q&A sheet, one round of changes.
6. **How it works**: pick an idea → WhatsApp → 50% advance → build (7 to 14 days) → explanation session → final delivery after balance.
7. **FAQ** (6): own idea? plagiarism? will I understand it? timeline? payment? team project?
8. **Lead form**: name, college, department, year, project track, idea title or "help me choose", deadline month, WhatsApp number. Saves to the admin and sends the lead email.
9. **Final CTA**: WhatsApp button with a prefilled student message.

## 4. Idea catalog (matches the team's skills; no hardware, IoT or blockchain)

| Track | Ideas | Stack |
|---|---|---|
| Web apps | Hostel / PG management, Online exam portal, Event ticketing, College placement portal, Blood donor finder | Next.js or React + Django/Flask, PostgreSQL |
| Mobile apps | Campus bus tracker, Attendance app with QR, Canteen pre-order app | React Native + Django REST |
| AI projects | Chatbot for a college website (LLM), Document Q&A with RAG (syllabus / notes), Resume screener, Mock interview coach, Fake review detector | Python, OpenAI/Gemini API, LangChain, pgvector |
| Automation / tools | WhatsApp notification bot for a shop, Invoice generator, Internship tracker | Python, n8n-style flows, Flask |

Each idea in `src/content/students.ts`: id, title, track, stack[], difficulty (mini / main), summary, modules[], deliverables. Content stays in code at first; move to the admin only if ideas change often.

## 5. Packages (prices are placeholders; the user decides)

| Package | Price | Includes |
|---|---|---|
| Mini project | ₹2,999 | Small web app, source, short report, 30-min explanation |
| Main project | ₹5,999 | Full web or mobile app, report, PPT, demo video, 1-hour explanation, viva sheet |
| AI project | ₹8,999 | Main project + LLM / RAG feature, API setup guide |
| Custom | quote | Own idea, bigger scope, team of 2 to 4 students |

Chennai market range is roughly ₹2,000 to ₹12,000; these sit in the middle with better delivery.

## 6. Code changes

| Area | Change |
|---|---|
| Routes | `src/app/(students)/students/page.tsx` + own `layout.tsx` (header, footer, theme). Later `proxy.ts` host rewrite for the subdomain. |
| Content | `src/content/students.ts` (hero, ideas, packages, FAQ, WhatsApp message). |
| Lead capture | New collection `student-leads` (name, college, department, year, track, ideaTitle, deadline, whatsapp, email, status, notes, source group like Leads). New permission area `studentLeads` (Sales group). Server action with zod + rate limit, email via Resend, same as the contact form. One migration. |
| Admin | Sidebar: Sales → Student Leads. Editor role gets edit. Dashboard counts include it. |
| Analytics | Page views already tracked; add funnel events `student_idea_click`, `student_lead_submit`. |
| SEO | Title "Final Year Projects in Chennai: Web, App and AI, built with you". Own description, own share image (1200 x 630), sitemap entry, `Service` JSON-LD. |
| Tests | Unit for content shape, e2e for lead form + admin list, Lighthouse page added to CI. |

Not touched: main site pages, Leads collection, demos.

## 7. Order of work

| Step | What | Who | Effort |
|---|---|---|---|
| 1 | Content lock: `docs/students-content.md` with every text, 15 ideas, prices, FAQ | Claude drafts, user approves | 1 session |
| 2 | Page + content + layout | Claude | half day |
| 3 | Lead collection, form, email, admin, migration | Claude | half day |
| 4 | SEO, share image, tests, Lighthouse | Claude | 2 to 3 hours |
| 5 | Push, deploy, user test, Instagram post | user | 1 hour |
| 6 | After domain: subdomain rule + Vercel domain `projects.kaposafutexi.com` | Claude + user | 1 hour |

## 8. Decisions needed from the user before step 1

1. Page name: "Student Projects" or "Final Year Projects"?
2. Prices for the three packages (or keep the placeholders).
3. Same WhatsApp number as the agency, or a separate one?
4. Advance: 50% or 30%?
5. Delivery promise: 7 to 14 days OK in the busy season (January to April)?
6. Any ideas to add or remove from §4.

## 9. Marketing after launch (user side)

Instagram reels per idea, college WhatsApp groups via friends, a "₹500 referral" line for seniors, Google Business Profile category "Software company" already covers it. Season peaks: January to April (main projects), August to October (mini projects).
