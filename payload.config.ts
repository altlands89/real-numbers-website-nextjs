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
import { BrandAssets } from "./payload/collections/BrandAssets";

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
import { SiteSettingsGlobal } from "./payload/globals/SiteSettingsGlobal";
import { AIIntegrationsGlobal } from "./payload/globals/AIIntegrationsGlobal";
import { AccountHandoffGlobal } from "./payload/globals/AccountHandoffGlobal";
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
      beforeLogin: [
        "@/payload/components/AdminBrandStyles#AdminBrandStyles",
        "@/payload/components/AdminLoginBackground#AdminLoginBackground",
      ],
      // Friendly landing panel above the default collections/globals grid —
      // a greeting, one-click links to the 8 content pages, and a link to
      // the live site, so a non-technical editor isn't dropped straight
      // into a bare list of internal collection names.
      beforeDashboard: ["@/payload/components/AdminDashboardWelcome#AdminDashboardWelcome"],
      // Custom "Brand Identity" page (registered under views below) doesn't
      // get an automatic sidebar link, so this adds one after the default
      // nav groups.
      afterNavLinks: ["@/payload/components/BrandIdentityNav#BrandIdentityNav"],
      views: {
        brandIdentity: {
          Component: "@/payload/components/BrandIdentityView#BrandIdentityView",
          path: "/brand-identity",
          meta: { title: "Brand Identity" },
        },
        // Spatial visual editors — see AboutVisualEditorView.tsx for the
        // rationale (and payload/components/visual-editor/ for the shared
        // plumbing every one of these imports). Each page's standard form
        // at /admin/globals/<slug> stays the authoritative editor.
        aboutVisualEditor: {
          Component: "@/payload/components/AboutVisualEditorView#AboutVisualEditorView",
          path: "/visual-editor/about",
          meta: { title: "About — Visual Editor" },
        },
        whyRealNumbersVisualEditor: {
          Component: "@/payload/components/WhyRealNumbersVisualEditorView#WhyRealNumbersVisualEditorView",
          path: "/visual-editor/why-real-numbers",
          meta: { title: "Why Real Numbers — Visual Editor" },
        },
        ourExpertiseVisualEditor: {
          Component: "@/payload/components/OurExpertiseVisualEditorView#OurExpertiseVisualEditorView",
          path: "/visual-editor/our-expertise",
          meta: { title: "Our Expertise — Visual Editor" },
        },
        useCasesVisualEditor: {
          Component: "@/payload/components/UseCasesVisualEditorView#UseCasesVisualEditorView",
          path: "/visual-editor/use-cases",
          meta: { title: "Use Cases — Visual Editor" },
        },
        settings: {
          Component: "@/payload/components/SettingsView#SettingsView",
          path: "/settings",
          meta: { title: "Settings" },
        },
        teamVisualEditor: {
          Component: "@/payload/components/TeamVisualEditorView#TeamVisualEditorView",
          path: "/visual-editor/team",
          meta: { title: "Team — Visual Editor" },
        },
        questionsVisualEditor: {
          Component: "@/payload/components/QuestionsVisualEditorView#QuestionsVisualEditorView",
          path: "/visual-editor/questions",
          meta: { title: "Questions Founders Ask — Visual Editor" },
        },
        contactVisualEditor: {
          Component: "@/payload/components/ContactVisualEditorView#ContactVisualEditorView",
          path: "/visual-editor/contact",
          meta: { title: "Contact — Visual Editor" },
        },
        homeVisualEditor: {
          Component: "@/payload/components/HomeVisualEditorView#HomeVisualEditorView",
          path: "/visual-editor/home",
          meta: { title: "Home — Visual Editor" },
        },
      },
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
  collections: [Users, Media, TeamMembers, Testimonials, FAQItems, ClientLogos, BrandAssets],
  globals: [
    BrandingGlobal,
    SiteSettingsGlobal,
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
    AIIntegrationsGlobal,
    AccountHandoffGlobal,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: "payload/payload-types.ts",
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || "",
      // DATABASE_URI points at Supabase's Transaction Pooler (port 6543),
      // not the Session Pooler (5432) — the session pooler caps total
      // concurrent connections at 15 project-wide, and on Vercel every
      // serverless function instance opens its own pool, so a handful of
      // concurrent invocations alone exhausted it in production
      // (confirmed via `vercel logs`: EMAXCONNSESSION, "max clients
      // reached in session mode — max clients are limited to
      // pool_size: 15"). Symptom looked like "edits aren't saving" when
      // they actually were — the DB write succeeded, only the next
      // request's re-render failed to get a connection. Transaction mode
      // multiplexes many clients over few real backend connections
      // (confirmed 25 concurrent connections hold fine, vs. session
      // mode's hard 15 cap) and is still IPv4-reachable like the session
      // pooler, so it doesn't reintroduce the direct-host IPv6 problem
      // noted elsewhere in this file's history.
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
        "brand-assets": { disablePayloadAccessControl: true },
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || "",
      // Vercel's serverless functions cap request bodies at 4.5MB, which
      // silently rejects anything but small images (video files in
      // particular). This routes the upload straight from the browser to
      // Vercel Blob instead of proxying it through our own API route.
      clientUploads: true,
    }),
  ],
});
