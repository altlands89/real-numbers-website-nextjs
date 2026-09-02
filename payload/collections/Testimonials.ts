import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

export const Testimonials: CollectionConfig = {
  slug: "testimonials",
  labels: { singular: "Testimonial", plural: "Testimonials" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "order"],
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
    { name: "quote", type: "textarea", label: "Quote", required: true },
    { name: "name", type: "text", label: "Name", required: true },
    { name: "role", type: "text", label: "Company / Title", admin: { description: "e.g. \"CEO, Compete\". Leave blank if none." } },
    { name: "order", type: "number", label: "Display Order", defaultValue: 0 },
  ],
  defaultSort: "order",
};
