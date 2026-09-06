"use client";

import React, { useEffect, useRef, useState } from "react";
import { extractText, renderTextInto, findTextTarget, getByPath } from "./domTextSync";

// The real page, rendered at its true desktop width (1440px, inside the
// caller's DeviceFrame optical-zoom wrapper) with every text/image field
// directly clickable in place — no separate schematic re-layout. Shared by
// every page's visual editor that's been migrated off the schematic canvas
// (see the visual-editor-round-3 plan in cached-whistling-hopper.md).
//
// The edit overlay itself lives inside the iframe's own document
// (components/EditorBridgeListener.tsx), not computed from this component
// across the DeviceFrame scale-transform boundary — deliberately, per that
// plan's research notes on why the parent-side-position approach other
// tools (e.g. Sanity) have to use is fragile.
export function LiveCanvas({
  pageUrl,
  refreshKey,
  title,
  data,
  onFieldCommit,
  onImageClick,
}: {
  pageUrl: string;
  refreshKey: number;
  title: string;
  // The page's current local editor state (About's `data`, etc.) — kept in
  // sync with the iframe's *text* content on every change (Undo/Redo, or a
  // Manage-lists-panel edit), same-origin DOM patch, not a re-render/reload
  // of the iframe (which would lose any other unsaved edit and require a
  // round-trip to the server). Structural changes (an added/removed array
  // row) still need Publish to actually appear here — same long-standing
  // caveat MobilePreview's own copy already states — this only re-syncs
  // the text of fields that already have a home in the current markup.
  data: unknown;
  onFieldCommit: (path: string, value: string) => void;
  onImageClick: (path: string) => void;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const roRef = useRef<ResizeObserver | null>(null);
  const [height, setHeight] = useState(900);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === "rn-editor-field-commit" && typeof e.data.path === "string") {
        onFieldCommit(e.data.path, typeof e.data.value === "string" ? e.data.value : "");
      } else if (e.data?.type === "rn-editor-field-click" && e.data.kind === "image" && typeof e.data.path === "string") {
        onImageClick(e.data.path);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onFieldCommit, onImageClick]);

  useEffect(() => () => roRef.current?.disconnect(), []);

  // Keep every visible field's text in sync with `data` — covers Undo/Redo
  // (which only change React state, never touch the iframe's own DOM) and
  // a text edit made via the Manage-lists panel below the canvas.
  useEffect(() => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc) return;
    doc.querySelectorAll<HTMLElement>("[data-field-path]").forEach((el) => {
      if (el.dataset.editing === "1") return; // an inline edit is open on this field right now — don't clobber it
      const path = el.dataset.fieldPath;
      if (!path || el.dataset.fieldKind === "image") return;
      const value = getByPath(data, path);
      if (typeof value !== "string") return;
      const target = findTextTarget(el, false); // this canvas is always the desktop viewport
      if (extractText(target) === value) return;
      renderTextInto(target, value);
    });
  }, [data]);

  const handleLoad = () => {
    const doc = iframeRef.current?.contentDocument;
    if (!doc?.documentElement) return;
    setHeight(doc.documentElement.scrollHeight);
    roRef.current?.disconnect();
    const ro = new ResizeObserver(() => setHeight(doc.documentElement.scrollHeight));
    ro.observe(doc.documentElement);
    roRef.current = ro;
  };

  const src = `${pageUrl}${pageUrl.includes("?") ? "&" : "?"}rn_editor_bridge=1&rn_editor_inline=1`;

  return (
    <iframe
      key={refreshKey}
      ref={iframeRef}
      src={src}
      onLoad={handleLoad}
      title={title}
      style={{ width: "100%", height, border: "none", display: "block", background: "#fff" }}
    />
  );
}
