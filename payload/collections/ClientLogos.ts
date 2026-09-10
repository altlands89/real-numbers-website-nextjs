import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

export const ClientLogos: CollectionConfig = {
  slug: "client-logos",
  labels: { singular: "Client Logo", plural: "Client Logos" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "order"],
  },
  access: {
    read: () => true,
  },
  // Deleting sends the document to Trash instead of removing it right away,
  // so a wrong click is recoverable instead of permanent.
  trash: true,
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    { name: "name", type: "text", label: "Client Name", required: true },
    { name: "logo", type: "upload", label: "Logo Image", relationTo: "media", required: true },
    { name: "href", type: "text", label: "Link URL (optional)", admin: { description: "Where clicking the logo should go, if anywhere." } },
    { name: "order", type: "number", label: "Display Order", defaultValue: 0 },
  ],
  defaultSort: "order",
};
