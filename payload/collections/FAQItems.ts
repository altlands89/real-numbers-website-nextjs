import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

export const FAQItems: CollectionConfig = {
  slug: "faq-items",
  labels: { singular: "FAQ Item", plural: "FAQ Items" },
  admin: {
    useAsTitle: "question",
    defaultColumns: ["question", "order"],
  },
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateOnChange],
    afterDelete: [revalidateOnDelete],
  },
  fields: [
    { name: "question", type: "text", label: "Question", required: true },
    { name: "answer", type: "textarea", label: "Answer", required: true },
    { name: "order", type: "number", label: "Display Order", defaultValue: 0 },
  ],
  defaultSort: "order",
};
