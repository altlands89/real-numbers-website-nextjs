"use client";

import React from "react";

/**
 * Mirrors MobileOverridesPanel.tsx's shape exactly, for the same reason:
 * a per-field override that happens invisibly (here: dragging a text box
 * wider or narrower) needs somewhere that actually shows it happened and
 * lets an editor undo it, or it's just as easy to lose track of as the
 * mobile-text-override problem that panel was built to fix.
 *
 * Takes both the desktop and mobile width-override blobs at once and
 * lists them together (labelled per entry) rather than as two separate
 * panels — an editor thinking "did I resize this field?" shouldn't have
 * to check two different places for the answer.
 */
export function TextWidthOverridesPanel({
  desktopOverrides,
  mobileOverrides,
  onClearDesktop,
  onClearMobile,
}: {
  desktopOverrides: Record<string, unknown>;
  mobileOverrides: Record<string, unknown>;
  onClearDesktop: (path: string) => void;
  onClearMobile: (path: string) => void;
}) {
  const desktopEntries = Object.entries(desktopOverrides).filter(([, v]) => typeof v === "number" && v > 0);
  const mobileEntries = Object.entries(mobileOverrides).filter(([, v]) => typeof v === "number" && v > 0);
  if (desktopEntries.length === 0 && mobileEntries.length === 0) return null;

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
        Custom text widths ({desktopEntries.length + mobileEntries.length})
      </span>
      <p style={{ margin: "4px 0 8px", fontSize: 11.5, color: "var(--theme-elevation-500)" }}>
        These fields were resized by dragging the bottom-right corner while editing — the text now
        wraps at a custom width instead of the page's normal one. Reset one to go back to normal.
      </p>
      <div style={{ display: "grid", gap: 6 }}>
        {desktopEntries.map(([path, value]) => (
          <Row key={`d-${path}`} label="Desktop" path={path} px={value as number} onClear={() => onClearDesktop(path)} />
        ))}
        {mobileEntries.map(([path, value]) => (
          <Row key={`m-${path}`} label="Mobile" path={path} px={value as number} onClear={() => onClearMobile(path)} />
        ))}
      </div>
    </div>
  );
}

function Row({ label, path, px, onClear }: { label: string; path: string; px: number; onClear: () => void }) {
  return (
    <div
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
      <span style={{ fontSize: 12, color: "var(--theme-elevation-600)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={path}>
        <strong>{label}</strong> · {px}px wide
      </span>
      <button
        type="button"
        onClick={() => {
          if (window.confirm("Reset this field to its normal width?")) onClear();
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
        Reset width
      </button>
    </div>
  );
}
