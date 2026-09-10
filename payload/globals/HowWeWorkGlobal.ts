import type { GlobalConfig } from "payload";
import { revalidateGlobalOnChange } from "../revalidate";
import { seoFields } from "../fields/seoFields";

// New page requested by the client (Uzi's feedback, 2026-09): explain the
// engagement model — how working with Real Numbers actually starts and
// unfolds — without publishing a price list. Content is placeholder,
// written to be presentable as-is (not a visible "TODO"), until Uzi sends
// the real step-by-step description; swap the defaultValues below once
// that arrives. No visual editor yet — plain regular-form fields, same as
// every page was before the visual editor initiative — so this can get a
// spatial editor later with zero schema change if that becomes worth it.
export const HowWeWorkGlobal: GlobalConfig = {
  slug: "how-we-work-page",
  label: "How We Work",
  admin: {
    group: "Pages",
    description: "PLACEHOLDER CONTENT — replace the process steps below once Uzi sends the real engagement-process description.",
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
                { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "How We Work" },
                {
                  name: "heading",
                  type: "textarea",
                  label: "Heading",
                  required: true,
                  defaultValue: "A clear path from first conversation to full financial partnership",
                },
                {
                  name: "lede",
                  type: "textarea",
                  label: "Intro Paragraph",
                  defaultValue: "No surprises, no long onboarding limbo. Here's how an engagement with Real Numbers starts, and how it grows from there.",
                },
              ],
            },
          ],
        },
        {
          label: "Process Steps",
          fields: [
            {
              name: "stepsIntro",
              type: "text",
              label: "Intro Text Before Steps",
              defaultValue: "How an engagement comes together, step by step:",
            },
            {
              name: "steps",
              type: "array",
              label: "Process Steps",
              labels: { singular: "Step", plural: "Steps" },
              minRows: 1,
              maxRows: 6,
              defaultValue: [
                {
                  title: "Discovery Call",
                  text: "We start with a conversation about where your business stands today, what's keeping you up at night, and what real financial partnership could unlock.",
                },
                {
                  title: "Scoping the Engagement",
                  text: "Every company's needs are different. We define the right scope together — from close support to a full outsourced finance function — based on your stage and goals.",
                },
                {
                  title: "Onboarding",
                  text: "We get access to your systems, learn your business, and build the financial foundation — reporting, processes, cadence — before day one of active work.",
                },
                {
                  title: "Ongoing Partnership",
                  text: "From there, it's a standing relationship: regular reporting, strategic input, and a team that scales with you as you grow.",
                },
              ],
              fields: [
                { name: "title", type: "text", label: "Step Title", required: true },
                { name: "text", type: "textarea", label: "Step Description", required: true },
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
                { name: "heading", type: "textarea", label: "Heading", required: true, defaultValue: "Ready to talk about how we'd work together?" },
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
