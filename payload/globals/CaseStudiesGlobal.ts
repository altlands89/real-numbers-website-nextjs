import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";

// New page requested by the client (Uzi's feedback, 2026-09): 2-3 short
// case studies with measurable results. Content below is placeholder —
// deliberately anonymized ("Series A SaaS Company" rather than a real,
// unapproved client name) since real client names/numbers need Uzi's
// sign-off before publishing; swap these for the real cases once they
// arrive. No visual editor yet — see HowWeWorkGlobal.ts's comment for why.
export const CaseStudiesGlobal: GlobalConfig = {
  slug: "case-studies-page",
  label: "Case Studies",
  admin: {
    group: "Pages",
    description: "PLACEHOLDER CONTENT — replace the case studies below with real, client-approved cases and numbers once Uzi sends them.",
  },
  hooks: {
    afterChange: [revalidateGlobalOnChange],
  },
  access: {
    read: () => true,
  },
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
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Case Studies" },
                {
                  name: "heading",
                  type: "textarea",
                  label: "Heading",
                  required: true,
                  defaultValue: "Real results, from real engagements",
                },
                {
                  name: "lede",
                  type: "textarea",
                  label: "Intro Paragraph",
                  defaultValue: "A few examples of what changes when a growing company gets a real financial partner.",
                },
              ],
            },
          ],
        },
        {
          label: "Case Studies",
          fields: [
            {
              name: "caseStudies",
              type: "array",
              label: "Case Studies",
              labels: { singular: "Case Study", plural: "Case Studies" },
              minRows: 1,
              maxRows: 6,
              defaultValue: [
                {
                  clientLabel: "Series A SaaS Company",
                  metric: "6 weeks to close-ready books",
                  description: "Came to Real Numbers mid-fundraise with financials that weren't investor-ready. We rebuilt the close process and reporting from the ground up ahead of the round.",
                },
                {
                  clientLabel: "Growth-Stage Fintech",
                  metric: "One finance team instead of three vendors",
                  description: "Consolidated bookkeeping, payroll, and fractional CFO work — previously split across three separate providers — into one accountable team.",
                },
                {
                  clientLabel: "Seed-Stage Startup",
                  metric: "First real budget and runway model",
                  description: "Went from spreadsheet guesswork to a live financial model the founders actually use to make hiring and spending decisions.",
                },
              ],
              fields: [
                { name: "clientLabel", type: "text", label: "Client / Company Description", required: true, admin: { description: "e.g. \"Series A SaaS Company\" — use an approved real name once available." } },
                { name: "metric", type: "text", label: "Headline Result", required: true, admin: { description: "The one measurable takeaway, e.g. \"6 weeks to close-ready books\"." } },
                { name: "description", type: "textarea", label: "Description", required: true },
                { name: "logo", type: "upload", label: "Company Logo (optional)", relationTo: "media", admin: { description: "Only add once the client has approved being named/shown." } },
              ],
            },
          ],
        },
        {
          label: "Closing Banner",
          fields: [
            {
              name: "closingCta",
              type: "group",
              label: false,
              fields: [
                { name: "heading", type: "textarea", label: "Heading", required: true, defaultValue: "Ready to be the next one?" },
                { name: "buttonLabel", type: "text", label: "Button Text", defaultValue: "Let's Talk" },
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
  ],
};
