import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const OurExpertiseGlobal: GlobalConfig = {
  slug: "our-expertise-page",
  label: "Our Expertise",
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
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Our Expertise" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "ledeParagraphs", type: "array", label: "Intro Paragraphs", labels: { singular: "Paragraph", plural: "Paragraphs" }, minRows: 1, maxRows: 2, fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }] },
              ],
            },
          ],
        },
        {
          label: "Expertise Areas",
          fields: [
            {
              name: "areas",
              type: "array",
              label: "Expertise Areas",
              labels: { singular: "Expertise Area", plural: "Expertise Areas" },
              minRows: 1,
              maxRows: 4,
              admin: { hidden: true, description: "Financial Operations, Strategic Finance, Fundraising & Growth, Business Performance." },
              fields: [
                { name: "title", type: "text", label: "Title", required: true },
                { name: "tagline", type: "text", label: "Tagline", required: true },
                { name: "paragraphs", type: "array", label: "Paragraphs", labels: { singular: "Paragraph", plural: "Paragraphs" }, minRows: 1, fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }] },
                {
                  name: "services",
                  type: "array",
                  label: "Service Tags",
                  labels: { singular: "Service Tag", plural: "Service Tags" },
                  minRows: 1,
                  admin: { description: "The pill list under each area (e.g. \"Bookkeeping\", \"Payroll\")." },
                  fields: [{ name: "label", type: "text", label: "Tag Text", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Integrated Partnership",
          fields: [
            {
              name: "integrated",
              type: "group",
              label: false,
              admin: { hidden: true, description: "\"One integrated financial partnership\" closing section." },
              fields: [
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "One integrated financial partnership" },
                { name: "text", type: "textarea", label: "Paragraph" },
                {
                  name: "photos",
                  type: "array",
                  label: "Photos",
                  labels: { singular: "Photo", plural: "Photos" },
                  admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
                  fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
                },
                { name: "photoCaption", type: "text", label: "Photo Caption", defaultValue: "The work behind the clarity" },
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
                { name: "closingLine", type: "textarea", label: "Supporting Line" },
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
