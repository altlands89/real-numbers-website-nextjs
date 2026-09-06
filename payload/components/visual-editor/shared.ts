import type React from "react";

export type MediaItem = { id: number; url: string; alt: string; filename: string };

/** Shared small-button style used by both PhotoSlots' Change/Remove
 *  controls and MediaPicker's Close button, so they read as one system. */
export const photoBtn: React.CSSProperties = {
  border: "1px solid rgba(255,255,255,0.35)",
  background: "rgba(36,30,28,0.78)",
  color: "#f0efe8",
  borderRadius: 4,
  padding: "4px 8px",
  fontSize: 10,
  fontWeight: 600,
  cursor: "pointer",
  fontFamily: "system-ui, sans-serif",
};
