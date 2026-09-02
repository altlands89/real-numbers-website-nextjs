import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const ContactGlobal: GlobalConfig = {
  slug: "contact-page",
  admin: { description: "Contact page copy." },
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
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Contact" },
        { name: "heading", type: "textarea", label: "Heading", required: true },
      ],
    },
    {
      name: "directContact",
      type: "group",
      label: "Direct Contact Section",
      admin: { description: "\"Prefer a direct conversation?\" links beside the form." },
      fields: [
        { name: "label", type: "text", label: "Heading Text", defaultValue: "Prefer a direct conversation?" },
        { name: "whatsappNumber", type: "text", label: "WhatsApp Number", admin: { description: "Digits only, with country code, e.g. 972523735059." } },
        { name: "email", type: "email", label: "Email Address" },
      ],
    },
    {
      name: "manifesto",
      type: "group",
      label: "Closing Statement Section",
      fields: [
        { name: "heading", type: "textarea", label: "Statement Text", required: true },
        { name: "text", type: "textarea", label: "Supporting Text" },
      ],
    },
  ],
};
