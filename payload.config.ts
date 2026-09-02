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
import { TypographyGlobal } from "./payload/globals/TypographyGlobal";
import { LayoutMotionGlobal } from "./payload/globals/LayoutMotionGlobal";
import { getSiteUrl } from "./lib/site-url";

// Maps each page Global's slug to the live route it renders, so Live
// Preview's iframe can open the right page while editing.
const PAGE_ROUTE_BY_GLOBAL_SLUG: Record<string, string> = {
  home: "/",
  "about-page": "/about",
  "team-page": "/team",
  "contact-page": "/contact",
  "why-real-numbers-page": "/why-real-numbers",
  "our-expertise-page": "/our-expertise",
  "use-cases-page": "/use-cases",
  "questions-founders-ask-page": "/questions-founders-ask",
};

export default buildConfig({
  admin: {
    user: Users.slug,
    meta: {
      title: "Real Numbers Admin",
      titleSuffix: " · Real Numbers",
      description: "Content management for the Real Numbers marketing site.",
      icons: [{ rel: "icon", type: "image/svg+xml", url: "/img/symbol-red.svg" }],
    },
    components: {
      graphics: {
        Icon: "@/payload/components/RNIcon#RNIcon",
        Logo: "@/payload/components/RNLogo#RNLogo",
      },
      header: ["@/payload/components/AdminBrandStyles#AdminBrandStyles"],
      // The header slot only renders inside the authenticated app shell —
      // the login screen needs its own copy of the same style injector so
      // the brand color override applies there too.
      beforeLogin: ["@/payload/components/AdminBrandStyles#AdminBrandStyles"],
    },
    livePreview: {
      globals: Object.keys(PAGE_ROUTE_BY_GLOBAL_SLUG),
      breakpoints: [
        { name: "mobile", label: "Mobile", width: 390, height: 844 },
        { name: "tablet", label: "Tablet", width: 820, height: 1180 },
        { name: "desktop", label: "Desktop", width: 1440, height: 900 },
      ],
      url: ({ globalConfig }) => {
        const route = globalConfig?.slug ? PAGE_ROUTE_BY_GLOBAL_SLUG[globalConfig.slug] : undefined;
        return route ? `${getSiteUrl()}${route}` : undefined;
      },
    },
  },
  collections: [Users, Media, TeamMembers, Testimonials, FAQItems, ClientLogos],
  globals: [
    BrandingGlobal,
    DesignTokensGlobal,
    TypographyGlobal,
    LayoutMotionGlobal,
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
