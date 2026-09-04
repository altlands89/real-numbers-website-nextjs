"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type UseCasesEditorPayload = {
  hero: { eyebrow?: string | null; heading: string; lede?: string | null };
  atmospherePhotos: { image: number }[];
  atmospherePhotoCaption?: string | null;
  situationsIntro?: string | null;
  situations: { question: string; answer: string }[];
  closingCta: { heading: string; buttonLabel?: string | null };
};

/**
 * Saves the Use Cases page from the visual editor. Same shape as
 * aboutVisualEditorActions.ts's saveAboutPage — see that file's comment
 * for why this goes through a Server Action + the Local API instead of a
 * client fetch.
 *
 * Only the groups the visual editor owns are sent; `seo` is left
 * untouched. Photos are passed back as IDs so saving text never drops the
 * uploads the regular form manages.
 */
export async function saveUseCasesPage(
  data: UseCasesEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();

  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({
      slug: "use-cases-page",
      // Drafts are enabled on this Global; publishing directly matches
      // what the regular form's "Publish changes" button does.
      data: { ...data, _status: "published" },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
