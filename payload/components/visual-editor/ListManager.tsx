"use client";

import React from "react";

// Shared "Manage lists" panel primitive — every list of repeatable items
// (paragraphs, cards, tags, roster/FAQ rows, …) across all 8 visual editors
// should render through this, for two reasons found during a full UX audit
// of the tool:
//
// 1. Every list used to offer only "add one at the end" / "remove the last
//    one" (a bare +/× pair from RowActions.tsx) — a user editing the 2nd of
//    4 paragraphs who wanted to delete it would silently delete the 4th
//    instead, with no preview shown of what "the last one" even was. This
//    renders every item with an actual preview of its content, and its own
//    Remove button, so removal always targets the item the user is looking
//    at, with a confirm prompt before anything is actually gone.
// 2. Six different visual styles had accumulated for "add a row" and
//    "delete a row" across the 8 pages (bare +/× icons, dashed pills,
//    hardcoded-color pill buttons, …). One shared component means one
//    style for the whole tool.
export function ListManager<T>({
  label,
  items,
  minRows = 1,
  maxRows,
  addLabel,
  itemLabel = "item",
  onAdd,
  onRemove,
  renderItem,
  extra,
}: {
  label: string;
  items: T[];
  // Below this count, Remove is hidden entirely rather than shown-disabled
  // — matches the existing convention (e.g. "always keep at least one
  // paragraph") without a dead button explaining why it's dead.
  minRows?: number;
  maxRows?: number;
  addLabel?: string;
  // Used in the confirm prompt ("Remove this <itemLabel>?") and, absent an
  // explicit addLabel, in "+ Add <itemLabel>".
  itemLabel?: string;
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  // Anything extra to render in the header row next to the Add button
  // (e.g. Home's per-area paragraph/tag sub-counts).
  extra?: React.ReactNode;
}) {
  const atCap = typeof maxRows === "number" && items.length >= maxRows;
  return (
    <div style={panelWrap}>
      <div style={headerRow}>
        <span style={rowLabelStyle}>
          {label} ({items.length}
          {maxRows ? `/${maxRows}` : ""})
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {extra}
          <button
            type="button"
            onClick={onAdd}
            disabled={atCap}
            title={atCap ? `Up to ${maxRows} — remove one to add another` : undefined}
            style={addBtnStyle(atCap)}
          >
            + {addLabel ?? `Add ${itemLabel}`}
          </button>
        </div>
      </div>
      <div style={{ display: "grid", gap: 6, marginTop: 8 }}>
        {items.map((item, i) => (
          <div key={i} style={itemRowStyle}>
            <div style={{ flex: 1, minWidth: 0 }}>{renderItem(item, i)}</div>
            {items.length > minRows && (
              <button
                type="button"
                onClick={() => {
                  if (window.confirm(`Remove this ${itemLabel}? You can still Undo before you click Publish, but not after.`)) {
                    onRemove(i);
                  }
                }}
                style={removeBtnStyle}
              >
                Remove
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Truncated read-only preview of a canvas-edited text field — used inside
 *  `ListManager` for lists whose actual text is edited by clicking the
 *  real page above, not here; this panel's job is only to show *which*
 *  item is which so Remove targets the right one. */
export function TextPreview({ text, placeholder = "(empty — click it on the page above to add text)" }: { text: string; placeholder?: string }) {
  const trimmed = text.trim();
  if (!trimmed) {
    return <span style={{ ...previewTextStyle, fontStyle: "italic", opacity: 0.6 }}>{placeholder}</span>;
  }
  return <span style={previewTextStyle}>{trimmed.length > 100 ? `${trimmed.slice(0, 100)}…` : trimmed}</span>;
}

const panelWrap: React.CSSProperties = {
  padding: "10px 14px",
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "var(--style-radius-s, 6px)",
};

const headerRow: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 12,
};

const rowLabelStyle: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 600,
  color: "var(--theme-text)",
};

const previewTextStyle: React.CSSProperties = {
  fontSize: 12,
  color: "var(--theme-elevation-600)",
  display: "block",
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const itemRowStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 10,
  padding: "7px 10px",
  borderRadius: 6,
  border: "1px solid var(--theme-elevation-100)",
};

function addBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    border: "1px dashed var(--theme-elevation-250)",
    background: "var(--theme-elevation-0)",
    color: disabled ? "var(--theme-elevation-350)" : "var(--theme-text)",
    borderRadius: 6,
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    cursor: disabled ? "default" : "pointer",
    flexShrink: 0,
  };
}

export const removeBtnStyle: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150)",
  background: "var(--theme-elevation-0)",
  color: "var(--theme-error-500, #b85840)",
  borderRadius: 4,
  padding: "4px 10px",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
  whiteSpace: "nowrap",
};
