import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const ContactGlobal: GlobalConfig = {
  slug: "contact-page",
  label: "Contact",
  admin: { group: "Pages", description: "SEO and version history. Page content is edited in the Visual Editor." },
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
      type: "tabs",
      tabs: [
        {
          label: "Top Banner",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Contact" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
              ],
            },
          ],
        },
        {
          label: "Direct Contact",
          fields: [
            {
              name: "directContact",
              type: "group",
              label: false,
              admin: { hidden: true, description: "\"Prefer a direct conversation?\" links beside the form." },
              fields: [
                { name: "label", type: "text", label: "Heading Text", defaultValue: "Prefer a direct conversation?" },
                { name: "whatsappNumber", type: "text", label: "WhatsApp Number", admin: { description: "Digits only, with country code, e.g. 972523735059." } },
                { name: "email", type: "email", label: "Email Address" },
              ],
            },
          ],
        },
        {
          label: "Closing Statement",
          fields: [
            {
              name: "manifesto",
              type: "group",
              label: false,
              admin: { hidden: true },
              fields: [
                { name: "heading", type: "textarea", label: "Statement Text", required: true },
                { name: "text", type: "textarea", label: "Supporting Text" },
              ],
            },
          ],
        },
        {
          label: "SEO",
          fields: seoFields(),
        },
      ],
    },
    mobileOverridesField(),
  ],
};
