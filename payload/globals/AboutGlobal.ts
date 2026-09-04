import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";
import { mobileOverridesField } from "../fields/mobileOverridesField";

export const AboutGlobal: GlobalConfig = {
  slug: "about-page",
  label: "About",
  admin: { group: "Pages", description: "About page copy." },
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
              fields: [
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "About Real Numbers" },
                { name: "heading", type: "textarea", label: "Heading", required: true },
                { name: "lede", type: "textarea", label: "Intro Paragraph", required: true },
              ],
            },
          ],
        },
        {
          label: "Our Story",
          fields: [
            {
              name: "ourStory",
              type: "group",
              label: false,
              fields: [
                { name: "heading", type: "text", label: "Heading", defaultValue: "Our Story" },
                { name: "paragraphs", type: "array", label: "Paragraphs", labels: { singular: "Paragraph", plural: "Paragraphs" }, minRows: 1, fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }] },
                {
                  name: "photos",
                  type: "array",
                  label: "Photos",
                  labels: { singular: "Photo", plural: "Photos" },
                  admin: { description: "Upload one photo for a static image, or several for an auto-playing fading slideshow." },
                  fields: [{ name: "image", type: "upload", label: "Photo", relationTo: "media", required: true }],
                },
                { name: "photoCaption", type: "text", label: "Photo Caption", defaultValue: "Where the conversations happen" },
              ],
            },
          ],
        },
        {
          label: "What We Believe",
          fields: [
            {
              name: "whatWeBelieve",
              type: "group",
              label: false,
              fields: [
                { name: "heading", type: "text", label: "Heading", defaultValue: "What We Believe" },
                { name: "intro", type: "textarea", label: "Intro Paragraph" },
                {
                  name: "principles",
                  type: "array",
                  label: "Principles",
                  labels: { singular: "Principle", plural: "Principles" },
                  minRows: 1,
                  maxRows: 4,
                  fields: [
                    { name: "lead", type: "text", label: "Short Title", required: true },
                    { name: "text", type: "textarea", label: "Description", required: true },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: "How We Work",
          fields: [
            {
              name: "howWeWork",
              type: "group",
              label: false,
              fields: [
                { name: "heading", type: "text", label: "Heading", defaultValue: "How We Work" },
                { name: "paragraphs", type: "array", label: "Paragraphs", labels: { singular: "Paragraph", plural: "Paragraphs" }, minRows: 1, fields: [{ name: "text", type: "textarea", label: "Paragraph", required: true }] },
              ],
            },
          ],
        },
        {
          label: "Leadership",
          fields: [
            {
              name: "leadership",
              type: "group",
              label: false,
              admin: { description: "Short-form bios for the About page — the full-length bios live on the Team page (Team Members collection)." },
              fields: [
                { name: "heading", type: "text", label: "Heading", defaultValue: "Leadership" },
                {
                  name: "cards",
                  type: "array",
                  label: "Leadership Profiles",
                  labels: { singular: "Profile", plural: "Profiles" },
                  minRows: 1,
                  maxRows: 2,
                  fields: [
                    { name: "name", type: "text", label: "Name", required: true },
                    { name: "role", type: "text", label: "Job Title", required: true },
                    { name: "bio", type: "textarea", label: "Bio", required: true },
                  ],
                },
                { name: "note", type: "textarea", label: "Closing Note" },
                { name: "teamLinkLabel", type: "text", label: "\"View Team\" Link Text", defaultValue: "Meet the full team" },
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
