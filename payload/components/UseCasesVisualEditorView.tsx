import React from "react";
import { getCMS } from "@/lib/payload";
import type { UseCasesPage } from "@/payload/payload-types";
import { UseCasesVisualEditorClient } from "./UseCasesVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Spatial alternative to the Use Cases page's normal edit form — same
 * pattern as AboutVisualEditorView.tsx (see that file's comment for the
 * rationale). The standard form at /admin/globals/use-cases-page stays
 * the authoritative editor for photos, SEO, drafts and version history.
 */
export async function UseCasesVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/use-cases");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary] = await Promise.all([
    payload.findGlobal({ slug: "use-cases-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <UseCasesVisualEditorClient
        initialData={page as UseCasesPage}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
        pageUrl={`${getSiteUrl()}/use-cases`}
      />
    </VisualEditorShell>
  );
}
