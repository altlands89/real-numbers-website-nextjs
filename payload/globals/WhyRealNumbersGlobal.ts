import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const WhyRealNumbersGlobal: GlobalConfig = {
  slug: "why-real-numbers-page",
  admin: { description: "Why Real Numbers page copy." },
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
        { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Why Real Numbers" },
        { name: "heading", type: "textarea", label: "Heading", required: true },
        {
          name: "ledeParagraphs",
          type: "array",
          label: "Intro Paragraphs",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          minRows: 1,
          maxRows: 2,
          fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
        },
      ],
    },
    {
      name: "whyChooseUs",
      type: "group",
      label: "\"Why Choose Us\" Section",
      fields: [
        { name: "heading", type: "text", label: "Heading", defaultValue: "Why companies choose us" },
        {
          name: "paragraphs",
          type: "array",
          label: "Paragraphs",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          minRows: 1,
          fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
        },
      ],
    },
    {
      name: "valueProps",
      type: "array",
      label: "Feature Cards",
      labels: { singular: "Feature Card", plural: "Feature Cards" },
      minRows: 1,
      maxRows: 4,
      admin: { description: "The 4-card grid (Startup Mindset, Strategic Thinking, Hands-on Partnership, Built for Long-Term Growth)." },
      fields: [
        { name: "title", type: "text", label: "Title", required: true },
        { name: "paragraph1", type: "textarea", label: "First Paragraph", required: true },
        { name: "paragraph2", type: "textarea", label: "Second Paragraph" },
      ],
    },
    {
      name: "whatMakesDifferent",
      type: "group",
      label: "\"What Makes Us Different\" Section",
      fields: [
        { name: "heading", type: "textarea", label: "Heading", defaultValue: "What makes the partnership different" },
        {
          name: "paragraphs",
          type: "array",
          label: "Paragraphs",
          labels: { singular: "Paragraph", plural: "Paragraphs" },
          minRows: 1,
          fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }],
        },
        {
          name: "photos",
          type: "array",
          label: "Photos",
          labels: { singular: "Photo", plural: "Photos" },
          admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
          fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
        },
      ],
    },
    {
      name: "closingCta",
      type: "group",
      label: "Closing Banner Section",
      fields: [
        { name: "heading", type: "textarea", label: "Heading", required: true },
        { name: "closingLine", type: "text", label: "Supporting Line" },
        { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
      ],
    },
  ],
};
