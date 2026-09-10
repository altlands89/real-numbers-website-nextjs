/** One-off content corrections from the pre-delivery site audit.
 *  Kept in the repo as documentation of what was changed and why, same as
 *  seed.ts / reset-seed.ts. Safe to re-run — every write is idempotent.
 *
 *  1. branding.footerCopyright ended with a hard-typed "2027" while
 *     FooterV2 already prepends the current year, so the footer read
 *     "© 2026 Real Numbers. All rights reserved. 2027".
 *  2. home.seo.title was "Home - Real Numbers" — generic, and the only page
 *     using a hyphen separator. Cleared so the page's own richer default
 *     ("Real Numbers | Financial Clarity for Growing Companies") applies.
 *  3. about-page.seo.title held a single space, which only looked empty.
 *  4. site-settings.siteName was "Real Numbers - Home" — the site's name,
 *     not a page's.
 */
import { getPayload } from "payload";
import config from "../payload.config";

async function run() {
  const payload = await getPayload({ config });
  const changes: string[] = [];

  const branding = await payload.findGlobal({ slug: "branding" });
  const cleanedCopyright = (branding.footerCopyright || "").replace(/\s*\b(19|20)\d{2}\b\s*$/, "").trim();
  if (cleanedCopyright && cleanedCopyright !== branding.footerCopyright) {
    await payload.updateGlobal({ slug: "branding", data: { footerCopyright: cleanedCopyright } });
    changes.push(`branding.footerCopyright: ${JSON.stringify(branding.footerCopyright)} -> ${JSON.stringify(cleanedCopyright)}`);
  }

  for (const slug of ["home", "about-page"] as const) {
    const global = await payload.findGlobal({ slug });
    const current = (global as { seo?: { title?: string | null } }).seo?.title;
    const isPlaceholder = typeof current === "string" && (current.trim() === "" || current === "Home - Real Numbers");
    if (isPlaceholder) {
      await payload.updateGlobal({
        slug,
        data: { seo: { ...((global as { seo?: object }).seo || {}), title: null }, _status: "published" },
      });
      changes.push(`${slug}.seo.title: ${JSON.stringify(current)} -> null (falls back to the page default)`);
    }
  }

  const siteSettings = await payload.findGlobal({ slug: "site-settings" });
  if (siteSettings.siteName && siteSettings.siteName !== "Real Numbers") {
    await payload.updateGlobal({ slug: "site-settings", data: { siteName: "Real Numbers" } });
    changes.push(`site-settings.siteName: ${JSON.stringify(siteSettings.siteName)} -> "Real Numbers"`);
  }

  console.log(changes.length ? changes.join("\n") : "No changes needed — already correct.");
  process.exit(0);
}

run();
