// Renders a page's desktopWidthOverrides/mobileWidthOverrides blobs
// (payload/fields/textWidthOverridesField.ts) into a plain CSS string, for
// a single <style> tag each page renders once. Targets the same
// `[data-field-path]` attribute ResponsiveText.tsx already puts on every
// editable field, so this needed no change to ResponsiveText itself or its
// ~150 call sites — the override is a pure CSS layer on top.
//
// `display:inline-block` is required alongside `max-width`: ResponsiveText
// wraps its output in an inline <span>, and max-width has no effect on an
// inline element's line-wrapping in CSS — inline-block is what makes the
// wrap width actually take hold, while the span still flows and aligns
// like the surrounding text (matches its heading/paragraph's own
// text-align, doesn't force it onto its own line).
const MOBILE_BREAKPOINT = 640;

function escapeAttrValue(path: string): string {
  return path.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

export function buildTextWidthCSS(
  desktopOverrides: unknown,
  mobileOverrides: unknown,
): string {
  let css = "";
  if (desktopOverrides && typeof desktopOverrides === "object") {
    for (const [path, value] of Object.entries(desktopOverrides as Record<string, unknown>)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
      css += `[data-field-path="${escapeAttrValue(path)}"]{display:inline-block;max-width:${Math.round(value)}px;}`;
    }
  }
  if (mobileOverrides && typeof mobileOverrides === "object") {
    let mobileCss = "";
    for (const [path, value] of Object.entries(mobileOverrides as Record<string, unknown>)) {
      if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) continue;
      mobileCss += `[data-field-path="${escapeAttrValue(path)}"]{display:inline-block;max-width:${Math.round(value)}px;}`;
    }
    if (mobileCss) css += `@media (max-width:${MOBILE_BREAKPOINT}px){${mobileCss}}`;
  }
  return css;
}
