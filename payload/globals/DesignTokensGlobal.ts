import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

const hexField = (name: string, label: string, defaultValue: string) => ({
  name,
  type: "text" as const,
  label,
  defaultValue,
  admin: { description: "Hex color, e.g. #b85840." },
  validate: (value: unknown) => {
    if (typeof value !== "string" || !/^#[0-9a-fA-F]{6}$/.test(value)) {
      return "Enter a 6-digit hex color, e.g. #b85840";
    }
    return true;
  },
});

export const DesignTokensGlobal: GlobalConfig = {
  slug: "design-tokens",
  admin: {
    description:
      "Site-wide brand colors — changes apply everywhere immediately, no redeploy needed. Handle with care: these are the core brand palette used across every page.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "colors",
      type: "group",
      fields: [
        hexField("black", "Black (primary text / dark backgrounds)", "#191716"),
        hexField("offwhite", "Off-white (primary background)", "#f0efe8"),
        hexField("red", "Red (accent / primary CTA)", "#b85840"),
        hexField("redDark", "Red — dark (hover/pressed)", "#9c4933"),
        hexField("blue", "Blue (secondary dark background)", "#353e5b"),
        hexField("blueDark", "Blue — dark (hover/pressed)", "#2a3148"),
        hexField("stone", "Stone (neutral tint / dividers)", "#cfc9bc"),
        hexField("horizon", "Horizon (muted blue accent)", "#5c6787"),
        hexField("jet", "Jet (near-black accent, hero glow)", "#0d0d0d"),
      ],
    },
  ],
};
