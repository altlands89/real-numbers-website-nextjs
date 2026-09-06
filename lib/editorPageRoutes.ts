// Maps a live route's pathname to its Visual Editor slug
// (/admin/visual-editor/<slug>) — the reverse direction of
// payload.config.ts's PAGE_ROUTE_BY_GLOBAL_SLUG (which maps a Global slug
// to its route, for Payload's own Live Preview iframe URL). Kept as a
// separate plain-data module (not imported from payload.config.ts) so it's
// safe to import from the frontend bundle too: components/
// EditorBridgeListener.tsx (site-wide, mounted on every page) uses it to
// decide whether a clicked in-canvas link should jump the admin to that
// page's own visual editor instead of navigating inside the iframe, and
// payload/components/visual-editor/LiveCanvas.tsx + MobilePreview.tsx use
// it to actually perform that jump once the click is reported up.
export const ROUTE_TO_VISUAL_EDITOR_SLUG: Record<string, string> = {
  "/": "home",
  "/about": "about",
  "/why-real-numbers": "why-real-numbers",
  "/our-expertise": "our-expertise",
  "/use-cases": "use-cases",
  "/team": "team",
  "/contact": "contact",
  "/questions-founders-ask": "questions",
};

// Normalizes a pathname the same way for both the lookup above and the
// click-detection side (a trailing slash on a non-root path shouldn't be
// treated as a different, unrecognized route).
export function normalizePathname(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname;
}
