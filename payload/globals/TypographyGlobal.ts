import type { Field, GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

const WEIGHT_OPTIONS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "SemiBold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "ExtraBold", value: "800" },
];

function styleFields(defaults: { lineHeight: number; letterSpacing: number; weight: string }): Field[] {
  return [
    {
      name: "sizeScale",
      type: "select",
      label: "Size",
      defaultValue: "3",
      admin: {
        description: "1 = smallest, 3 = default (current site design), 5 = largest. Scales the existing responsive size up or down — stays fluid on mobile either way.",
        components: { Field: "@/payload/components/SliderField#SliderField" },
      },
      options: [
        { label: "1 — Smallest", value: "1" },
        { label: "2 — Small", value: "2" },
        { label: "3 — Default", value: "3" },
        { label: "4 — Large", value: "4" },
        { label: "5 — Largest", value: "5" },
      ],
    },
    {
      name: "lineHeight",
      type: "number",
      label: "Line Spacing",
      defaultValue: defaults.lineHeight,
      admin: { description: `Space between lines of text. Default: ${defaults.lineHeight}. Lower = tighter, higher = airier.`, step: 0.05 },
    },
    {
      name: "letterSpacing",
      type: "number",
      label: "Letter Spacing",
      defaultValue: defaults.letterSpacing,
      admin: { description: `Space between letters, in em. Default: ${defaults.letterSpacing}. Negative = tighter, positive = wider.`, step: 0.005 },
    },
    {
      name: "weight",
      type: "select",
      label: "Weight",
      defaultValue: defaults.weight,
      options: WEIGHT_OPTIONS,
    },
  ];
}

export const TypographyGlobal: GlobalConfig = {
  slug: "typography",
  label: "Typography",
  admin: {
    group: "Site Design",
    description:
      "Shared text styles used everywhere on the site — change one here and every heading/paragraph using it updates together, so the site stays visually consistent. These aren't per-field overrides on purpose: individually resizing every single paragraph would make the site look inconsistent fast.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "h1",
      type: "group",
      label: "Main Heading (H1) — page hero titles",
      fields: styleFields({ lineHeight: 0.92, letterSpacing: -0.035, weight: "800" }),
    },
    {
      name: "h2",
      type: "group",
      label: "Section Heading (H2)",
      fields: styleFields({ lineHeight: 1, letterSpacing: -0.028, weight: "700" }),
    },
    {
      name: "h3",
      type: "group",
      label: "Card / Item Title (H3)",
      fields: styleFields({ lineHeight: 1.15, letterSpacing: -0.016, weight: "700" }),
    },
    {
      name: "eyebrow",
      type: "group",
      label: "Small Label (above headings)",
      fields: styleFields({ lineHeight: 1.333, letterSpacing: 0.14, weight: "700" }),
    },
    {
      name: "lede",
      type: "group",
      label: "Large Intro Text",
      fields: styleFields({ lineHeight: 1.5, letterSpacing: 0, weight: "400" }),
    },
    {
      name: "body",
      type: "group",
      label: "Body Text (default paragraphs)",
      fields: styleFields({ lineHeight: 1.625, letterSpacing: 0, weight: "400" }),
    },
  ],
};
