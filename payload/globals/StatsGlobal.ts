import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const StatsGlobal: GlobalConfig = {
  slug: "stats",
  admin: { description: "Homepage \"Proof in numbers\" section." },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    { name: "heading", type: "text", label: "Section Title", defaultValue: "Proof in numbers" },
    {
      name: "stats",
      type: "array",
      label: "Statistics",
      labels: { singular: "Statistic", plural: "Statistics" },
      minRows: 1,
      maxRows: 4,
      fields: [
        { name: "label", type: "text", label: "Stat Label", required: true },
        { name: "value", type: "number", label: "Number", required: true },
        {
          name: "color",
          type: "select",
          label: "Accent Color",
          required: true,
          defaultValue: "red",
          options: ["red", "blue", "jet", "horizon"],
        },
      ],
    },
  ],
};
