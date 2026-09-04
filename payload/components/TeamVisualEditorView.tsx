import React from "react";
import { getCMS } from "@/lib/payload";
import type { TeamPage } from "@/payload/payload-types";
import { TeamVisualEditorClient, type RosterMember } from "./TeamVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";

/**
 * Spatial alternative to the Team page's normal edit form. Same pattern
 * as AboutVisualEditorView.tsx, extended to also manage the roster —
 * unlike every other page so far, the cards on this page come from the
 * separate TeamMembers collection, not a field on this Global (see
 * teamVisualEditorActions.ts's saveTeamRoster for how that's reconciled).
 * The standard form at /admin/globals/team-page stays authoritative for
 * SEO, drafts and version history; the regular TeamMembers collection
 * screens stay available too, for anyone who prefers a plain form.
 */
export async function TeamVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/team");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary, roster] = await Promise.all([
    payload.findGlobal({ slug: "team-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
    payload.find({ collection: "team-members", sort: "order", limit: 200 }),
  ]);

  const initialRoster: RosterMember[] = roster.docs.map((d) => ({
    id: d.id,
    name: d.name ?? "",
    role: d.role ?? "",
    bio: d.bio ?? "",
    education: d.education ?? "",
    photo: typeof d.photo === "object" && d.photo ? { id: d.photo.id, url: d.photo.url ?? "" } : (d.photo ?? null),
  }));

  return (
    <VisualEditorShell templateProps={templateProps}>
      <TeamVisualEditorClient
        initialData={page as TeamPage}
        initialRoster={initialRoster}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
      />
    </VisualEditorShell>
  );
}
