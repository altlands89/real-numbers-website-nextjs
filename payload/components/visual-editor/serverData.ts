import type { getCMS } from "@/lib/payload";
import type { MediaItem } from "./shared";

type PayloadInstance = Awaited<ReturnType<typeof getCMS>>;

export type BrandColors = {
  black: string;
  offwhite: string;
  red: string;
  blue: string;
  clay: string;
  stone: string;
};

const FALLBACK_COLORS: BrandColors = {
  black: "#241e1c",
  offwhite: "#f0efe8",
  red: "#b85840",
  blue: "#353e5b",
  clay: "#ce8570",
  stone: "#cfc9bc",
};

/** Resolves the 6 brand colors a visual-editor canvas draws with from the
 *  live `design-tokens` Global, falling back to today's shipped values —
 *  so the schematic always matches whatever's currently saved in Site
 *  Design → Colors instead of a second, driftable hardcoded copy. */
export function resolveBrandColors(tokens: { colors?: unknown }): BrandColors {
  const c = (tokens?.colors ?? {}) as Record<string, string>;
  return {
    black: c.black || FALLBACK_COLORS.black,
    offwhite: c.offwhite || FALLBACK_COLORS.offwhite,
    red: c.red || FALLBACK_COLORS.red,
    blue: c.blue || FALLBACK_COLORS.blue,
    clay: c.clay || FALLBACK_COLORS.clay,
    stone: c.stone || FALLBACK_COLORS.stone,
  };
}

/** Fetches the media library a visual editor's in-canvas image picker
 *  offers. Newest first, capped at 200 — the picker filters client-side,
 *  so this stays one query rather than a search endpoint. */
export async function fetchMediaLibrary(payload: PayloadInstance): Promise<MediaItem[]> {
  const media = await payload.find({ collection: "media", limit: 200, sort: "-createdAt", depth: 0 });
  return media.docs
    .filter((m) => Boolean(m.url))
    .map((m) => ({ id: m.id, url: m.url as string, alt: m.alt ?? "", filename: m.filename ?? "" }));
}
