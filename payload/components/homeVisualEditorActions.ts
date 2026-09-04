"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";
import type { Home } from "@/payload/payload-types";

/**
 * Saves the Home page's sections array from the visual editor. Simpler
 * than Team/Questions' collection reconciliation (see
 * teamVisualEditorActions.ts) — `sections` is a Payload `blocks` field on
 * this one Global document, not a separate collection, so reordering,
 * editing, or the (block-type-aware) fields owned by each block are all
 * just one field on one `updateGlobal` call, same shape as every
 * Global-only stage (About, Why Real Numbers, …). `seo` is left
 * untouched, same convention as every other stage.
 */
export async function saveHomeSections(
  sections: Home["sections"],
  mobileOverrides: Record<string, unknown>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  try {
    await payload.updateGlobal({ slug: "home", data: { sections, mobileOverrides, _status: "published" } });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
