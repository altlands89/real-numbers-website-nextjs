import type { CollectionConfig } from "payload";

export const BRAND_ASSET_CATEGORIES = [
  { label: "Logos & Marks", value: "logos" },
  { label: "Iconography", value: "icons" },
  { label: "Numerals & Compositions", value: "numerals" },
  { label: "Colors", value: "colors" },
  { label: "Typography / Fonts", value: "fonts" },
  { label: "Photography", value: "photography" },
  { label: "Animations", value: "animations" },
  { label: "Templates & Documents", value: "documents" },
  { label: "Social & Email Signatures", value: "social" },
] as const;

// Downloadable brand deliverables (logo packs, icon/numeral sets, fonts,
// templates, etc.), separate from Media — Media is scoped to content
// images (team photos, hero art) with a required alt field; these are
// reference/download files, often zipped bundles, shown on the Brand
// Identity admin page (payload/components/BrandIdentityView.tsx).
export const BrandAssets: CollectionConfig = {
  slug: "brand-assets",
  labels: { singular: "Brand Asset", plural: "Brand Assets" },
  admin: {
    group: "Site Design",
    useAsTitle: "title",
    defaultColumns: ["title", "category", "filename"],
    description:
      "Downloadable brand files shown on the Brand Identity page — logo packs, icon/numeral sets, fonts, templates. Source originals live in the Drive brand folder.",
  },
  access: { read: () => true },
  trash: true,
  fields: [
    { name: "title", type: "text", required: true, label: "Title" },
    {
      name: "category",
      type: "select",
      required: true,
      label: "Category",
      options: BRAND_ASSET_CATEGORIES as unknown as { label: string; value: string }[],
    },
    { name: "description", type: "text", label: "Description", admin: { description: "One line shown under the title on the Brand Identity page." } },
  ],
  upload: {
    // No mimeType restriction — these are zips, fonts, PDFs, docx, images.
  },
};
