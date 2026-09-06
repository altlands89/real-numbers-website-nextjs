"use client";

import { useEffect } from "react";

// Powers the visual editor's live-preview bridge
// (payload/components/visual-editor/MobilePreview.tsx and, for pages
// migrated to the real-iframe canvas, DeviceFrame's main canvas too).
// Mounted in every page via app/(frontend)/layout.tsx, but inert unless
// BOTH hold: the page is running inside an iframe, AND the URL carries
// ?rn_editor_bridge=1 — a param only those two callers' iframe src sets.
// A real visitor who happens to load that URL directly (not in an iframe)
// sees zero behavior change; `window.self === window.top` is a second,
// independent guard against the query param alone ever doing anything on
// an actual page view.
//
// Two click behaviors, chosen per-iframe by a second param:
// - `rn_editor_inline=1` (set by the real-iframe main canvas, and by
//   MobilePreview when its caller opts in via `inlineEditing`) — click
//   opens an inline textarea positioned exactly over the clicked element,
//   edited in place; committing posts {type: "rn-editor-field-commit",
//   path, value} so the parent can fold the edit into its existing
//   save-on-Publish state. Which of a field's two values (desktop/mobile
//   override) gets edited is decided by this iframe's own width — see
//   startInlineEdit — not by anything the parent tells it, so the exact
//   same script produces the right behavior in both the 1440px main
//   canvas and MobilePreview's 390px frame.
// - otherwise (every page not yet migrated) — the original behavior:
//   click posts {type: "rn-editor-field-click", path} so the parent can
//   jump/scroll to that field in its schematic canvas.
export default function EditorBridgeListener() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self === window.top) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("rn_editor_bridge") !== "1") return;
    const inlineEditing = params.get("rn_editor_inline") === "1";
    // Matches the exact CSS breakpoint ResponsiveText's own
    // .rn-desktop-only/.rn-mobile-only toggle uses (globals.css,
    // max-width: 640px) — this iframe's width never changes during its
    // life (MobilePreview is a fixed 390px frame, the main canvas is a
    // fixed 1440px one), so this only needs computing once.
    const isMobileViewport = window.innerWidth <= 640;

    // Tells every dynamic/self-animating component (RotatingWord,
    // PhotoSlideshow, CompositionDrift, Preloader, ScrollReveal) to hold
    // still — an editing surface where the content keeps moving under the
    // cursor is illegible. Set once, left set for the iframe's lifetime
    // (not cleared in this effect's cleanup) since it should stay true for
    // as long as this page is loaded inside the editor's iframe at all.
    document.documentElement.dataset.rnEditorFrozen = "1";

    let hovered: HTMLElement | null = null;

    const findFieldEl = (target: EventTarget | null): HTMLElement | null => {
      let node = target as HTMLElement | null;
      while (node && node !== document.body) {
        if (node.dataset?.fieldPath) return node;
        node = node.parentElement;
      }
      return null;
    };

    const clearHover = () => {
      if (!hovered) return;
      hovered.style.outline = "";
      hovered.style.outlineOffset = "";
      hovered.style.cursor = "";
      hovered = null;
    };

    const onMouseOver = (e: MouseEvent) => {
      const el = findFieldEl(e.target);
      if (el === hovered) return;
      clearHover();
      hovered = el;
      if (hovered) {
        hovered.style.outline = "2px solid #b85840";
        hovered.style.outlineOffset = "2px";
        hovered.style.cursor = "pointer";
      }
    };

    // --- Inline text editing (same-origin DOM injection — see the
    // visual-editor-round-3 plan for why this deliberately avoids computing
    // any position from the parent's side of the iframe boundary) ---

    // Reconstructs the plain-text value (with real "\n"s) from an element
    // built by components/ResponsiveText.tsx's renderLines(), which
    // represents each line break as a literal <br> between text nodes.
    const extractText = (root: Node): string => {
      let text = "";
      root.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) text += node.textContent ?? "";
        else if (node.nodeName === "BR") text += "\n";
        else text += extractText(node);
      });
      return text;
    };

    // Inverse of extractText — rebuilds the text-node/<br> structure so the
    // element keeps looking exactly like ResponsiveText's own output.
    const renderTextInto = (container: Element, text: string) => {
      container.textContent = "";
      const lines = text.split("\n");
      lines.forEach((line, i) => {
        container.appendChild(document.createTextNode(line));
        if (i < lines.length - 1) container.appendChild(document.createElement("br"));
      });
    };

    const startInlineEdit = (el: HTMLElement) => {
      if (el.dataset.editing === "1") return;
      // A field with a mobile override renders two children
      // (.rn-desktop-only / .rn-mobile-only, only one visible via CSS) —
      // edit whichever one this iframe's own viewport actually shows. A
      // field with no override yet has no such split; edit the element
      // itself, seeded with the (shared) desktop text — same starting
      // point ResponsiveField's own "use different text on mobile" button
      // uses when creating a new override.
      const target =
        (el.querySelector(isMobileViewport ? ":scope > .rn-mobile-only" : ":scope > .rn-desktop-only") as HTMLElement | null) ?? el;
      const currentText = extractText(target);
      const path = el.dataset.fieldPath ?? "";

      el.dataset.editing = "1";
      clearHover();

      const rect = el.getBoundingClientRect();
      const cs = window.getComputedStyle(el);
      const textarea = document.createElement("textarea");
      textarea.value = currentText;
      textarea.spellcheck = false;
      Object.assign(textarea.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        margin: "0",
        padding: "0",
        border: "1px dashed #b85840",
        borderRadius: "2px",
        outline: "none",
        resize: "none",
        overflow: "hidden",
        boxSizing: "border-box",
        background: "rgba(184, 88, 64, 0.07)",
        color: cs.color,
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        fontStyle: cs.fontStyle,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textAlign: cs.textAlign as string,
        textTransform: cs.textTransform as string,
        zIndex: "2147483647",
      } satisfies Partial<CSSStyleDeclaration>);
      document.body.appendChild(textarea);
      el.style.visibility = "hidden";

      const autoSize = () => {
        textarea.style.height = "auto";
        textarea.style.height = `${Math.max(rect.height, textarea.scrollHeight)}px`;
      };
      autoSize();
      textarea.addEventListener("input", autoSize);
      textarea.focus();
      textarea.select();

      let finished = false;
      const finish = (commit: boolean) => {
        if (finished) return;
        finished = true;
        textarea.removeEventListener("input", autoSize);
        textarea.remove();
        el.style.visibility = "";
        delete el.dataset.editing;
        if (commit) {
          const value = textarea.value;
          renderTextInto(target, value);
          window.parent.postMessage({ type: "rn-editor-field-commit", path, value }, "*");
        }
      };

      textarea.addEventListener("blur", () => finish(true));
      textarea.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          e.preventDefault();
          finish(false);
        }
      });
    };

    // Capture phase — this has to run before a wrapping <a> (e.g. the
    // leadership "View team" link) gets a chance to navigate the iframe.
    const onClick = (e: MouseEvent) => {
      const el = findFieldEl(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      if (inlineEditing && el.dataset.fieldKind !== "image") {
        startInlineEdit(el);
        return;
      }
      window.parent.postMessage(
        { type: "rn-editor-field-click", path: el.dataset.fieldPath, kind: el.dataset.fieldKind },
        "*"
      );
    };

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("click", onClick, true);
      clearHover();
    };
  }, []);

  return null;
}
