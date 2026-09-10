"use client";

import React from "react";

/**
 * Surfaces every field that currently has a mobile-only override — before
 * this existed, a field edited from inside the Mobile Preview silently
 * forked from the desktop text forever, with nothing anywhere (not the
 * desktop canvas, not this preview, not the Manage Lists panels) ever
 * showing that fork had happened or offering a way to undo it short of
 * manually retyping the desktop text back into the mobile box. This turns
 * that into a visible, reversible list.
 *
 * Renders nothing when there are no overrides — this is meant to appear
 * only when it's actually relevant, not as permanent clutter under the
 * Mobile Preview toggle.
 */
export function MobileOverridesPanel({
  overrides,
  onClear,
}: {
  overrides: Record<string, unknown>;
  onClear: (path: string) => void;
}) {
  const entries = Object.entries(overrides).filter(([, v]) => v !== undefined && v !== null && v !== "");
  if (entries.length === 0) return null;

  return (
    <div
      style={{
        marginTop: 10,
        padding: "10px 14px",
        border: "1px solid var(--theme-elevation-150)",
        borderRadius: "var(--style-radius-s, 6px)",
      }}
    >
      <span style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)" }}>
        Mobile-only text ({entries.length})
      </span>
      <p style={{ margin: "4px 0 8px", fontSize: 11.5, color: "var(--theme-elevation-500)" }}>
        These fields show different text on mobile than on desktop, because someone edited them directly
        inside the Mobile Preview above. Reset one to make mobile show the same text as desktop again.
      </p>
      <div style={{ display: "grid", gap: 6 }}>
        {entries.map(([path, value]) => (
          <div
            key={path}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 10,
              padding: "6px 10px",
              borderRadius: 6,
              border: "1px solid var(--theme-elevation-100)",
            }}
          >
            <span
              style={{
                fontSize: 12,
                color: "var(--theme-elevation-600)",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
              title={path}
            >
              {typeof value === "string" ? value : `(image override)`}
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm("Reset this field so mobile shows the same text as desktop again?")) {
                  onClear(path);
                }
              }}
              style={{
                border: "1px solid var(--theme-elevation-150)",
                background: "var(--theme-elevation-0)",
                color: "var(--theme-text)",
                borderRadius: 4,
                padding: "4px 10px",
                fontSize: 11,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              Reset to match desktop
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
