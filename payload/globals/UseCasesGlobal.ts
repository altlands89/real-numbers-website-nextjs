import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const UseCasesGlobal: GlobalConfig = {
  slug: "use-cases-page",
  label: "Use Cases",
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
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Use Cases" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "lede", type: "textarea", label: "Intro Paragraph" },
              ],
            },
          ],
        },
        {
          label: "Situations",
          fields: [
            {
              name: "atmospherePhotos",
              type: "array",
              label: "Background Photos",
              labels: { singular: "Photo", plural: "Photos" },
              admin: { hidden: true, description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
              fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
            },
            { name: "atmospherePhotoCaption", type: "text", label: "Photo Caption", defaultValue: "Every stage looks different", admin: { hidden: true } },
            { name: "situationsIntro", type: "text", label: "Intro Text Before List", defaultValue: "Some of the situations that typically bring companies to Real Numbers:", admin: { hidden: true } },
            {
              name: "situations",
              type: "array",
              label: "Customer Situations",
              labels: { singular: "Situation", plural: "Situations" },
              minRows: 1,
              maxRows: 7,
              admin: { hidden: true },
              fields: [
                { name: "question", type: "text", label: "Situation Quote", required: true, admin: { description: "Written as a founder quote, e.g. \"We're growing faster than our financial infrastructure.\"" } },
                { name: "answer", type: "textarea", label: "Our Response", required: true },
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
