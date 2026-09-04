"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type OurExpertiseEditorPayload = {
  hero: { eyebrow?: string | null; heading: string; ledeParagraphs: { text: string }[] };
  areas: {
    title: string;
    tagline: string;
    paragraphs: { text: string }[];
    services: { label: string }[];
  }[];
  integrated: {
    heading?: string | null;
    text?: string | null;
    photos: { image: number }[];
    photoCaption?: string | null;
  };
  closingCta: { heading: string; closingLine?: string | null; buttonLabel?: string | null };
};

/**
 * Saves the Our Expertise page from the visual editor. Same shape as
 * aboutVisualEditorActions.ts's saveAboutPage — see that file's comment
 * for why this goes through a Server Action + the Local API instead of a
 * client fetch.
 *
 * Only the groups the visual editor owns are sent; `seo` is left
 * untouched. Photos are passed back as IDs so saving text never drops the
 * uploads the regular form manages.
 */
export async function saveOurExpertisePage(
  data: OurExpertiseEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();

  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({
      slug: "our-expertise-page",
      // Drafts are enabled on this Global; publishing directly matches
      // what the regular form's "Publish changes" button does.
      data: { ...data, _status: "published" },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
