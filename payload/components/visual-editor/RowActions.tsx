"use client";

import React from "react";

/** Generic +/× control for an array field's rows. Shared by every page's
 *  visual editor wherever it renders a repeatable array (paragraphs,
 *  principles, cards, …). Both handlers are optional — a field with a
 *  fixed maxRows (e.g. a 4-card grid) omits `onAdd` once at the cap rather
 *  than rendering a button that silently does nothing, same as `onRemove`
 *  already does at minRows. Renders nothing when both are omitted. */
export function RowActions({ onAdd, onRemove }: { onAdd?: () => void; onRemove?: () => void }) {
  if (!onAdd && !onRemove) return null;
  const btn: React.CSSProperties = {
    border: "1px solid rgba(36,30,28,0.2)",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 4,
    width: 20,
    height: 20,
    lineHeight: 1,
    fontSize: 12,
    cursor: "pointer",
    color: "#241e1c",
    fontFamily: "system-ui, sans-serif",
  };
  return (
    <span style={{ display: "inline-flex", gap: 4, marginTop: 4 }}>
      {onAdd && (
        <button type="button" onClick={onAdd} style={btn} title="Add another">
          +
        </button>
      )}
      {onRemove && (
        <button type="button" onClick={onRemove} style={btn} title="Remove this one">
          ×
        </button>
      )}
    </span>
  );
}
