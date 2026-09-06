import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const TeamPageGlobal: GlobalConfig = {
  slug: "team-page",
  label: "Team",
  admin: { group: "Pages", description: "SEO and version history. Page content is edited in the Visual Editor; the roster lives in the Team Members collection." },
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
            { name: "sectionHeading", type: "text", label: "\"The Team\" Section Title", defaultValue: "The Team", admin: { hidden: true } },
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
