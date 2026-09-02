import React from "react";
import { redirect } from "next/navigation";
import { DefaultTemplate } from "@payloadcms/next/templates";
import { getCMS } from "@/lib/payload";
import type { AboutPage } from "@/payload/payload-types";
import { AboutVisualEditorClient } from "./AboutVisualEditorClient";

// Same minimal prop slice BrandIdentityView.tsx documents: for a view
// registered under admin.components.views, only i18n/payload/params/
// searchParams arrive top-level — permissions, locale, visibleEntities
// and the request live nested under initPageResult.
type ViewProps = {
  i18n: unknown;
  initPageResult?: {
    locale?: unknown;
    permissions?: unknown;
    req?: { user?: unknown };
    visibleEntities?: { collections: string[]; globals: string[] };
  };
  params?: Record<string, string | string[] | undefined>;
  payload: unknown;
  searchParams?: Record<string, string | string[] | undefined>;
};

/**
 * Experiment: a spatial alternative to the About page's normal edit form.
 * The regular form is a flat list of labelled inputs across 6 tabs, which
 * says nothing about *where* a given text lands on the page. This renders
 * a schematic of the real About layout — dark top banner, two-column
 * story block, principles grid, leadership cards — with each field placed
 * where its text actually appears, sized roughly like the real type.
 *
 * Deliberately a separate view rather than a replacement: the standard
 * form stays untouched and authoritative (photos, SEO, drafts, version
 * history all still live there), so this can be evaluated without risk.
 */
export async function AboutVisualEditorView(props: ViewProps) {
  const { i18n, params, payload: adminPayload, searchParams, initPageResult } = props;
  const { locale, permissions, req, visibleEntities } = initPageResult ?? {};
  const user = req?.user;

  // Custom views registered under admin.components.views do NOT inherit
  // Payload's auth gate — unlike /admin/globals/*, an unauthenticated
  // visitor reaches this component directly, and the Local API below
  // bypasses access control by design. Without this check the whole page
  // content rendered to anyone who knew the URL.
  if (!user) redirect("/admin/login?redirect=%2Fadmin%2Fvisual-editor%2Fabout");

  const payload = await getCMS();
  const [page, tokens, media] = await Promise.all([
    payload.findGlobal({ slug: "about-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    // Powers the in-canvas image picker. Newest first, capped — the
    // picker filters client-side, so this stays one query rather than a
    // search endpoint.
    payload.find({ collection: "media", limit: 200, sort: "-createdAt", depth: 0 }),
  ]);

  const c = (tokens?.colors ?? {}) as Record<string, string>;
  const colors = {
    black: c.black || "#241e1c",
    offwhite: c.offwhite || "#f0efe8",
    red: c.red || "#b85840",
    blue: c.blue || "#353e5b",
    clay: c.clay || "#ce8570",
    stone: c.stone || "#cfc9bc",
  };

  const mediaLibrary = media.docs
    .filter((m) => Boolean(m.url))
    .map((m) => ({ id: m.id, url: m.url as string, alt: m.alt ?? "", filename: m.filename ?? "" }));

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <DefaultTemplate
      {...({ i18n, locale, params, payload: adminPayload, permissions, searchParams, user, visibleEntities } as any)}
    >
      {/* Scoped @font-face so the canvas renders in the real brand
          typeface — the whole point is that it reads like the page. */}
      <style>{`
        @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Regular.ttf") format("truetype"); font-weight: 400; }
        @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Medium.ttf") format("truetype"); font-weight: 500; }
        @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-SemiBold.ttf") format("truetype"); font-weight: 600; }
        @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Bold.ttf") format("truetype"); font-weight: 700; }
        @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-ExtraBold.ttf") format("truetype"); font-weight: 800; }
      `}</style>
      <AboutVisualEditorClient initialData={page as AboutPage} colors={colors} mediaLibrary={mediaLibrary} />
    </DefaultTemplate>
  );
}
