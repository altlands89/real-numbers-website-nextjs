import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

// Dedicated sitewide info — separate from Branding (logo files only) and
// from the per-page SEO tabs (payload/fields/seoFields.ts). This is where
// an editor sets the favicon, the fallback title/description/social
// image used when a page hasn't overridden its own, and whether the site
// is allowed to be indexed by search engines — modeled on Elementor's
// "Site Identity" panel (Site Name, Tagline, Logo, Favicon), the one
// piece of that plugin's Site Settings that doesn't already exist here.
export const SiteSettingsGlobal: GlobalConfig = {
  slug: "site-settings",
  label: "SEO & Site Info",
  admin: {
    group: "Site Design",
    description:
      "Sitewide info used when a page doesn't set its own — favicon, default social share image, default meta description, and whether search engines can index the site.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "siteName", type: "text", label: "Site Name", defaultValue: "Real Numbers", admin: { description: "Used after the page title, e.g. \"About | Real Numbers\"." } },
    { name: "tagline", type: "text", label: "Tagline", admin: { description: "A short one-line description of the business — used as the fallback meta description when a page doesn't set its own." } },
    { name: "favicon", type: "upload", relationTo: "media", label: "Favicon", admin: { description: "The small icon shown in browser tabs. A square image works best (512×512px or larger)." } },
    { name: "defaultOgImage", type: "upload", relationTo: "media", label: "Default Social Share Image", admin: { description: "Shown when a page is shared on social media and hasn't set its own share image, e.g. via WhatsApp, LinkedIn, or Facebook." } },
    {
      name: "searchEngineIndexing",
      type: "checkbox",
      label: "Allow search engines to index this site",
      defaultValue: false,
      admin: {
        description: "Keep this off while the site is still in progress — turn it on when ready to go live, so Google and other search engines start showing the site in results.",
      },
    },
  ],
};
