import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const BrandingGlobal: GlobalConfig = {
  slug: "branding",
  admin: { description: "Site-wide logo files and footer copyright line." },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "headerLogo", type: "upload", label: "Header Logo", relationTo: "media", admin: { description: "Dark logo, shown on light backgrounds (header)." } },
    { name: "footerLogo", type: "upload", label: "Footer Logo", relationTo: "media", admin: { description: "Off-white logo, shown on the dark footer." } },
    { name: "footerCopyright", type: "text", label: "Footer Copyright Text", defaultValue: "Real Numbers. All rights reserved." },
  ],
};
