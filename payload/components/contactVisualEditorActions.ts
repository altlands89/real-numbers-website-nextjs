"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type ContactPageEditorPayload = {
  hero: { eyebrow?: string | null; heading: string };
  directContact: { label?: string | null; whatsappNumber?: string | null; email?: string | null };
  manifesto: { heading: string; text?: string | null };
  mobileOverrides: Record<string, unknown>;
};

/**
 * Saves the Contact page from the visual editor. Same shape as
 * aboutVisualEditorActions.ts's saveAboutPage — see that file's comment
 * for why this goes through a Server Action + the Local API instead of a
 * client fetch. No photos on this page, so nothing to normalize back to
 * plain IDs here.
 */
export async function saveContactPage(
  data: ContactPageEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({ slug: "contact-page", data: { ...data, _status: "published" } });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
