import type { CollectionConfig } from "payload";
import { revalidateOnChange, revalidateOnDelete } from "../revalidate";

export const TeamMembers: CollectionConfig = {
  slug: "team-members",
  labels: { singular: "Team Member", plural: "Team Members" },
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "role", "leadership", "order"],
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
    { name: "name", type: "text", label: "Name", required: true },
    { name: "role", type: "text", label: "Job Title", required: true },
    { name: "photo", type: "upload", label: "Photo", relationTo: "media" },
    { name: "bio", type: "textarea", label: "Bio", required: true },
    {
      name: "education",
      type: "text",
      label: "Education",
      admin: { description: "Shown only for the two leadership cards (e.g. \"B.A. in Accounting...\")." },
    },
    {
      name: "linkedin",
      type: "text",
      label: "LinkedIn URL",
      admin: { description: "Full profile URL, e.g. https://www.linkedin.com/in/username. Shown as a LinkedIn icon button on their card — leave blank to hide it." },
    },
    { name: "leadership", type: "checkbox", label: "Show in Leadership Section?", defaultValue: false },
    { name: "order", type: "number", label: "Display Order", defaultValue: 0 },
  ],
  defaultSort: "order",
};
