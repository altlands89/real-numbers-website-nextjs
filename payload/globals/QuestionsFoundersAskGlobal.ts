import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const QuestionsFoundersAskGlobal: GlobalConfig = {
  slug: "questions-founders-ask-page",
  label: "Questions Founders Ask",
  admin: { group: "Pages", description: "Questions Founders Ask page copy. The Q&A list itself lives in the FAQ Items collection." },
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
      admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
      fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
    },
  ],
};
