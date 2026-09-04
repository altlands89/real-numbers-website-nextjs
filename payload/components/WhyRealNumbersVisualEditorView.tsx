import React from "react";
import { getCMS } from "@/lib/payload";
import type { WhyRealNumbersPage } from "@/payload/payload-types";
import { WhyRealNumbersVisualEditorClient } from "./WhyRealNumbersVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";

/**
 * Spatial alternative to the Why Real Numbers page's normal edit form —
 * same pattern as AboutVisualEditorView.tsx (see that file's comment for
 * the rationale). The standard form at /admin/globals/why-real-numbers-page
 * stays the authoritative editor for photos, SEO, drafts and version
 * history.
 */
export async function WhyRealNumbersVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/why-real-numbers");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary] = await Promise.all([
    payload.findGlobal({ slug: "why-real-numbers-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <WhyRealNumbersVisualEditorClient
        initialData={page as WhyRealNumbersPage}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
      />
    </VisualEditorShell>
  );
}
