import React from "react";
import { getCMS } from "@/lib/payload";
import type { AboutPage } from "@/payload/payload-types";
import { AboutVisualEditorClient } from "./AboutVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";
import { getSiteUrl } from "@/lib/site-url";

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
export async function AboutVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/about");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary] = await Promise.all([
    payload.findGlobal({ slug: "about-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <AboutVisualEditorClient
        initialData={page as AboutPage}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
        pageUrl={`${getSiteUrl()}/about`}
      />
    </VisualEditorShell>
  );
}
