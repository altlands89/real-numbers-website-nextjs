import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import { buildConfig } from "payload";
import sharp from "sharp";

import { Users } from "./payload/collections/Users";
import { Media } from "./payload/collections/Media";
import { TeamMembers } from "./payload/collections/TeamMembers";
import { Testimonials } from "./payload/collections/Testimonials";
import { FAQItems } from "./payload/collections/FAQItems";
import { ClientLogos } from "./payload/collections/ClientLogos";

import { HomeGlobal } from "./payload/globals/HomeGlobal";
import { AboutGlobal } from "./payload/globals/AboutGlobal";
import { TeamPageGlobal } from "./payload/globals/TeamPageGlobal";
import { ContactGlobal } from "./payload/globals/ContactGlobal";
import { WhyRealNumbersGlobal } from "./payload/globals/WhyRealNumbersGlobal";
import { OurExpertiseGlobal } from "./payload/globals/OurExpertiseGlobal";
import { UseCasesGlobal } from "./payload/globals/UseCasesGlobal";
import { QuestionsFoundersAskGlobal } from "./payload/globals/QuestionsFoundersAskGlobal";
import { StatsGlobal } from "./payload/globals/StatsGlobal";
import { BrandingGlobal } from "./payload/globals/BrandingGlobal";
import { DesignTokensGlobal } from "./payload/globals/DesignTokensGlobal";

export default buildConfig({
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media, TeamMembers, Testimonials, FAQItems, ClientLogos],
  globals: [
    BrandingGlobal,
    DesignTokensGlobal,
    StatsGlobal,
    HomeGlobal,
    AboutGlobal,
    TeamPageGlobal,
    ContactGlobal,
    WhyRealNumbersGlobal,
    OurExpertiseGlobal,
    UseCasesGlobal,
    QuestionsFoundersAskGlobal,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: "payload/payload-types.ts",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      // The DATABASE_URI points at Supabase's Session Pooler, which caps
      // total concurrent connections at 15. On Vercel each serverless
      // function instance opens its own pool (node-postgres defaults to
      // max: 10 per pool) — a couple of concurrent instances alone can
      // exhaust the pooler, after which background page regeneration
      // fails to connect and Next.js silently keeps serving the stale
      // cached page instead of the new content (looks like "edits aren't
      // saving" when they actually are — the DB write succeeds, only the
      // re-render after it fails). Keeping each instance's pool small
      // leaves headroom for multiple concurrent instances.
      max: 3,
    },
    // Explicit migrations only — this Postgres instance also holds the
    // site's own `contact_submissions` table (unrelated to Payload). Letting
    // Payload's dev-mode schema auto-push run interactively risks it
    // mistaking that table for a renamed Payload table. Run
    // `npm run payload:migrate:create` after schema changes, then
    // `npm run payload:migrate` to apply.
    push: false,
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        // Media is publicly readable already — serve straight from the Blob
        // CDN instead of proxying every image through our own Next server.
        media: { disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
    }),
  ],
});
