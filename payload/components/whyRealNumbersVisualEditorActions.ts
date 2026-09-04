"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

// Array items carry their own `id` back so Payload updates the existing DB
// row instead of deleting and recreating it — without this, ids churn on
// every save, which would silently orphan any per-item mobileOverrides key
// (see visual-editor/ResponsiveField.tsx) using the old id.
export type WhyRealNumbersEditorPayload = {
  hero: { eyebrow?: string | null; heading: string; ledeParagraphs: { id?: string | null; text: string }[] };
  whyChooseUs: { heading?: string | null; paragraphs: { id?: string | null; text: string }[] };
  valueProps: { id?: string | null; title: string; paragraph1: string; paragraph2?: string | null }[];
  whatMakesDifferent: {
    heading?: string | null;
    paragraphs: { id?: string | null; text: string }[];
    photos: { image: number }[];
  };
  closingCta: { heading: string; closingLine?: string | null; buttonLabel?: string | null };
  mobileOverrides: Record<string, unknown>;
};

/**
 * Saves the Why Real Numbers page from the visual editor. Same shape as
 * aboutVisualEditorActions.ts's saveAboutPage — see that file's comment
 * for why this goes through a Server Action + the Local API instead of a
 * client fetch to /api/globals/why-real-numbers-page (a client fetch in
 * this context comes back 403; payload.auth() here still enforces a real
 * admin session, so this isn't an open write endpoint).
 *
 * Only the groups the visual editor owns are sent; `seo` is left
 * untouched. Photos are passed back as IDs so saving text never drops the
 * uploads the regular form manages.
 */
export async function saveWhyRealNumbersPage(
  data: WhyRealNumbersEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();

  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({
      slug: "why-real-numbers-page",
      // Drafts are enabled on this Global; publishing directly matches
      // what the regular form's "Publish changes" button does.
      data: { ...data, _status: "published" },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
