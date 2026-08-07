# Real Numbers — Website

Next.js (App Router + TypeScript) rebuild of the Real Numbers homepage, ready to develop in Claude Code and deploy on Vercel with Supabase as the backend.

## What's here

- `app/` — App Router pages, root layout, global styles, self-hosted TASA Orbiter via `next/font/local`
- `components/` — one component per homepage section (Header, Hero, Services, FinalCta, etc.)
- `lib/supabase.ts` — browser Supabase client, reads `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `public/` — fonts, logo/icon SVGs, brand photography
- `.env.example` — the two env vars the app expects (committed, no real values)
- `.env.local` — your real Supabase keys (already filled in, gitignored — never gets committed)

Build, typecheck, and a production `next build` were all verified working before handoff.

## Already provisioned

- **Supabase project**: `real-numbers-website` (org: silvermanvisual, region: us-east-1)
  - URL + anon key are already in `.env.local`
  - No tables yet — nothing is wired to persist data. The contact form in `components/FinalCta.tsx` validates client-side only; there's a commented-out `supabase.from("leads").insert(...)` line marking where to add it once you create a `leads` table.
- **Vercel**: your team (`Omer's projects`) is connected and authorized. The project itself isn't created yet — see below for why, and the two-minute step to finish it.

## Run it locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`.

## Connect GitHub (do this first, in Claude Code)

This session didn't have a GitHub connector available, so the repo is only initialized locally (`git init` + one commit, sitting in this folder). From Claude Code:

```bash
gh repo create real-numbers-website --private --source=. --remote=origin --push
```

(or create the repo manually on github.com and `git remote add origin <url> && git push -u origin main`)

**Before you do anything else:** if this folder is inside a cloud-synced directory (Google Drive, Dropbox, iCloud), move it to a normal local folder first — e.g. `~/Projects/real-numbers-website`. Continuous cloud sync fighting with `node_modules` and `.git` is a common source of file-lock errors and, occasionally, corrupted commits. Keep the synced Drive folder for design assets and docs; keep code in a plain local directory.

## Connect Vercel

Once the repo is on GitHub:

1. [vercel.com/new](https://vercel.com/new) → Import the `real-numbers-website` repo → Vercel auto-detects Next.js, no config needed.
2. Add the environment variables (from `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Deploy. Every push to `main` auto-deploys after this.

I didn't pre-create the Vercel project from this session — the direct file-upload path works for small apps, but this one's font + image assets are a couple MB, too large to push through that tool cleanly. The GitHub import above is the standard path anyway and takes about two minutes.

## Adding the contact form → Supabase

When you're ready to persist leads:

```sql
create table leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  created_at timestamptz not null default now()
);

alter table leads enable row level security;

create policy "Anyone can submit a lead"
  on leads for insert
  to anon
  with check (true);
```

Then in `components/FinalCta.tsx`, uncomment the `supabase` import and replace the `setStatus("sent")` stub with the real insert call.

## Brand reference

Colors, type, and imagery all pulled from the brand kit in the "REAL NUMBERS BRANDING" folder — black `#241E1C`, off-white `#F0EFE8`, red `#B85840`, blue `#353E5B`, TASA Orbiter throughout.
