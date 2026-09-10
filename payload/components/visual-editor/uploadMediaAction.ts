"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";
import type { MediaItem } from "./shared";

/**
 * Uploads a new file into the Media collection directly from a visual
 * editor's image picker — before this, the picker could only choose from
 * files already uploaded via the regular Media admin screen. Same
 * Server-Action-over-the-Local-API pattern as every other visual-editor
 * save action (see aboutVisualEditorActions.ts's comment): a client fetch
 * to Payload's REST upload endpoint in this context comes back 403,
 * payload.auth() here still enforces a real admin session.
 *
 * `alt` is optional — the Media collection's `alt` field is no longer
 * required, so an editor can upload and use an image immediately without
 * writing a description first.
 */
export async function uploadMedia(
  formData: FormData,
): Promise<{ ok: true; item: MediaItem } | { ok: false; error: string }> {
  const payload = await getCMS();

  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) return { ok: false, error: "Not signed in — reload the admin and try again." };

  const file = formData.get("file");
  if (!(file instanceof File)) return { ok: false, error: "No file provided." };

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const doc = await payload.create({
      collection: "media",
      data: { alt: (formData.get("alt") as string) || "" },
      file: {
        data: buffer,
        mimetype: file.type || "application/octet-stream",
        name: file.name,
        size: file.size,
      },
    });
    return {
      ok: true,
      item: { id: doc.id, url: doc.url ?? "", alt: doc.alt ?? "", filename: doc.filename ?? "" },
    };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Upload failed" };
  }
}
