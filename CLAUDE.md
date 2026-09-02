# Real Numbers — Website

Next.js 15 (App Router + TypeScript, React 19) marketing site for Real Numbers, an accounting/CFO firm for startups. Built and iterated in Claude (Cowork) chats; this file exists so any Claude Code session opened on this folder has the same context without re-explaining.

## Status

All 9 pages built and content-complete (Home, About, Why Real Numbers, Our Expertise, Use Cases, Questions Founders Ask, Team, Contact, plus layout/nav/footer). `npm run build` verified clean on every change so far. Repo is on GitHub (`altlands89/real-numbers-website-nextjs`), `master` branch, working tree clean as of the last session — check `git log --oneline -10` for the latest commits.

**Live site**: https://real-numbers-website-nextjs.vercel.app/ — deployed on Vercel, auto-deploys on every push to `master`. Confirmed live and rendering correctly.

Brand colors: black `#241E1C`, off-white `#F0EFE8`, red `#B85840`, blue `#353E5B`. Font: TASA Orbiter (self-hosted via `next/font/local`).

## Design system — key conventions

- **`components/CompositionDrift.tsx`** — parses an SVG's `<path>` elements via `fetch` + `DOMParser`, animates each path independently on scroll (lerp-smoothed) plus a subtle ambient sway (sin/cos per-path, seeded by a deterministic hash so it's stable across renders). Used as decorative background art (`/public/compositions/comp-*.svg`) on nearly every section — always absolutely positioned, `pointer-events: none`, low opacity (0.13–0.22), paused off-screen via `IntersectionObserver`.
- **`components/CompositionInteractive.tsx`** — same idea, but combines scroll position AND mouse position for movement. Currently used once, in `Hero.tsx`, replacing the old static hero photo with `/public/compositions/comp-5.svg`.
- **`components/Parallax.tsx`** — generic wrapper div, translates its children on the Y axis based on scroll position (lerp-smoothed, `IntersectionObserver`-gated). Used to wrap `atmosphere-photo` / `moment-visual` image blocks for a parallax feel.
- **`components/Preloader.tsx`** — full-page loading overlay shown on first paint, using the self-animating SVG at `/public/img/logo-counter-animation.svg` (rendered via plain `<img>`, not `next/image`, to preserve its embedded CSS `@keyframes`). Respects `prefers-reduced-motion`.
- **`components/ScrollReveal.tsx`** + `[data-reveal]` attribute — generic scroll-triggered fade/slide-in, toggled via `IntersectionObserver`. Headlines additionally use `className="reveal-heading"` for a smaller/delayed variant.
- **`.bg-photo`** (globals.css) — full-bleed section backgrounds using `background-attachment: fixed` for a parallax look; falls back to `scroll` below 900px and under `prefers-reduced-motion` (avoids the iOS Safari fixed-background bug).
- **`.atmosphere-photo`** — smaller in-content mood photos, usually wrapped in `<Parallax>`.
- All animation loops use `requestAnimationFrame` + lerp smoothing, and pause when their element scrolls off-screen. All respect `prefers-reduced-motion: reduce`.

## Assets

- `public/img/photography/` — 10 processed brand photos (resized/compressed from `BRAND ELEMENTS/IMAGERY/WEBSITE IMAGES/RN_IMG_001-010.jpg` in the Google Drive brand folder).
- `public/img/logos/` — real client logos (McCann, Fix, Domino's, ASUS, yes), auto-cropped to content bounds, transparent PNGs.
- `public/compositions/` — the brand's abstract line-art SVG compositions (comp-1.svg … comp-15.svg), source of truth also in `BRAND ELEMENTS/NUMBERS/COMPOSITIONS` in the Drive folder.
- `public/img/logo-counter-animation.svg` — the animated "Real Numbers" wordmark used as the page preloader.

## Content management — Payload CMS (in progress)

The client asked for full self-serve content editing (all page copy, team
roster, testimonials, FAQ, stats, logos, photos) without needing a developer.
Chosen approach: **Payload CMS 3.x, embedded directly in this Next.js app**
(not a separate service) — admin panel at `/admin`, content read via
Payload's Local API inside Server Components. Full plan/phases:
`/Users/omer/.claude/plans/cached-whistling-hopper.md`.

**Why Next 15 / React 19**: every version of Payload 3.x requires Next
`>=15.2.9` and React `^19.0.0` as peer deps — this forced upgrading the whole
site from Next 14/React 18 (confirmed with the client before doing it). Pinned
exact versions: `next@15.4.11`, `react@19`/`react-dom@19` (not caret ranges,
to stay inside Payload's narrow supported Next version windows — check
`@payloadcms/next`'s peerDependencies before ever bumping Next further).

**Phase 1 status (done, fully verified end-to-end against the real client
Supabase project)**: `payload.config.ts` at repo root (`Users` + `Media`
collections so far), `next.config.mjs` wrapped with `withPayload()`, standard
Payload/Next route group at `app/(payload)/` (`admin/[[...segments]]`,
`api/[...slug]`, `api/graphql`, `api/graphql-playground`). `/admin` loads and
"Create first user" renders correctly against the real Postgres database;
`npm run build` passes clean, all 8 marketing pages still prerender static
and pixel-identical to before.

**Important repo-structure change this required**: the marketing site's
`app/layout.tsx` (+ `fonts.ts`, `globals.css`, every page folder) had to move
into a new `app/(frontend)/` route group, sibling to `app/(payload)/`, with
**no layout.tsx left at the true `app/` root**. Reason: Payload's own
`RootLayout` (from `@payloadcms/next/layouts`) renders its own `<html>`/
`<body>`, and Next.js only supports that ("multiple root layouts") when each
top-level route group owns its layout independently — a shared root
`app/layout.tsx` above them causes real `<html>` nesting and a hydration
crash. This is Payload's documented, standard integration pattern, not a
one-off hack — if you ever see the marketing site 404 or `/admin` blank-page
with hydration errors again, check that no file reintroduced a top-level
`app/layout.tsx`. When testing `/admin` after a change, always load it in a
**fresh browser tab** — client-side (soft) navigation from a page that used
the other root layout throws a hydration error even though the actual
server-rendered HTML is correct; a full page load resolves it.

**Database reality check that changed the plan**: the `.env.local` values
inherited from before this session pointed at a Supabase project
(`pkccfppumlvdglkwhlfs`) the current account has no access to — stale/wrong.
The real, live project is **`ucmilkvivhvendtdutxn`** ("REAL NUMBERS HOME").
Fixed `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` accordingly.
That database already has a **`contact_submissions`** table (id, created_at,
name, company, email, message — 0 rows, not yet wired to the contact form)
that is unrelated to Payload — this is presumably the "leads" table
`README.md` describes, just under a different name. **Payload's schema is
managed via explicit migrations only** (`db: postgresAdapter({ push: false
})` in `payload.config.ts`) specifically so its dev-mode auto schema-push
never gets an interactive "is this an existing table renamed?" prompt near
`contact_submissions` — always run `npm run payload:migrate:create` after
schema changes, review the generated SQL in `migrations/`, then
`npm run payload:migrate` to apply. The Postgres connection uses Supabase's
**Session Pooler** (`aws-0-eu-west-2.pooler.supabase.com:5432`), not the
direct `db.<ref>.supabase.co` host — this project's direct host is IPv6-only
and won't resolve from most networks/CI.

**Local tooling gotcha (fixed)**: `npx payload generate:importmap` /
`migrate:create` initially crashed on Node 24 with `ERR_REQUIRE_ASYNC_MODULE`
(tsx/ESM interop issue with `@payloadcms/richtext-lexical`'s top-level
await). Fixed by adding `"type": "module"` to `package.json` — safe here
since there are no plain `.js`/`.cjs` config files at the repo root that
assume CommonJS. If a future dependency needs CJS `require()` semantics,
revisit this.

**Color picker on every Colors field — done, verified live**:
`payload/components/ColorPickerField.tsx` is a custom Payload field
component (native `<input type="color">` swatch + hex text input + a fixed
row of all 11 brand colors as one-click swatches, the currently-matching one
ringed) registered via `admin.components.Field` on each `hexField()` in
`DesignTokensGlobal.ts`. Payload has no built-in color-picker field type,
hence the custom component — registered in the import map via `@/` path
(matches tsconfig's alias, resolves fine through Payload's own bundler, not
just Next's). **Whenever a new custom admin component is added, run
`npx payload generate:importmap` before building** — dev mode
auto-registers components at runtime, but a production build needs the
import map already written to `app/(payload)/admin/importMap.js`, or the
component silently won't resolve. Verified live: clicked a brand swatch on
the "White" field, watched both the native color box and hex text update
instantly to the swatch's value.

**"Site Design" admin section — done, verified live**: a dedicated sidebar
group (`admin.group: "Site Design"` on each Global) holding 4 Globals —
`Colors` (was Design Tokens, now 11 colors including `white`/`clay`),
`Typography` (new, `payload/globals/TypographyGlobal.ts`), `Layout & Motion`
(new, `payload/globals/LayoutMotionGlobal.ts`), and `Logo` (was Branding).
Typography exposes 6 shared text styles (H1/H2/H3/Eyebrow/Lede/Body) —
**deliberately shared styles, not per-field overrides**: the client initially
asked for per-field typography controls, but that would mean hundreds of
extra controls across every heading/paragraph and would let the site drift
visually inconsistent field-by-field; talked through it and agreed on a
smaller set of reusable roles instead, matching how the CSS itself already
works (every heading already runs through shared `h1`/`h2`/`h3`/`.eyebrow`/
`.lede` rules). Each style has: `sizeScale` (a "1–5" select, not a literal
slider — Payload has no native range-slider field, and a labeled 5-step
select reads just as clearly in the admin) mapped to a multiplier
(`SIZE_SCALE_MULTIPLIER` in `app/(frontend)/layout.tsx`) applied on TOP of
the existing responsive `clamp()` sizing, so text stays fluid on mobile at
every step; plus line-height, letter-spacing, and a weight dropdown (400–800,
matching TASA Orbiter's actual shipped weights). Layout & Motion has 4
site-wide multiplier controls: container width (the `--max` var already used
for the earlier 80%→92% requests), corner roundness (scales
`--radius-control`/`--radius-card` only — `--radius-pill` is deliberately
excluded, fully-round buttons are a fixed brand shape, not something
"roundness" should flatten), spacing density (scales the entire
`--space-100`...`--space-1000` scale plus `--section-y` together), and
animation speed (scales `--fast`/`--standard`/`--editorial` together). All
of `globals.css`'s actual typography/radius/spacing/motion rules were
rewritten to read these CSS custom properties via `calc()`, with fallback
values matching today's design exactly — confirmed via a full visual
diff (pixel-identical at every default) before touching anything live.
Verified 3 separate live edits via the real REST API against local `next
dev`: H1 sizeScale → 5 (confirmed `--type-h1-scale` computed to 1.35 in the
browser), cornerRoundness → 0 (confirmed cards go sharp-cornered while
buttons stay pill-shaped), then reverted both.

**Multi-photo fading slideshows — done, verified live**: the 5 "mood/
atmosphere" photo spots (About's Our Story, Why Real Numbers' What Makes
Different, Our Expertise's Integrated Partnership, Use Cases' and Q&A's
background photo) went from a single `upload` field to an `array` of
`{ image: upload }` — upload one photo for a static image exactly as before,
or several and the page auto-plays a crossfading loop between them
(`components/PhotoSlideshow.tsx`, already used by the Home hero, now reused
here via a new shared `components/AtmospherePhoto.tsx` wrapper).
`components/AbstractPanel.tsx` (used for Why Real Numbers' version of this
spot) got the same multi-image support directly, backward-compatible with
its other ~14 single-image call sites elsewhere on the site (still just pass
a string). Team member photos and client logos were deliberately left as
single images — client confirmed that scope explicitly (a slideshow doesn't
make sense for one person's headshot or one company's logo).

**Admin session length**: `payload/collections/Users.ts` sets
`auth.tokenExpiration` to 30 days (Payload's default is 2 hours) — the
client hit repeated forced re-logins during this session's testing, partly
real 2-hour expiry over a long session and partly this session's own
browser-tab cleanup wiping cookies. The tokenExpiration fix is real and
permanent; the tab-cleanup cause was a one-off mistake, not a recurring
issue.

**Vercel Blob — done, fully verified end-to-end**: created a Public Blob
store (`real-numbers-design-v2-blob`) on the `real-numbers-design-v2` Vercel
project (the one `design-v2` deploys to) via the dashboard. Connecting it
auto-added `BLOB_READ_WRITE_TOKEN` / `BLOB_STORE_ID` /
`BLOB_WEBHOOK_PUBLIC_KEY` to that project's Production+Preview env vars —
**note these are Vercel "sensitive" env vars, which cannot be read back
through the dashboard OR `vercel env pull` once created**; the only way to
get the plaintext value locally is the store's own "Quickstart → .env.local →
Show secret" panel at creation/rotation time. Copied it into local
`.env.local`. **The Vercel CLI is now installed globally and linked to this
project** (`vercel link` → `altlands/real-numbers-design-v2`) under the
account authenticated during this session — useful for `vercel env ls`/
future lookups, though sensitive vars still won't come through `env pull`.

**Media URLs — `disablePayloadAccessControl` must be per-collection, not
top-level**: `vercelBlobStorage({ collections: { media: { ... } } })` — the
plugin silently ignores a top-level `disablePayloadAccessControl` option (it
only reads it per-collection). Without this, uploaded files' `url` field
points at Payload's own `/api/media/file/...` proxy route instead of the
Blob CDN directly — still functionally correct (Payload streams the file
through from Blob) but an unnecessary hop. Fixed and verified: media URLs
now read `https://<store>.public.blob.vercel-storage.com/<filename>`
directly, confirmed both via a direct Postgres query and by loading actual
photos on the live pages.

**Everything needed for local dev now actually works, verified live**:
Postgres connection, migrations, `/admin` login, and Blob image uploads all
confirmed end-to-end against the real Supabase + Vercel infrastructure. Only
remaining setup step before a **production** deploy of this branch: add
`PAYLOAD_SECRET` / `DATABASE_URI` / (Blob vars are already there) to Vercel's
env vars if they aren't already carried over — check
`vercel env ls production` next session rather than assuming.

**Phases 2–4 — done, fully verified live (2026-09-02 session)**:
- **Phase 2**: 4 content collections (`payload/collections/`: `TeamMembers`,
  `Testimonials`, `FAQItems`, `ClientLogos`) + 10 Globals (`payload/globals/`:
  `Branding`, `Stats`, and one per real page) registered in
  `payload.config.ts`. Schema applied via 2 migrations in `migrations/`.
- **Phase 3**: `payload/seed.ts` — idempotent, uploads every real photo from
  `public/img/...` into Media and populates every collection/global with
  today's actual site copy (not placeholder text). `payload/reset-seed.ts` is
  a companion one-off to wipe seeded content for a clean re-seed (used once
  this session after a plugin-config fix required redoing media URLs — see
  below). Re-run seeding any time with `npm run payload:seed`.
- **Phase 4**: every `app/(frontend)/**/page.tsx` and content component
  (`HeroV2`, `DifferenceV2`, `StatsV2`, `CtaDarkV2`, `AudienceV2`, `Faq`,
  `ContactForm`) now fetches from Payload's Local API (`lib/payload.ts`'s
  `getCMS()`) instead of hardcoded consts. `HeaderV2`/`Stories` were each
  split into a thin async Server wrapper (fetches data) + a `*Client.tsx`
  file (keeps the original `"use client"` interactivity, now driven by
  props) — `FooterV2` didn't need this split since it was already a Server
  Component. **Revalidation**: every collection/global has an `afterChange`/
  `afterDelete` hook (`payload/revalidate.ts`) that calls `revalidatePath` on
  all 8 page routes — confirmed live via `next start` (production mode) that
  an admin edit shows up on the actual page with zero redeploy. Decorative/
  structural assets (composition SVGs, digit badges, service-area icon
  choice, AbstractPanel filler images between sections) intentionally stayed
  hardcoded, matched to CMS array items by index — only genuinely
  photographic/textual content is CMS-driven, per the "content and assets"
  scope agreed with the client, not a generic page-builder.

**Admin field labels — done, verified live (same session)**: every field
across all collections/globals now has an explicit human-readable `label`
(client caught "Eyebrow" and correctly found it meaningless jargon — same
issue existed for "Lede", "Cta", auto-derived camelCase labels, etc). Two
gotchas worth remembering if new fields get added later: (1) a plain
`label:` on an array field only relabels the array's own header — the
**collapsed row title** for each item (e.g. "Lede Paragraph 01") is driven
separately by `labels: { singular, plural }` on that same array field, which
also had to be set on every array. (2) Renaming `label`/`labels` is
UI-only metadata, no DB column changes — confirmed via `payload
migrate:create`, which correctly reported "No schema changes detected."

**Design Tokens global — done, verified live (same session)**: a
`design-tokens` Global (`payload/globals/DesignTokensGlobal.ts`) exposes the
9 core brand colors (`--black`, `--offwhite`, `--red`, `--red-dark`, `--blue`,
`--blue-dark`, `--stone`, `--horizon`, `--jet`) as hex-validated text fields.
`app/(frontend)/layout.tsx` (now async) fetches this global and injects a
`:root{...}` `<style>` block with `!important` overrides ahead of
`globals.css`'s own definitions — `!important` specifically because Next's
own head-tag ordering isn't something we control, so relying on plain
cascade order would be fragile. Verified live: flipped `--red` to a
throwaway color via the REST API, confirmed the "Let's Talk" button changed
on the actual rendered page with zero redeploy, then reverted. This is a
deliberately *narrow* "design system" control (global brand colors only) —
NOT a page builder; spacing/typography/layout stay in code. See the
2026-09-02 conversation for the fuller Puck.js (open-source React
drag-and-drop) evaluation if real Elementor-style visual editing is revisited
later — it would need each section turned into a swappable block, a real
re-architecture, not attempted this session.

**Admin UX pass — done, verified live (2026-09-02 session)**: four
improvements the client asked for after trying `/admin` for the first time
(also: `auth.tokenExpiration` bumped to 30 days, multi-photo slideshows on
the 5 atmosphere-photo spots, the whole "Site Design" section, and the
brand-swatch `ColorPickerField` — all from the same round of feedback, see
above).
- **"Pages" grouping + tabs**: all 8 content Globals now carry
  `admin.group: "Pages"` so they cluster under one sidebar heading (mirrors
  the existing "Site Design" group). Each Global's top-level section groups
  (Top Banner, Our Story, etc.) are wrapped in an **unnamed** `type: "tabs"`
  field — unnamed tabs are purely an admin-UI grouping and add no nesting to
  the underlying data, so this needed zero migration and moved zero existing
  data. `HomeGlobal.ts` (7 tabs) and `AboutGlobal.ts` (5 tabs) got the most
  benefit; `QuestionsFoundersAskGlobal.ts` was left flat (only 2 fields, not
  "long"). Verified live: every tab renders the correct pre-existing seeded
  content with no data loss.
- **Admin branding**: `payload/components/RNLogo.tsx` /
  `RNIcon.tsx` replace the generic Payload login logo and nav icon with the
  real wordmark (`/public/img/logo-black.svg`) and compact symbol mark
  (`/public/img/symbol-red.svg`), registered via `admin.components.graphics`.
  `admin.meta` sets the page title (`Real Numbers Admin · Real Numbers`) and
  favicon. `payload/components/AdminBrandStyles.tsx` overrides Payload's
  entire 19-step "success" color scale (`--theme-success-*` — drives the save
  button accent, active nav state, links, and toasts) with a ramp built from
  the brand red `#b85840`, both light and dark mode. **Gotcha**: this style
  component has to be registered in **both** `admin.components.header` (the
  authenticated app shell) **and** `admin.components.beforeLogin` (the public
  login screen) — the header slot alone doesn't render on `/admin/login`, so
  the override silently didn't apply there until added to both. Verified via
  `getComputedStyle(document.documentElement).getPropertyValue('--theme-success-500')`
  on the actual login page.
- **Live Preview**: `admin.livePreview` configured with Mobile/Tablet/Desktop
  breakpoints and a `url` function mapping each Global's slug to its real
  route (`payload.config.ts`'s `PAGE_ROUTE_BY_GLOBAL_SLUG`). New
  `components/LivePreviewListener.tsx` (mounted in
  `app/(frontend)/layout.tsx`) uses `RefreshRouteOnSave` from the newly added
  `@payloadcms/live-preview-react` package to refresh the iframe the instant
  an editor hits Save. **Honest scope note, given to the client too**: these
  pages are Server Components reading straight from Postgres, not client
  components merging unsaved form state — so this is "refreshes right after
  Save," not true keystroke-by-keystroke live merge. That would need
  converting each page to fetch client-side via `useLivePreview()`, a real
  architecture change, not attempted here. New env var
  `NEXT_PUBLIC_SITE_URL` (falls back to `VERCEL_URL`, then localhost) added
  to `.env.local`/`.env.example` and to Vercel (production + preview).
  Verified live: opened Live Preview on the Home global, confirmed all 3
  custom breakpoints appear and the iframe renders the actual live homepage.

**Deploy status (updated 2026-09-02)**: `design-v2` is live in production on
the `real-numbers-design-v2` Vercel project — https://real-numbers-design-v2.vercel.app
— confirmed via `vercel ls`/`curl` after every push this session. All env
vars (`PAYLOAD_SECRET`, `DATABASE_URI`, Blob vars, `NEXT_PUBLIC_SITE_URL`)
are set for both Production and Preview. **Still open**: the client still
needs a walkthrough of `/admin` before full handoff — this session verified
everything works technically, but the client hasn't had a guided tour of the
finished CMS yet.

**Visual design editor for admin (native `blocks` + sliders) — done, verified
live (2026-09-02 session, continued)**: follow-up to the CMS integration
above, for the user's own admin use (not the client) — full plan at
`/Users/omer/.claude/plans/cached-whistling-hopper.md`. Researched two
third-party Payload visual-builder packages first and rejected both:
`payload-visual-editor` (pemedia, last updated before Payload 3 existed) and
`@orion-studios/payload-visual-builder` (v0.1.4, single maintainer, no
linked repo — unreviewable). Went with Payload's own native `blocks` field
instead: zero third-party dependency, built-in drag-to-reorder.
- **Part 1 — slider UI**: `payload/components/SliderField.tsx` (new) swaps
  the Field component only on the existing `sizeScale` selects (Typography,
  6 fields) and the 4 Layout & Motion multiplier fields — renders a native
  `<input type="range">` snapping between the field's own existing `options`
  values, plus a live label readout. **No schema change, no migration** —
  same pattern as the earlier `ColorPickerField`. Needed a manual
  `npx payload generate:importmap` run before the component would resolve
  (didn't auto-register from a dev-server request this time, unlike some
  earlier components).
- **Part 2 — Home page sections as native blocks**: `HomeGlobal.ts`'s fixed
  flat-field tabs (hero, featuredPhoto, logosStrip, difference, ctaDark,
  audience, stories) became one `sections` field of `type: "blocks"`
  (`payload/blocks/HomeBlocks.ts`), giving real drag-to-reorder in
  `/admin` with no extra code — Payload's `blocks` field ships this by
  default (`admin.isSortable`). **Design correction made before finishing
  the implementation**: originally modeled Hero, FeaturedPhoto, and
  LogosStrip as 3 separate block types (matching the old 3 tabs), but
  caught that `HeroV2` renders all three as one inseparable visual unit —
  3 separately-draggable-but-visually-inert blocks would have been
  misleading, so merged them into one `HeroBlock` with nested `group`
  fields before implementing further. Final 7 blocks, short slugs on
  purpose (`hero`, `diff`, `stats`, `divider`, `cta`, `audience`,
  `stories`) to leave headroom under Postgres's 63-char identifier limit
  once per-block tables are added on top of `home`'s already-long
  versioned-drafts schema. `app/(frontend)/page.tsx` now iterates
  `home.sections` and renders the matching existing component per
  `section.blockType` via a `switch` — every component (`HeroV2`,
  `DifferenceV2`, `StatsV2`, `AbstractPanel`, `CtaDarkV2`, `AudienceV2`,
  `Stories`) is reused as-is, only the ordering/selection logic is new.
  `components/Stories.tsx` now finds its content by scanning
  `home.sections` for `blockType === "stories"` instead of a fixed
  `home.stories` field.
- **CRITICAL migration-safety lesson**: `npx payload migrate:create`'s
  auto-generated migration, when the config diff spans both new blocks AND
  removed old flat fields in one edit, bundles ALL the new `CREATE TABLE`
  statements and ALL the `DROP TABLE`/`DROP COLUMN` statements for the old
  fields into one single `up()` — applying that as generated would have
  destroyed the live Home content immediately, with no chance to copy it
  over first. Fixed by manually splitting into two separate, sequentially
  applied migrations: `20260902_115832_add_home_sections_blocks.ts`
  (additive-only — every new `CREATE TABLE`/constraint/index, nothing
  dropped) applied first, then a **hand-written data-migration script**
  (`payload/migrate-home-to-blocks.ts`, one-off, run via `tsx`) that reads
  the old flat fields via raw `pg` SQL (Payload's Local API no longer
  surfaces columns removed from the config, even though they still exist
  in the DB) and writes the equivalent `sections` array back via
  `payload.updateGlobal()` — verified via direct SQL query that every
  section matched the source exactly before doing anything destructive.
  Only after that was confirmed did a second migration,
  `20260902_150500_remove_home_old_section_fields.ts`, drop the
  now-unused old tables/columns — this is the pattern to repeat if any
  other page ever gets the same blocks treatment: **additive migration →
  verified data-copy script → destructive migration, three separate
  reviewed steps, never one auto-generated migration that does both.**
  `payload/migrate-home-to-blocks.ts` was kept in the repo as historical
  documentation of the migration, same as `payload/reset-seed.ts`.
- **Verification**: admin blocks UI end-to-end tested with a real
  `left_click_drag` (dragged a row to reorder, confirmed the visual swap,
  dragged back, confirmed via direct SQL that nothing persisted since
  Save/Publish was never clicked — Payload's blocks reordering is
  local-only until an explicit save). Live homepage confirmed rendering
  identically (screenshot + full page-text check) both immediately after
  the data-migration script ran and again after the destructive migration
  was applied. Full `npm run build` clean both times.
- **Scope note, unchanged from the plan**: the other 7 pages were NOT
  converted to blocks — Home was a deliberate pilot. A free-form
  Webflow-style drag canvas also stays explicitly deferred (two concrete
  third-party candidates were evaluated and rejected as unsafe, see above)
  — native `blocks` covers reordering, which was the actual ask.

**Video upload bug — fixed, verified live (2026-09-02 session)**: the client
reported "can't upload video" for the home hero's background video. Root
cause: `vercelBlobStorage()` in `payload.config.ts` didn't have
`clientUploads: true`, so every upload was proxied through our own Next API
route — which Vercel serverless functions cap at 4.5MB. Any real video
blew past that silently. Fix is one line (`clientUploads: true`), which
routes the upload straight from the browser to Vercel Blob instead. Verified
against the real dev database mid-session: while investigating, found the
client's own actual stuck upload attempt (`RN-HERO-BACK-VID_1_1.mp4`) sitting
in Payload's local unsaved-draft cache in the browser — cleared it (nothing
was ever saved, safe to discard) and, moments after the fix deployed, the
client's own retry succeeded for real: a 14MB video, confirmed both via the
Payload API and a direct `curl` against the resulting Blob URL.

**Admin safety net — Drafts + Trash, done, verified live (2026-09-02
session)**: researched CMS UX best practices for non-technical clients and
proposed 4 improvements; client picked the safety net as highest priority.
- All 8 page Globals now have `versions: { drafts: true }`. Editing a page
  saves a **Draft** first — the live site keeps serving the last
  **Published** version until an editor explicitly clicks "Publish changes".
  Every past published version is kept and browsable/revertible via the
  Global's new "Versions" tab. `payload/revalidate.ts`'s
  `revalidateGlobalOnChange` now checks `doc._status` and skips
  `revalidatePath` on a pure draft save (nothing on the live site actually
  changed) — only fires on an actual publish.
- 5 collections (`Media`, `TeamMembers`, `Testimonials`, `FAQItems`,
  `ClientLogos`) now have `trash: true`. Deleting sends a document to a
  dedicated **Trash** view (with a restore option) instead of removing it
  immediately — Payload's own `deletedAt`-based soft-delete, confirmed live
  (a "Trash" tab now appears next to "All FAQ Items" etc.). `Users` was
  deliberately left without trash (account deletion should stay a real,
  deliberate action).
- **Migration story worth remembering**: enabling drafts generates a
  parallel `_v`-suffixed versions table per Global, including one per nested
  array field — and `why-real-numbers-page`'s `whatMakesDifferent.paragraphs`
  /`.photos` array table names were long enough that the versions-table
  variant exceeded Postgres's **63-character identifier limit**. Fixed by
  giving those 2 array fields short explicit `dbName`s
  (`why_rn_wmd_paragraphs`/`why_rn_wmd_photos`) in
  `WhyRealNumbersGlobal.ts`. Renaming a field's `dbName` renames the **live**
  table too (it's the same field definition backing both), which put
  `payload migrate:create` into its interactive "is this table created or
  renamed from another table?" prompt — a real hazard here, since a wrong
  answer either drops a live-data table (treating a genuine rename as
  "create new") or fails outright (treating an already-renamed table as
  "still needs renaming"). This machine's tooling can't reliably drive that
  kind of arrow-key TUI prompt, so the whole change was split into 3
  migrations applied in this order specifically to keep every step
  unambiguous: **(1)** `20260902_071500_rename_wmd_arrays` — hand-written
  pure `ALTER TABLE ... RENAME TO ...` SQL (no interactive tool involved),
  applied first, verified via direct `pg` query that both tables still held
  their original row counts after the rename; **(2)**
  `20260902_081439_add_trash_support` — plain additive `ADD COLUMN`s, no
  ambiguity, safe to auto-generate; **(3)** `20260902_081519_add_drafts` —
  now unambiguous too, since no old-named table existed anymore to confuse
  the diff. **Necessary extra step**: migration `(1)` being hand-written
  meant it had no accompanying schema-snapshot `.json` (Payload's
  `migrate:create` diffs against the latest snapshot file, not the live DB,
  to decide what changed) — without one, step `(2)`'s `migrate:create` hit
  the exact same interactive rename prompt again, for a rename that had
  already actually happened. Fixed by hand-generating a correct
  `20260902_071500_rename_wmd_arrays.json` snapshot (Python script: copy the
  prior snapshot, rename the 2 table keys, update their internal `name` and
  foreign-key `tableFrom` fields, bump `id`/`prevId`) — after that, steps
  `(2)` and `(3)` generated cleanly via the normal interactive tool with no
  prompts at all. **One more real gotcha, caught and fixed**: Payload's own
  drafts migration backfills every pre-existing Global row's new `_status`
  column to `'draft'`, not `'published'` — even though that content was
  already genuinely live before this change. Confirmed the live site itself
  was unaffected (a plain `findGlobal` without `draft: true` reads the main
  table directly regardless of `_status`, so nothing was ever hidden from
  visitors), but the admin UI would have shown a misleading "Draft" badge on
  pages that are actually published. Corrected with one direct SQL
  `UPDATE ... SET _status = 'published'` across all 8 tables right after
  applying, so `/admin` now accurately shows "Status: Published" on
  everything that's actually live.

**Admin dashboard — friendly welcome panel, done, verified live (2026-09-02
session)**: `payload/components/AdminDashboardWelcome.tsx`, registered via
`admin.components.beforeDashboard` (additive — renders above Payload's own
collections/globals grid, doesn't replace it). Greets the logged-in editor
by the local part of their email, a red "View Live Site ↗" button
(`lib/site-url.ts`'s `getSiteUrl()`), and a one-click link grid to all 8
content pages' `/admin/globals/:slug` edit views. Verified live: clicking a
page card navigates correctly, greeting reflects the real logged-in user.

**Video background on the Home divider — done, verified live (2026-09-02
session)**: the decorative `AbstractPanel` strip between the homepage stats
section and the dark CTA (`app/(frontend)/page.tsx`, `wide-14.jpg`) can now
show a looping background video instead, uploaded from a new "Video
Background Section" tab on the Home global — falls back to the static image
when empty. `components/AbstractPanel.tsx` gained an optional `video` prop;
when set it renders `<video autoPlay muted loop playsInline>` instead of
`next/image`, genuinely `position: fixed` to the real viewport (not a
"fake fixed" via a transformed ancestor — that would make it behave like
`position: absolute` instead, since a transformed ancestor becomes the
containing block for fixed descendants; this was a real bug caught and
fixed during this session). `.abstract-panel`'s own `overflow: hidden`
clips the fixed video down to a "window" revealed as the panel scrolls
past, matching the pinned-background feel the client asked for. Falls back
to `position: absolute` under `max-width: 900px` and
`prefers-reduced-motion: reduce`, mirroring the site's existing
`.bg-photo`/`.v2-bg-cover` fixed-background sections. **Verification
gotcha worth remembering**: this session's browser-automation screenshot
tool cannot capture large/full-viewport `<video>` elements at all (confirmed
via a controlled test — a 300×200px fixed video screenshots fine, a
900×600px one doesn't, regardless of DOM structure, z-index, or ancestor
styles) — correctness was instead confirmed via computed styles
(`position`, `object-fit`, `src`), `elementFromPoint` hit-testing, and
`video.currentTime` actually progressing. If this section ever needs
visual QA again, don't rely on a full-page screenshot — check computed
styles/playback state directly, or view it in a real browser.

**Admin panel brand texture — done, verified live (2026-09-02 session)**:
brought the live site's own visual language into `/admin`'s entry/landing
surfaces, deliberately leaving collection tables and edit forms plain —
visual noise there would work against the safety-net/friendliness work
from earlier in this session, not for it.
- `payload/components/AdminLoginBackground.tsx` (new, `beforeLogin`-only)
  and an addition to `AdminDashboardWelcome.tsx`'s card both render the same
  `comp-16.svg` abstract composition the live site already uses as a
  low-opacity texture (`.v2-bg-cover--comp` in `globals.css`) — ties the
  admin to the same brand system instead of a bare gray/white UI.
- `AdminBrandStyles.tsx` gained CSS that puts the brand symbol mark before
  the "Pages" (red, `symbol-red.svg`) and "Site Design" (blue,
  `symbol-blue.svg`) nav-group labels. **Useful discovery**: Payload adds
  the `admin.group` string itself as a literal CSS class on the `.nav-group`
  wrapper (e.g. `class="nav-group Pages"`), confirmed via DOM inspection —
  a stable, structural selector to hook into, not a guess. A two-word group
  name becomes two separate classes (`Site` and `Design`), so the selector
  needs `.nav-group.Site.Design` (both required), not a single
  `.nav-group["Site Design"]`-style match.

**Recurring gotcha, hit again this session**: repeated `next dev`
restarts (many across this session's iterative testing) left ~14 stuck
idle Postgres connections against Supabase's Session Pooler (15-connection
cap), to the point `/admin` itself started failing with `EMAXCONNSESSION`.
Same root cause and same fix documented earlier in this file (pool
exhaustion, not a code bug) — cleared via
`select pg_terminate_backend(pid) from pg_stat_activity where usename='postgres' and application_name='Supavisor' and state='idle' and pid <> pg_backend_pid();`,
with explicit user go-ahead first. Plain `pkill -f "next dev"` (SIGTERM)
doesn't always let Node's `pg` pool drain cleanly before exit — if this
keeps recurring across a long session of frequent dev-server restarts,
worth switching the local dev workflow to a single long-lived `next dev`
process instead of repeated kill+restart cycles.

**Brand icon set in nav + dashboard — done, verified live (2026-09-02
session)**: `public/icons/brand/RN_ICON_BLUE_1.svg`…`_48.svg` — the full
48-icon brand set, pulled from the Drive brand folder
(`BRAND ELEMENTS/ICONS/BLUE/SVG/`). 19 of them are assigned one-per-item
to every sidebar collection/global (`AdminBrandStyles.tsx`'s `NAV_ICONS`
map, keyed by href — e.g. key for Users, handshake for Team Members, star
for Testimonials, briefcase for Our Expertise) and to the dashboard's page
quick-link cards (`AdminDashboardWelcome.tsx`, same numbers, so the two
surfaces stay visually consistent). No icon reused across items. **Tooling
gotcha worth remembering**: batch-generating preview thumbnails via macOS's
`qlmanage -t` on many SVGs at once produced silently wrong/colliding
thumbnails for some files (icons 41–48 all rendered as duplicates of
33–40, confirmed by `md5` that the actual source SVGs were genuinely
different) — don't trust a `qlmanage` batch run for visual icon review;
render them for real through the browser (an `<img src="...">` page
served by the dev server) instead.

- The canonical brand asset folder (fonts, full-res photography, PDFs, brand colors) lives outside this repo, in Google Drive: `REAL NUMBERS BRANDING/BRAND ELEMENTS`. Pull from there if new assets are needed; don't expect them to already be in `public/`.
- No screenshot/browser-preview tooling is available from a sandboxed environment — verification has relied on `npm run build` passing cleanly plus manual review of the diff. If Claude Code has real screenshot/browser access, use it to visually QA before/after changes — that's a real upgrade over how this was built so far.
- Contact form (`components/FinalCta.tsx` and `ContactForm.tsx`) is client-side only; Supabase is scaffolded (`lib/supabase.ts`, keys in `.env.local`) but no `leads` table exists yet — see `README.md` for the exact SQL to add it.
