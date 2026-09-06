"use client";

import React, { useEffect, useRef, useState } from "react";

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
  onFieldCommit,
  inlineEditing,
}: {
  pageUrl: string;
  refreshKey: number;
  // Called with a field's dot-path when the editor-bridge script inside the
  // iframe (components/EditorBridgeListener.tsx) reports a click on the
  // live render — lets the caller scroll to and focus that field's input.
  // Ignored once `inlineEditing` is set (see below) — that mode edits in
  // place instead and never sends this message for a text field.
  onFieldSelect?: (path: string) => void;
  // Called with {path, value} once an in-place edit is committed — only
  // fires when `inlineEditing` is set.
  onFieldCommit?: (path: string, value: string) => void;
  // Opt-in per caller (About only, for now — see the visual-editor-round-3
  // plan in cached-whistling-hopper.md): brings the same click-to-edit-in-
  // place behavior already shipped on the main desktop canvas to this
  // 390px frame too. A field edited here always writes its *mobile*
  // override, never the shared desktop value — EditorBridgeListener
  // decides which by this iframe's own width, not by anything passed in.
  inlineEditing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!onFieldSelect && !onFieldCommit) return;
    const onMessage = (e: MessageEvent) => {
      // Ignore messages from any other bridge iframe on the same page
      // (e.g. About's main live canvas) — both post the same message
      // shapes to window.parent.
      if (e.source !== iframeRef.current?.contentWindow) return;
      if (e.data?.type === "rn-editor-field-click" && typeof e.data.path === "string") {
        onFieldSelect?.(e.data.path);
      } else if (e.data?.type === "rn-editor-field-commit" && typeof e.data.path === "string") {
        onFieldCommit?.(e.data.path, typeof e.data.value === "string" ? e.data.value : "");
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [onFieldSelect, onFieldCommit]);

  // rn_editor_bridge=1 is what tells EditorBridgeListener (inert on every
  // normal page view) to actually attach its click/hover handlers.
  const frameSrc = `${pageUrl}${pageUrl.includes("?") ? "&" : "?"}rn_editor_bridge=1${inlineEditing ? "&rn_editor_inline=1" : ""}`;

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
            {inlineEditing
              ? " Click any text or image to edit it here — edits made here are mobile-only."
              : onFieldSelect && " Click any text below to jump to its field above."}
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
              ref={iframeRef}
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
