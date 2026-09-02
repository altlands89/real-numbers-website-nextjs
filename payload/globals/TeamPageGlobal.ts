import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const TeamPageGlobal: GlobalConfig = {
  slug: "team-page",
  label: "Team",
  admin: { group: "Pages", description: "Team page copy. The roster itself lives in the Team Members collection." },
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
              fields: [
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Our Team" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "lede", type: "textarea", label: "Intro Paragraph" },
              ],
            },
          ],
        },
        {
          label: "Team List",
          fields: [
            { name: "sectionHeading", type: "text", label: "\"The Team\" Section Title", defaultValue: "The Team" },
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
                { name: "closingLine", type: "textarea", label: "Supporting Line" },
                { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
