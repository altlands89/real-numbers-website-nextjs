import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const LayoutMotionGlobal: GlobalConfig = {
  slug: "layout-motion",
  label: "Layout & Motion",
  admin: {
    group: "Site Design",
    description: "Site-wide structural and motion controls. Each of these affects every page at once.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "containerWidth",
      type: "select",
      label: "Site Width (desktop)",
      defaultValue: "92",
      admin: {
        description: "How wide the main content area is on desktop screens. Doesn't affect mobile.",
        components: { Field: "@/payload/components/SliderField#SliderField" },
      },
      options: [
        { label: "Narrower (80%)", value: "80" },
        { label: "Narrow (86%)", value: "86" },
        { label: "Default (92%)", value: "92" },
        { label: "Wide (96%)", value: "96" },
        { label: "Full width (100%)", value: "100" },
      ],
    },
    {
      name: "cornerRoundness",
      type: "select",
      label: "Corner Roundness",
      defaultValue: "100",
      admin: {
        description: "How rounded cards, photos, and form fields are. Buttons stay fully round regardless — that's a deliberate brand shape, not affected by this.",
        components: { Field: "@/payload/components/SliderField#SliderField" },
      },
      options: [
        { label: "Sharp (0%)", value: "0" },
        { label: "Slight (50%)", value: "50" },
        { label: "Default (100%)", value: "100" },
        { label: "Soft (150%)", value: "150" },
        { label: "Very Round (200%)", value: "200" },
      ],
    },
    {
      name: "spacingDensity",
      type: "select",
      label: "Spacing Density",
      defaultValue: "100",
      admin: {
        description: "How much breathing room is between sections and elements site-wide.",
        components: { Field: "@/payload/components/SliderField#SliderField" },
      },
      options: [
        { label: "Compact (80%)", value: "80" },
        { label: "Cozy (90%)", value: "90" },
        { label: "Default (100%)", value: "100" },
        { label: "Airy (115%)", value: "115" },
        { label: "Spacious (130%)", value: "130" },
      ],
    },
    {
      name: "motionSpeed",
      type: "select",
      label: "Animation Speed",
      defaultValue: "100",
      admin: {
        description: "How fast hover effects, reveals, and transitions play across the site.",
        components: { Field: "@/payload/components/SliderField#SliderField" },
      },
      options: [
        { label: "Slower / Relaxed (150%)", value: "150" },
        { label: "Slow (125%)", value: "125" },
        { label: "Default (100%)", value: "100" },
        { label: "Fast (75%)", value: "75" },
        { label: "Snappy (50%)", value: "50" },
      ],
    },
  ],
};
