import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const TeamPageGlobal: GlobalConfig = {
  slug: "team-page",
  admin: { description: "Team page copy. The roster itself lives in the Team Members collection." },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "hero",
      type: "group",
      label: "Top Banner",
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Our Team" },
        { name: "heading", type: "textarea", label: "Heading", required: true },
        { name: "lede", type: "textarea", label: "Intro Paragraph" },
      ],
    },
    { name: "sectionHeading", type: "text", label: "\"The Team\" Section Title", defaultValue: "The Team" },
    {
      name: "closingCta",
      type: "group",
      label: "Closing Banner Section",
      fields: [
        { name: "heading", type: "textarea", label: "Heading", required: true },
        { name: "closingLine", type: "textarea", label: "Supporting Line" },
        { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
      ],
    },
  ],
};
