"use client";

import React, { useEffect, useState } from "react";

// A real, accurate mobile preview — an iframe of the actual live page at a
// phone-width viewport (390px, matching Payload's own Live Preview mobile
// breakpoint), not a simulation inside the hand-built schematic canvas.
// Deliberately not trying to fake mobile CSS behavior in the canvas above:
// the live stylesheet swaps to genuinely different rules at several
// breakpoints (not just a smaller number plugged into the same formula),
// so a width-only toggle in the schematic would risk showing something
// that doesn't match how mobile actually renders. This editor's own Save
// already publishes immediately (no separate draft-preview gap), so
// refreshing the iframe right after a successful publish shows the exact
// live mobile page.
const FRAME_WIDTH = 390;
const FRAME_HEIGHT = 780;

export function MobilePreview({
  pageUrl,
  refreshKey,
  onFieldSelect,
}: {
  pageUrl: string;
  refreshKey: number;
  // Called with a field's dot-path when the editor-bridge script inside the
  // iframe (components/EditorBridgeListener.tsx) reports a click on the
  // live render — lets the caller scroll to and focus that field's input.
  onFieldSelect?: (path: string) => void;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!onFieldSelect) return;
    const onMessage = (e: MessageEvent) => {
      if (e.data?.type === "rn-editor-field-click" && typeof e.data.path === "string") {
        onFieldSelect(e.data.path);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onFieldSelect]);

  // rn_editor_bridge=1 is what tells EditorBridgeListener (inert on every
  // normal page view) to actually attach its click/hover handlers.
  const frameSrc = `${pageUrl}${pageUrl.includes("?") ? "&" : "?"}rn_editor_bridge=1`;

  return (
    <div style={{ marginTop: 10 }}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        style={{
          padding: "7px 14px",
          borderRadius: "var(--style-radius-m, 8px)",
          border: "1px solid var(--theme-elevation-150)",
          background: "var(--theme-elevation-0)",
          color: "var(--theme-text)",
          fontWeight: 600,
          fontSize: 12,
          cursor: "pointer",
        }}
      >
        {open ? "Hide mobile preview" : "📱 Show mobile preview"}
      </button>

      {open && (
        <div style={{ marginTop: 10 }}>
          <p style={{ fontSize: 11, color: "var(--theme-elevation-500)", maxWidth: 480, marginBottom: 8 }}>
            The real live page at a phone-width viewport — refreshes automatically after you publish
            changes. Not a live keystroke-by-keystroke preview: publish first to see an edit reflected here.
            {onFieldSelect && " Click any text below to jump to its field above."}
          </p>
          <div
            style={{
              width: FRAME_WIDTH,
              height: FRAME_HEIGHT,
              border: "8px solid #241e1c",
              borderRadius: 28,
              overflow: "hidden",
              boxShadow: "0 12px 40px -20px rgba(36,30,28,0.5)",
            }}
          >
            <iframe
              key={refreshKey}
              src={frameSrc}
              title="Mobile preview"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
