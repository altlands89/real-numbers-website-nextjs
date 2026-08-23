# Real Numbers — Website

Next.js 14 (App Router + TypeScript) marketing site for Real Numbers, an accounting/CFO firm for startups. Built and iterated in Claude (Cowork) chats; this file exists so any Claude Code session opened on this folder has the same context without re-explaining.

## Status

All 9 pages built and content-complete (Home, About, Why Real Numbers, Our Expertise, Use Cases, Questions Founders Ask, Team, Contact, plus layout/nav/footer). `npm run build` verified clean on every change so far. Repo is on GitHub, `master` branch, working tree clean as of the last session — check `git log --oneline -10` for the latest commits.

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

## Working notes

- The canonical brand asset folder (fonts, full-res photography, PDFs, brand colors) lives outside this repo, in Google Drive: `REAL NUMBERS BRANDING/BRAND ELEMENTS`. Pull from there if new assets are needed; don't expect them to already be in `public/`.
- No screenshot/browser-preview tooling is available from a sandboxed environment — verification has relied on `npm run build` passing cleanly plus manual review of the diff. If Claude Code has real screenshot/browser access, use it to visually QA before/after changes — that's a real upgrade over how this was built so far.
- Contact form (`components/FinalCta.tsx` and `ContactForm.tsx`) is client-side only; Supabase is scaffolded (`lib/supabase.ts`, keys in `.env.local`) but no `leads` table exists yet — see `README.md` for the exact SQL to add it.
