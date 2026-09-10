import type { Field } from "payload";

// Shared per-page SEO field group — added to every page Global so each
// page can override its browser-tab/search-result title, meta
// description, and social share image. Everything here is optional: a
// page with nothing filled in falls back to its own hardcoded default
// (see lib/site-metadata.ts), then to Site Settings' sitewide defaults.
export function seoFields(): Field[] {
  return [
    {
      name: "seo",
      type: "group",
      label: "SEO",
      admin: {
        description:
          "Optional — controls what shows in the browser tab, search results, and when this page is shared on social media. Leave blank to use the site default.",
      },
      fields: [
        { name: "title", type: "text", label: "Page Title", admin: { description: "Shown in the browser tab and as the search-result headline." } },
        { name: "description", type: "textarea", label: "Meta Description", admin: { description: "The snippet shown under the title in search results." } },
        { name: "ogImage", type: "upload", relationTo: "media", label: "Social Share Image", admin: { description: "Shown when this page is shared on social media. Falls back to the site default in Site Settings." } },
      ],
    },
  ];
}
