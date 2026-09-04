import React from "react";
import { getCMS } from "@/lib/payload";
import type { Home } from "@/payload/payload-types";
import { HomeVisualEditorClient } from "./HomeVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";

/**
 * Spatial + drag-reorderable alternative to the Home page's normal edit
 * form. Unlike every other page, Home's content is `sections`, a Payload
 * `blocks` array (see payload/blocks/HomeBlocks.ts) — this view fetches
 * that as-is and lets the client component switch on each block's own
 * `blockType`.
 *
 * Scope, matching every other stage's "only this Global's own fields"
 * boundary: the `stats` block has no fields of its own (it renders the
 * separate Stats Global), the `divider` block's video and the `hero`
 * block's client-logos strip pull from other collections/globals — none
 * of that is editable here, same as Team/Questions leave their own
 * collection's *unrelated* surface to the regular admin. What IS in
 * scope: every block's own text/photo fields, plus reordering the
 * section list itself (native HTML5 drag-and-drop — see
 * HomeVisualEditorClient.tsx — deliberately not a real GrapesJS-style
 * freeform canvas; ruled out explicitly, see CLAUDE.md).
 */
export async function HomeVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/home");

  const payload = await getCMS();
  const [home, tokens, mediaLibrary] = await Promise.all([
    payload.findGlobal({ slug: "home" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <HomeVisualEditorClient
        initialData={home as Home}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
      />
    </VisualEditorShell>
  );
}
