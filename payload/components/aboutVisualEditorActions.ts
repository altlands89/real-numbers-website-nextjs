"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

export type AboutEditorPayload = {
  hero: { eyebrow?: string | null; heading: string; lede: string };
  ourStory: {
    heading?: string | null;
    paragraphs: { text: string }[];
    photos: { image: number }[];
    photoCaption?: string | null;
  };
  whatWeBelieve: { heading?: string | null; intro?: string | null; principles: { lead: string; text: string }[] };
  howWeWork: { heading?: string | null; paragraphs: { text: string }[] };
  leadership: {
    heading?: string | null;
    cards: { name: string; role: string; bio: string }[];
    note?: string | null;
    teamLinkLabel?: string | null;
  };
  mobileOverrides: Record<string, unknown>;
};

/**
 * Saves the About page from the visual editor.
 *
 * A Server Action rather than a client `fetch` to /api/globals/about-page:
 * the REST route authenticates from the payload-token cookie, which the
 * admin's own document requests carry but a client fetch in this context
 * did not — it came back 403 with `/api/users/me` reporting no user.
 * Going through the Local API sidesteps cookie/CSRF handling entirely,
 * and `payload.auth()` still enforces that a real admin user is making
 * the request, so this isn't an open write endpoint.
 *
 * Only the groups the visual editor owns are sent; `seo` and anything
 * else on the Global is left untouched. Photos are passed back as IDs so
 * saving text never drops the uploads the regular form manages.
 */
export async function saveAboutPage(
  data: AboutEditorPayload,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();

  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({
      slug: "about-page",
      // Drafts are enabled on this Global; publishing directly matches
      // what the regular form's "Publish changes" button does.
      data: { ...data, _status: "published" },
    });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
