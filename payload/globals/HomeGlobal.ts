import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";

export const HomeGlobal: GlobalConfig = {
  slug: "home",
  label: "Home",
  admin: {
    group: "Pages",
    description: "Home page copy. Testimonials, stats, and client logos are managed in their own collections.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      // Unnamed tab — purely a UI grouping, doesn't nest the underlying
      // data (each tab's fields still save at the same path as before).
      type: "tabs",
      tabs: [
        {
          label: "Top Banner",
          fields: [
            {
              name: "hero",
              type: "group",
              label: false,
              fields: [
                {
                  name: "rotatingWords",
                  type: "array",
                  label: "Rotating Words",
                  labels: { singular: "Word", plural: "Words" },
                  minRows: 1,
                  admin: { description: "Words that cycle after \"Real\" in the headline, e.g. \"Numbers.\", \"Clarity.\", \"Confidence.\"" },
                  fields: [{ name: "word", type: "text", label: "Word", required: true }],
                },
                { name: "description", type: "textarea", label: "Description Text", required: true },
                { name: "primaryCtaLabel", type: "text", label: "Main Button Text", defaultValue: "Let's Talk" },
                { name: "secondaryCtaLabel", type: "text", label: "Second Button Text", defaultValue: "Our Expertise" },
              ],
            },
          ],
        },
        {
          label: "Featured Photo",
          fields: [
            {
              name: "featuredPhoto",
              type: "group",
              label: false,
              admin: { description: "Overlay on the rotating photo slideshow." },
              fields: [
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "A partnership that works" },
                { name: "ctaLabel", type: "text", label: "Button Text", defaultValue: "Our approach" },
                {
                  name: "images",
                  type: "array",
                  label: "Slideshow Photos",
                  labels: { singular: "Photo", plural: "Photos" },
                  admin: { description: "Photos used in the rotating slideshow behind the heading." },
                  fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
                },
              ],
            },
          ],
        },
        {
          label: "Client Logos",
          fields: [
            {
              name: "logosStrip",
              type: "group",
              label: false,
              admin: { description: "Client logos come from the Client Logos collection." },
              fields: [{ name: "ctaLabel", type: "text", label: "Button Text", defaultValue: "Why Real Numbers" }],
            },
          ],
        },
        {
          label: "Numbers Section",
          fields: [
            {
              name: "difference",
              type: "group",
              label: false,
              fields: [{ name: "heading", type: "textarea", label: "Heading", defaultValue: "The numbers that make the difference" }],
            },
          ],
        },
        {
          label: "Dark Banner",
          fields: [
            {
              name: "ctaDark",
              type: "group",
              label: false,
              fields: [
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "From ambition to tangible results" },
                { name: "ctaLabel", type: "text", label: "Button Text", defaultValue: "Discover more" },
              ],
            },
          ],
        },
        {
          label: "Service Areas",
          fields: [
            {
              name: "audience",
              type: "group",
              label: false,
              admin: { description: "\"One partnership for every stage of growth\" — dark navy section." },
              fields: [
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "One partnership\nfor every stage of growth" },
                {
                  name: "areas",
                  type: "array",
                  label: "Service Area Cards",
                  labels: { singular: "Service Area", plural: "Service Areas" },
                  minRows: 1,
                  maxRows: 4,
                  fields: [
                    { name: "title", type: "text", label: "Title", required: true },
                    { name: "text", type: "textarea", label: "Description", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "Client Stories",
          fields: [
            {
              name: "stories",
              type: "group",
              label: false,
              admin: { description: "Testimonials come from the Testimonials collection." },
              fields: [
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Client Stories" },
                { name: "heading", type: "textarea", label: "Heading", defaultValue: "What happens when the numbers start working for you" },
              ],
            },
          ],
        },
      ],
    },
  ],
};
