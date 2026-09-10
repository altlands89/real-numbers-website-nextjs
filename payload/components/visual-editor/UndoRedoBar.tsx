"use client";

import React, { useEffect } from "react";

/** Undo/Redo buttons + Ctrl/Cmd+Z / Ctrl/Cmd+Shift+Z (and Ctrl+Y) keyboard
 *  shortcuts, shared by every visual editor. Session-only — see
 *  useCloneState/useMobileOverrides for why whole-snapshot history is the
 *  right call for these small documents, and useCombinedHistory for how
 *  an editor's separate state slices share one Undo/Redo. */
export function UndoRedoBar({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const mod = e.metaKey || e.ctrlKey;
      if (!mod) return;
      // Don't hijack Ctrl/Cmd+Z while the cursor is in a plain form field
      // (e.g. the LinkedIn/WhatsApp/email inputs in a "Manage lists"
      // panel) — the browser's own native undo for that one field is what
      // a user reaching for Ctrl+Z there actually wants. Without this, an
      // in-progress typo fix instead reverts the whole document's last
      // change (a photo removed ten minutes ago, say), which is much more
      // surprising than "my last keystroke didn't undo."
      const target = document.activeElement as HTMLElement | null;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || target?.isContentEditable) return;
      const key = e.key.toLowerCase();
      if (key === "z" && e.shiftKey) {
        e.preventDefault();
        onRedo();
      } else if (key === "z") {
        e.preventDefault();
        onUndo();
      } else if (key === "y") {
        e.preventDefault();
        onRedo();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onUndo, onRedo]);

  const btn = (enabled: boolean): React.CSSProperties => ({
    border: "1px solid var(--theme-elevation-150)",
    background: "var(--theme-elevation-0)",
    color: enabled ? "var(--theme-text)" : "var(--theme-elevation-350)",
    borderRadius: "var(--style-radius-s, 4px)",
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: enabled ? "pointer" : "default",
  });

  return (
    <div style={{ display: "flex", gap: 6 }}>
      <button type="button" onClick={onUndo} disabled={!canUndo} style={btn(canUndo)} title="Undo (Ctrl/Cmd+Z)">
        ↶ Undo
      </button>
      <button type="button" onClick={onRedo} disabled={!canRedo} style={btn(canRedo)} title="Redo (Ctrl/Cmd+Shift+Z)">
        ↷ Redo
      </button>
    </div>
  );
}
