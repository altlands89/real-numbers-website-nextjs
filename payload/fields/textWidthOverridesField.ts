import type { Field } from "payload";

/**
 * Two generic JSON blobs (desktop / mobile) storing a per-field maximum
 * width in pixels, keyed by the same dot-path convention as
 * mobileOverridesField — e.g. "hero.heading" -> 480. A field with no key
 * present here renders at its natural width (whatever the page's own CSS
 * gives it), same "absent = default" contract as mobileOverrides.
 *
 * Set from the visual editor by dragging the inline-edit textarea's own
 * resize handle (components/EditorBridgeListener.tsx) — the width the
 * textarea ends up at on commit, not a separate control, so "make the box
 * wider" directly becomes "make the live text wrap wider". Applied on the
 * live page via a small per-page <style> block generated from these two
 * blobs (lib/textWidthCSS.ts) targeting `[data-field-path="..."]` — not a
 * prop threaded through ResponsiveText, so adding this needed zero change
 * to any of that component's ~150 call sites across the 8 pages.
 *
 * Two separate blobs (not one nested {desktop,mobile} object per path) to
 * keep both sides plain flat maps — reusable as-is with the exact same
 * generic set/clear/undo/redo hook mobileOverrides already uses
 * (useMobileOverrides.ts doesn't actually care what the override values
 * are), rather than needing new merge-on-write logic for a nested shape.
 *
 * Hidden from the regular admin form — machine-managed, edited only via
 * the visual editor's resize gesture.
 */
export function textWidthOverridesFields(): Field[] {
  return [
    {
      name: "desktopWidthOverrides",
      type: "json",
      label: "Desktop Text Width Overrides",
      defaultValue: {},
      admin: { hidden: true },
    },
    {
      name: "mobileWidthOverrides",
      type: "json",
      label: "Mobile Text Width Overrides",
      defaultValue: {},
      admin: { hidden: true },
    },
  ];
}
