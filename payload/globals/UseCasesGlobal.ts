import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const UseCasesGlobal: GlobalConfig = {
  slug: "use-cases-page",
  label: "Use Cases",
  admin: { group: "Pages", description: "Use Cases page copy." },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
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
              admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
              fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
            },
            { name: "atmospherePhotoCaption", type: "text", label: "Photo Caption", defaultValue: "Every stage looks different" },
            { name: "situationsIntro", type: "text", label: "Intro Text Before List", defaultValue: "Some of the situations that typically bring companies to Real Numbers:" },
            {
              name: "situations",
              type: "array",
              label: "Customer Situations",
              labels: { singular: "Situation", plural: "Situations" },
              minRows: 1,
              maxRows: 7,
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
              fields: [
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
