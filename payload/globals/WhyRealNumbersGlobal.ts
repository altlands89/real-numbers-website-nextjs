import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const WhyRealNumbersGlobal: GlobalConfig = {
  slug: "why-real-numbers-page",
  label: "Why Real Numbers",
  admin: { group: "Pages", description: "SEO and version history. Page content is edited in the Visual Editor." },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  // Edits save as a Draft first — the live site keeps showing the last
  // Published version until an editor explicitly clicks Publish, and every
  // past published version stays available to revert to.
  versions: { drafts: true },
  fields: [
    {
      type: "tabs",
      tabs: [
        {
          label: "Top Banner",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Why Real Numbers" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
                {
                  name: "ledeParagraphs",
                  type: "array",
                  label: "Intro Paragraphs",
                  labels: { singular: "Paragraph", plural: "Paragraphs" },
                  minRows: 1,
                  maxRows: 2,
                  fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Why Choose Us",
          fields: [
            {
              name: "whyChooseUs",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "heading", type: "text", label: "Heading", defaultValue: "Why companies choose us" },
                {
                  name: "paragraphs",
                  type: "array",
                  label: "Paragraphs",
                  labels: { singular: "Paragraph", plural: "Paragraphs" },
                  minRows: 1,
                  fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Feature Cards",
          fields: [
            {
              name: "valueProps",
              type: "array",
              label: "Feature Cards",
              labels: { singular: "Feature Card", plural: "Feature Cards" },
              minRows: 1,
              maxRows: 4,
              admin: { hidden: true, description: "The 4-card grid (Startup Mindset, Strategic Thinking, Hands-on Partnership, Built for Long-Term Growth)." },
              fields: [
                { name: "title", type: "text", label: "Title", required: true },
                { name: "paragraph1", type: "textarea", label: "First Paragraph", required: true },
                { name: "paragraph2", type: "textarea", label: "Second Paragraph" },
              ],
            },
          ],
        },
        {
          label: "What Makes Us Different",
          fields: [
            {
              name: "whatMakesDifferent",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "What makes the partnership different" },
                {
                  name: "paragraphs",
                  type: "array",
                  label: "Paragraphs",
                  labels: { singular: "Paragraph", plural: "Paragraphs" },
                  minRows: 1,
                  // Shortened so the auto-generated versions-table name
                  // (needed once drafts are enabled) stays under Postgres's
                  // 63-character identifier limit.
                  dbName: "why_rn_wmd_paragraphs",
                  fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
                },
                {
                  name: "photos",
                  type: "array",
                  label: "Photos",
                  labels: { singular: "Photo", plural: "Photos" },
                  admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
                  dbName: "why_rn_wmd_photos",
                  fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Closing Banner",
          fields: [
            {
              name: "closingCta",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "closingLine", type: "text", label: "Supporting Line" },
                { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: seoFields(),
        },
      ],
    },
    mobileOverridesField(),
  ],
};
