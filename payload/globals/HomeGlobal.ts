import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { HOME_BLOCKS } from "../blocks/HomeBlocks";
import { seoFields } from "../fields/seoFields";

export const HomeGlobal: GlobalConfig = {
  slug: "home",
  label: "Home",
  admin: {
    group: "Pages",
    description: "Home page copy. Drag the section rows below to reorder the page. Testimonials, stats, and client logos are managed in their own collections.",
  },
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
      name: "sections",
      type: "blocks",
      label: "Page Sections",
      minRows: 1,
      admin: {
        description: "Drag the handle on each row to reorder sections on the live page. Header and footer aren't listed here — they're the same on every page.",
      },
      blocks: HOME_BLOCKS,
    },
    ...seoFields(),
  ],
};
