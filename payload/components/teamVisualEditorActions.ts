"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type TeamPageEditorPayload = {
  hero: { eyebrow?: string | null; heading: string; lede?: string | null };
  sectionHeading?: string | null;
  closingCta: { heading: string; closingLine?: string | null; buttonLabel?: string | null };
  mobileOverrides: Record<string, unknown>;
};

/** Saves the Team page's own Global fields — same shape as every other
 *  visual editor's page-level save (see aboutVisualEditorActions.ts). */
export async function saveTeamPage(
  data: TeamPageEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({ slug: "team-page", data: { ...data, _status: "published" } });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export type TeamMemberEntry = {
  id: number | null;
  name: string;
  role: string;
  bio: string;
  education: string;
  photo: number | null;
};

/**
 * Reconciles the TeamMembers collection to exactly the roster passed in,
 * in order. Unlike every other visual editor's save (one Global document,
 * one updateGlobal call), the roster is a separate collection — multiple
 * documents — so "nothing touches the database until Publish" here means
 * this single action has to do the create/update/delete diffing itself:
 * an entry with `id: null` is a new card (created), an entry with an `id`
 * is an existing card (updated), and any existing document whose id isn't
 * present in the incoming list at all was removed in the editor (deleted
 * — which the collection's own `trash: true` turns into a recoverable
 * soft-delete, not a permanent one). `order` is written from each entry's
 * position in the array, so reordering the list in the editor reorders
 * the live page.
 *
 * Not a real cross-document DB transaction — Payload's Local API doesn't
 * expose one conveniently here, and this is a low-traffic internal tool
 * where a partial failure (rare, and left in a recoverable state either
 * way given trash) isn't worth the added complexity of wiring one up by
 * hand.
 */
export async function saveTeamRoster(
  entries: TeamMemberEntry[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    const existing = await payload.find({ collection: "team-members", limit: 200, depth: 0 });
    const keptIds = new Set(entries.map((e) => e.id).filter((id): id is number => id !== null));
    const toDelete = existing.docs.filter((d) => !keptIds.has(d.id));

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const data = {
        name: entry.name,
        role: entry.role,
        bio: entry.bio,
        education: entry.education,
        photo: entry.photo,
        order: i,
      };
      if (entry.id === null) {
        await payload.create({ collection: "team-members", data });
      } else {
        await payload.update({ collection: "team-members", id: entry.id, data });
      }
    }
    // Not payload.delete() — that's a real, permanent removal regardless
    // of the collection's `trash: true` (confirmed by reading Payload's
    // own delete operation: it has no trash-awareness at all). The admin
    // UI's own "move to trash" is really just an update that sets
    // `deletedAt`, which the update operation specifically detects
    // (`isTrashAttempt`) — this is that same, correct, recoverable path.
    for (const doc of toDelete) {
      await payload.update({
        collection: "team-members",
        id: doc.id,
        data: { deletedAt: new Date().toISOString() },
      });
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
