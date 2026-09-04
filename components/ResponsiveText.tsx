// Renders text that can optionally read differently on mobile — different
// copy, or just different line breaks — set per-field in a page's visual
// editor (payload/components/visual-editor/ResponsiveField.tsx) and stored
// in that page's `mobileOverrides` JSON blob. Pure CSS media-query
// toggle (.rn-desktop-only / .rn-mobile-only, defined in globals.css) so
// there's no client JS, no hydration mismatch, and no flash of the wrong
// text — both variants render on the server, only one is ever visible.
//
// Use inside an existing heading/paragraph tag, e.g.
// `<h1><ResponsiveText desktop={hero.heading} mobile={getOverride(...)} /></h1>`
// — this renders inline content, not the wrapping element itself.
function renderLines(text: string) {
  return text.split("\n").map((line, i, arr) => (
    <span key={i}>
      {line}
      {i < arr.length - 1 && <br />}
    </span>
  ));
}

export function ResponsiveText({ desktop, mobile }: { desktop: string; mobile?: string }) {
  if (!mobile) return <>{renderLines(desktop)}</>;
  return (
    <>
      <span className="rn-desktop-only">{renderLines(desktop)}</span>
      <span className="rn-mobile-only">{renderLines(mobile)}</span>
    </>
  );
}

/** Looks up one field's mobile override out of a page's mobileOverrides blob. */
export function getOverride(overrides: unknown, path: string): string | undefined {
  if (!overrides || typeof overrides !== "object") return undefined;
  const value = (overrides as Record<string, unknown>)[path];
  return typeof value === "string" && value.length > 0 ? value : undefined;
}
