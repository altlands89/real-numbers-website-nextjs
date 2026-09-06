"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type QuestionsPageEditorPayload = {
  hero: { eyebrow?: string | null; heading: string };
  atmospherePhotos: { image: number }[];
  mobileOverrides: Record<string, unknown>;
};

/** Saves the Questions Founders Ask page's own Global fields — same shape
 *  as every other visual editor's page-level save. */
export async function saveQuestionsPage(
  data: QuestionsPageEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({
      slug: "questions-founders-ask-page",
      data: { ...data, _status: "published" },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

export type FaqItemEntry = { id: number | null; question: string; answer: string };

/**
 * Reconciles the FAQItems collection to exactly the list passed in, in
 * order — same pattern as teamVisualEditorActions.ts's saveTeamRoster
 * (see that file's comment for the full rationale, and in particular why
 * removal goes through an update that sets `deletedAt` rather than
 * payload.delete(), which is a real permanent removal with no
 * trash-awareness regardless of the collection's trash:true).
 */
export async function saveFaqItems(
  entries: FaqItemEntry[],
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    const existing = await payload.find({ collection: "faq-items", limit: 200, depth: 0 });
    const keptIds = new Set(entries.map((e) => e.id).filter((id): id is number => id !== null));
    const toDelete = existing.docs.filter((d) => !keptIds.has(d.id));

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const data = { question: entry.question, answer: entry.answer, order: i };
      if (entry.id === null) {
        await payload.create({ collection: "faq-items", data });
      } else {
        await payload.update({ collection: "faq-items", id: entry.id, data });
      }
    }
    for (const doc of toDelete) {
      await payload.update({ collection: "faq-items", id: doc.id, data: { deletedAt: new Date().toISOString() } });
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
