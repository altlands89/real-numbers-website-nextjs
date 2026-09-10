import React from "react";
import { redirect } from "next/navigation";
import { DefaultTemplate } from "@payloadcms/next/templates";

// The exact minimal prop slice a component registered under
// admin.components.views actually receives at the top level — permissions/
// locale/visibleEntities/the request live nested under initPageResult, not
// top-level, despite what Payload's general ServerProps type suggests
// (traced through @payloadcms/next/dist/views/Root/index.js while fixing
// BrandIdentityView's crash on the general type — see CLAUDE.md).
export type AdminViewProps = {
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
 * Custom views registered under admin.components.views do NOT inherit
 * Payload's auth gate — unlike /admin/globals/*, an unauthenticated
 * visitor reaches the view component directly, and the Local API a visual
 * editor uses to fetch page content bypasses access control by design.
 * Every visual-editor view's top-level export must call this before
 * fetching or rendering anything, or it reopens the exact hole found (and
 * fixed) on the Brand Identity and About views — confirmed by testing an
 * actually-logged-out browser session, not just reading the code (see
 * CLAUDE.md: a plain curl|grep is misleading here, it matches the module
 * source inlined in the dev bundle, not rendered output).
 *
 * Returns the resolved user plus the exact prop shape DefaultTemplate
 * needs — pass `templateProps` straight to <VisualEditorShell>.
 */
export function requireAdminSession(props: AdminViewProps, redirectPath: string) {
  const { i18n, params, payload, searchParams, initPageResult } = props;
  const { locale, permissions, req, visibleEntities } = initPageResult ?? {};
  const user = req?.user;
  if (!user) redirect(`/admin/login?redirect=${encodeURIComponent(redirectPath)}`);
  return {
    user,
    templateProps: { i18n, locale, params, payload, permissions, searchParams, user, visibleEntities },
  };
}

// TASA Orbiter isn't loaded in the admin app by default — every visual
// editor renders in the real brand typeface so its canvas reads like the
// actual page, hence this shared @font-face block.
const BRAND_FONT_FACE_CSS = `
  @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Regular.ttf") format("truetype"); font-weight: 400; }
  @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Medium.ttf") format("truetype"); font-weight: 500; }
  @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-SemiBold.ttf") format("truetype"); font-weight: 600; }
  @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-Bold.ttf") format("truetype"); font-weight: 700; }
  @font-face { font-family: "TASA Orbiter Editor"; src: url("/fonts/TASAOrbiter-ExtraBold.ttf") format("truetype"); font-weight: 800; }
`;

/** Wraps a visual editor's content in Payload's own DefaultTemplate (so it
 *  gets the sidebar/nav shell instead of rendering bare — views under
 *  admin.components.views don't get this automatically either) plus the
 *  brand @font-face block every editor's canvas needs. */
export function VisualEditorShell({
  templateProps,
  children,
}: {
  // No exported prop type for DefaultTemplate from Payload to type this
  // against precisely — matches the existing `as any` cast this pattern
  // has used since BrandIdentityView.tsx.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  templateProps: any;
  children: React.ReactNode;
}) {
  return (
    <DefaultTemplate {...templateProps}>
      <style>{BRAND_FONT_FACE_CSS}</style>
      {children}
    </DefaultTemplate>
  );
}
