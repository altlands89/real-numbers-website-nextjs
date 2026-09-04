"use client";

import { useEffect } from "react";

// Powers the visual editor's "click the live render to jump to that field"
// bridge (payload/components/visual-editor/MobilePreview.tsx). Mounted in
// every page via app/(frontend)/layout.tsx, but inert unless BOTH hold: the
// page is running inside an iframe, AND the URL carries
// ?rn_editor_bridge=1 — a param only MobilePreview's own iframe src sets.
// A real visitor who happens to load that URL directly (not in an iframe)
// sees zero behavior change; `window.self === window.top` is a second,
// independent guard against the query param alone ever doing anything on
// an actual page view.
export default function EditorBridgeListener() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.self === window.top) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("rn_editor_bridge") !== "1") return;

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

    // Capture phase — this has to run before a wrapping <a> (e.g. the
    // leadership "View team" link) gets a chance to navigate the iframe.
    const onClick = (e: MouseEvent) => {
      const el = findFieldEl(e.target);
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      window.parent.postMessage({ type: "rn-editor-field-click", path: el.dataset.fieldPath }, "*");
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
