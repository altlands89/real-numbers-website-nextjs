import React from "react";
import { getCMS } from "@/lib/payload";
import type { OurExpertisePage } from "@/payload/payload-types";
import { OurExpertiseVisualEditorClient } from "./OurExpertiseVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";

/**
 * Spatial alternative to the Our Expertise page's normal edit form — same
 * pattern as AboutVisualEditorView.tsx (see that file's comment for the
 * rationale). The standard form at /admin/globals/our-expertise-page stays
 * the authoritative editor for photos, SEO, drafts and version history.
 */
export async function OurExpertiseVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/our-expertise");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary] = await Promise.all([
    payload.findGlobal({ slug: "our-expertise-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <OurExpertiseVisualEditorClient
        initialData={page as OurExpertisePage}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
      />
    </VisualEditorShell>
  );
}
