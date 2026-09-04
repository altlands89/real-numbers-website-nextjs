import type { CollectionBeforeChangeHook, CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

// The description field is optional (not every upload needs alt text
// written by hand), but a blank one is a worse default than the filename
// — this fills it in on create only, and only when left blank, so it's
// still freely editable and an intentional clear on a later edit sticks.
// generateFileData() (called before every hook in the create/update
// operation) has already populated `data.filename` by the time this
// runs, for both a regular admin upload and the visual editors' direct
// upload action, since both go through the same Local API `create` call.
const defaultAltFromFilename: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === "create" && !data.alt && typeof data.filename === "string") {
    data.alt = data.filename.replace(/\.[^./]+$/, "");
  }
  return data;
};

// Uploads collection backed by Vercel Blob (see the storage-vercel-blob
// plugin in payload.config.ts) — every replaceable image (team photos,
// client logos, hero/atmosphere photography) is uploaded here.
export const Media: CollectionConfig = {
  slug: "media",
  labels: { singular: "Image", plural: "Media Library" },
  admin: {
    useAsTitle: "alt",
    // `filename` isn't a field declared below — upload:true injects it
    // automatically — but naming it here is what makes Payload render its
    // built-in thumbnail preview (Table/DefaultCell's FileCell) next to
    // it in the list view, same as Finder's icon view, instead of the
    // plain text-only table it shows by default.
    defaultColumns: ["filename", "alt", "updatedAt"],
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
    },
  ],
  upload: true,
  hooks: {
    beforeChange: [defaultAltFromFilename],
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
};
