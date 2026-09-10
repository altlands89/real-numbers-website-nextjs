import type { Field } from "payload";

/**
 * A single generic JSON blob storing per-field mobile-only content
 * overrides, keyed by a dot-path identifying the field it overrides (e.g.
 * "hero.heading" -> "Mobile-specific heading text", or an image field's
 * path -> a Media ID). Read/written entirely through the visual editor's
 * shared ResponsiveField / ResponsivePhotoField primitives
 * (payload/components/visual-editor/responsive.ts) — a field with no key
 * present here just falls back to its normal (desktop) value on mobile.
 *
 * Deliberately ONE shared JSON field rather than a paired "<field>Mobile"
 * field defined per text/image field: adding mobile-override support to a
 * new field this way needs zero schema change, whereas doubling every
 * field individually would mean dozens of new columns × 8 pages for a
 * capability most fields on most pages will never actually use.
 *
 * Hidden from the regular admin form on purpose — it's a machine-managed
 * blob meant to be edited only through the visual editor's per-field
 * breakpoint toggle, never by hand as raw JSON.
 */
export function mobileOverridesField(): Field {
  return {
    name: "mobileOverrides",
    type: "json",
    label: "Mobile Content Overrides",
    defaultValue: {},
    admin: { hidden: true },
  };
}
