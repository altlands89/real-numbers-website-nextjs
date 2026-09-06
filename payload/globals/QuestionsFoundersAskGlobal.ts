import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const QuestionsFoundersAskGlobal: GlobalConfig = {
  slug: "questions-founders-ask-page",
  label: "Questions Founders Ask",
  admin: { group: "Pages", description: "SEO and version history. Page content is edited in the Visual Editor; the Q&A list lives in the FAQ Items collection." },
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
      name: "hero",
      type: "group",
      label: "Top Banner",
      admin: { hidden: true },
      fields: [
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Questions Founders Ask" },
        { name: "heading", type: "textarea", label: "Heading", required: true },
      ],
    },
    {
      name: "atmospherePhotos",
      type: "array",
      label: "Background Photos",
      labels: { singular: "Photo", plural: "Photos" },
      admin: { hidden: true, description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
      fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
    },
    ...seoFields(),
    mobileOverridesField(),
  ],
};
