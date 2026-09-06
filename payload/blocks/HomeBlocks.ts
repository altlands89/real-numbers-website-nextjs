import type { Block } from "payload";

// One Block per section currently on the Home page — same inner fields as
// the old unnamed-tabs groups had, just reshaped into Payload's native
// `blocks` field so sections are drag-reorderable in /admin. Slugs kept
// short: "home"'s own slug is tiny, so there's plenty of headroom under
// Postgres's 63-char identifier limit even with these, but short slugs are
// good practice regardless (see WhyRealNumbersGlobal's dbName note).

// HeroV2 renders the headline, the featured-photo slideshow overlay, AND
// the client-logos strip together as one visual unit — they aren't
// independently positioned on the page today, so (unlike every other
// section here) they're one Block, not three. Splitting them into
// separately-draggable blocks would be misleading: dragging "Featured
// Photo" away from "Hero" wouldn't actually move anything on the live page.
export const HeroBlock: Block = {
  slug: "hero",
  labels: { singular: "Top Banner (Hero)", plural: "Top Banners" },
  interfaceName: "HeroBlock",
  // Every field below is edited via the Home Visual Editor now (rotating
  // words in its "Manage sections" panel, everything else by clicking the
  // live canvas) — admin.hidden so the regular form can't hold a stale,
  // independently-editable copy of the same content. The block's own
  // existence/position stays editable here (add/remove/reorder a whole
  // section), since the visual editor deliberately doesn't replicate that.
  fields: [
    {
      name: "rotatingWords",
      type: "array",
      label: "Rotating Words",
      labels: { singular: "Word", plural: "Words" },
      minRows: 1,
      admin: { hidden: true, description: "Words that cycle after \"Real\" in the headline, e.g. \"Numbers.\", \"Clarity.\", \"Confidence.\"" },
      fields: [{ name: "word", type: "text", label: "Word", required: true }],
    },
    { name: "description", type: "textarea", label: "Description Text", required: true, admin: { hidden: true } },
    { name: "primaryCtaLabel", type: "text", label: "Main Button Text", defaultValue: "Let's Talk", admin: { hidden: true } },
    { name: "secondaryCtaLabel", type: "text", label: "Second Button Text", defaultValue: "Our Expertise", admin: { hidden: true } },
    {
      name: "featuredPhoto",
      type: "group",
      label: "Featured Photo Overlay",
      admin: { hidden: true },
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
    {
      name: "logosStrip",
      type: "group",
      label: "Client Logos Strip",
      admin: { hidden: true },
      fields: [
        {
          name: "ctaLabel",
          type: "text",
          label: "Button Text",
          defaultValue: "Why Real Numbers",
          admin: { description: "The logos themselves come from the Client Logos collection, not here." },
        },
      ],
    },
  ],
};

export const DifferenceBlock: Block = {
  slug: "diff",
  labels: { singular: "Numbers Section", plural: "Numbers Sections" },
  interfaceName: "DifferenceBlock",
  fields: [{ name: "heading", type: "textarea", label: "Heading", defaultValue: "The numbers that make the difference", admin: { hidden: true } }],
};

export const StatsBlock: Block = {
  slug: "stats",
  labels: { singular: "Stats", plural: "Stats" },
  interfaceName: "StatsBlock",
  // No fields of its own — renders the separate "Stats" Global (Globals →
  // Stats) wherever this block sits in the section order.
  fields: [],
};

export const DividerBlock: Block = {
  slug: "divider",
  labels: { singular: "Video Background Divider", plural: "Video Background Dividers" },
  interfaceName: "DividerBlock",
  fields: [
    {
      name: "video",
      type: "upload",
      label: "Background Video",
      relationTo: "media",
      admin: { description: "Decorative full-width strip. MP4 recommended. Plays muted, on loop, with a fixed background effect. Leave empty to show the default image instead." },
    },
  ],
};

export const CtaDarkBlock: Block = {
  slug: "cta",
  labels: { singular: "Dark Banner", plural: "Dark Banners" },
  interfaceName: "CtaDarkBlock",
  fields: [
    { name: "heading", type: "textarea", label: "Heading", defaultValue: "From ambition to tangible results", admin: { hidden: true } },
    { name: "ctaLabel", type: "text", label: "Button Text", defaultValue: "Discover more", admin: { hidden: true } },
  ],
};

export const AudienceBlock: Block = {
  slug: "audience",
  labels: { singular: "Service Areas", plural: "Service Areas" },
  interfaceName: "AudienceBlock",
  fields: [
    { name: "heading", type: "textarea", label: "Heading", defaultValue: "One partnership\nfor every stage of growth", admin: { hidden: true, description: "\"One partnership for every stage of growth\" — dark navy section." } },
    {
      name: "areas",
      type: "array",
      label: "Service Area Cards",
      labels: { singular: "Service Area", plural: "Service Areas" },
      minRows: 1,
      maxRows: 4,
      admin: { hidden: true },
      fields: [
        { name: "title", type: "text", label: "Title", required: true },
        { name: "text", type: "textarea", label: "Description", required: true },
      ],
    },
  ],
};

export const StoriesBlock: Block = {
  slug: "stories",
  labels: { singular: "Client Stories", plural: "Client Stories" },
  interfaceName: "StoriesBlock",
  fields: [
    { name: "eyebrow", type: "text", label: "Small Label Above Heading", defaultValue: "Client Stories", admin: { hidden: true, description: "Testimonials themselves come from the Testimonials collection, not here." } },
    { name: "heading", type: "textarea", label: "Heading", defaultValue: "What happens when the numbers start working for you", admin: { hidden: true } },
  ],
};

export const HOME_BLOCKS = [
  HeroBlock,
  DifferenceBlock,
  StatsBlock,
  DividerBlock,
  CtaDarkBlock,
  AudienceBlock,
  StoriesBlock,
];
