import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

// Uploads collection backed by Vercel Blob (see the storage-vercel-blob
// plugin in payload.config.ts) — every replaceable image (team photos,
// client logos, hero/atmosphere photography) is uploaded here.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Media Library" },
  admin: {
    useAsTitle: "alt",
  },
  access: {
    read: () => true,
  },
  // Deleting sends the file to Trash instead of removing it right away,
  // so a wrong click is recoverable instead of permanent.
  trash: true,
  fields: [
    {
      name: "alt",
      type: "text",
      label: "Description (for accessibility)",
      required: true,
    },
  ],
  upload: true,
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
};
