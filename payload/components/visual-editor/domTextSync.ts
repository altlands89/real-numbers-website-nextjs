/**
 * Shared between EditorBridgeListener.tsx (runs inside the live iframe,
 * same-origin) and LiveCanvas.tsx (runs in the parent admin page, reaching
 * into that same iframe's contentDocument — also same-origin, so this is
 * plain DOM access, not a postMessage round-trip). Kept in one file so both
 * sides agree exactly on how a field's text is represented in the DOM.
 */

/** Reconstructs the plain-text value (with real "\n"s) from an element
 *  built by components/ResponsiveText.tsx's renderLines(), which
 *  represents each line break as a literal <br> between text nodes. */
export function extractText(root: Node): string {
  let text = "";
  root.childNodes.forEach((node) => {
    if (node.nodeType === Node.TEXT_NODE) text += node.textContent ?? "";
    else if (node.nodeName === "BR") text += "\n";
    else text += extractText(node);
  });
  return text;
}

/** Inverse of extractText — rebuilds the text-node/<br> structure so the
 *  element keeps looking exactly like ResponsiveText's own output. */
export function renderTextInto(container: Element, text: string): void {
  container.textContent = "";
  const lines = text.split("\n");
  lines.forEach((line, i) => {
    container.appendChild(document.createTextNode(line));
    if (i < lines.length - 1) container.appendChild(document.createElement("br"));
  });
}

/** A field with a mobile override renders two children (.rn-desktop-only /
 *  .rn-mobile-only, only one visible via CSS) — resolves to whichever one
 *  this viewport actually shows. A field with no override yet has no such
 *  split; resolves to the element itself. */
export function findTextTarget(el: Element, isMobileViewport: boolean): Element {
  const selector = isMobileViewport ? ":scope > .rn-mobile-only" : ":scope > .rn-desktop-only";
  return el.querySelector(selector) ?? el;
}

/** Generic dot-path reader over a page's local editor state — the read-only
 *  counterpart to each editor's own explicit handleFieldCommit dispatch
 *  table. Safe to be generic (unlike the write side) since a bad path just
 *  resolves to undefined instead of risking writing to the wrong field.
 *  Matches the exact path convention already used everywhere: an array
 *  segment is looked up by its item's `id` (falling back to its index),
 *  same as every `path={`...${item.id ?? i}...`}` call site. */
export function getByPath(root: unknown, path: string): string | undefined {
  const segs = path.split(".");
  let cur: unknown = root;
  for (const seg of segs) {
    if (cur == null) return undefined;
    if (Array.isArray(cur)) {
      cur = cur.find((item, i) => String((item as { id?: unknown })?.id ?? i) === seg);
    } else if (typeof cur === "object") {
      cur = (cur as Record<string, unknown>)[seg];
    } else {
      return undefined;
    }
  }
  return typeof cur === "string" ? cur : undefined;
}
