import type { Metadata } from "next";
import { getCMS } from "@/lib/payload";
import { getSiteUrl } from "@/lib/site-url";
import type { Media, SiteSetting } from "@/payload/payload-types";

type SeoField = {
  title?: string | null;
  description?: string | null;
  ogImage?: number | Media | null;
} | null | undefined;

// Treats a whitespace-only value (e.g. a stray space left in a field) the
// same as empty, so it falls through to the next default instead of
// rendering as a blank-looking title/description.
function nonBlank(value?: string | null): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function mediaUrl(media?: number | Media | null): string | undefined {
  if (media && typeof media === "object" && media.url) {
    const url = media.url;
    return url.startsWith("http") ? url : `${getSiteUrl()}${url}`;
  }
  return undefined;
}

/**
 * Builds a page's Metadata from its own SEO fields (payload/fields/seoFields.ts),
 * falling back first to the hardcoded default passed in (today's original
 * copy, kept so nothing regresses if a field is left blank) and then to
 * Site Settings' sitewide defaults. Every page's generateMetadata() calls
 * this the same way — see app/(frontend)/about/page.tsx for the pattern.
 */
export async function buildPageMetadata(
  seo: SeoField,
  fallback: { title: string; description: string },
): Promise<Metadata> {
  const payload = await getCMS();
  const siteSettings = (await payload.findGlobal({ slug: "site-settings" })) as SiteSetting;

  const title = nonBlank(seo?.title) || fallback.title;
  const description = nonBlank(seo?.description) || nonBlank(siteSettings.tagline) || fallback.description;
  const ogImage = mediaUrl(seo?.ogImage) || mediaUrl(siteSettings.defaultOgImage);

  return {
    title,
    description,
    openGraph: { title, description, images: ogImage ? [{ url: ogImage }] : undefined },
    twitter: { card: "summary_large_image", title, description, images: ogImage ? [ogImage] : undefined },
  };
}

/** Sitewide metadata pieces that don't vary per page — favicon and
 * whether search engines may index the site — read once in the root
 * layout. See app/(frontend)/layout.tsx. */
export async function buildRootMetadata(): Promise<Metadata> {
  const payload = await getCMS();
  const siteSettings = (await payload.findGlobal({ slug: "site-settings" })) as SiteSetting;
  const faviconUrl = mediaUrl(siteSettings.favicon);

  return {
    robots: siteSettings.searchEngineIndexing ? { index: true, follow: true } : { index: false, follow: false },
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
  };
}
