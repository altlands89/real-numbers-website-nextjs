"use client";

import React from "react";
import { Field } from "./Field";
import type { MobileOverrides } from "./useMobileOverrides";

const toggleBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  marginTop: 4,
  padding: "2px 8px",
  border: "1px dashed rgba(53,62,91,0.4)",
  borderRadius: 999,
  background: "transparent",
  color: "#353e5b",
  fontSize: 10,
  fontWeight: 600,
  fontFamily: "system-ui, sans-serif",
  cursor: "pointer",
};

/**
 * Wraps Field with an opt-in "different on mobile" toggle. Every editable
 * text field on the live site is the same value on every breakpoint by
 * default (today's behavior, untouched) — this lets an editor give one
 * specific field its own mobile-only text (different copy, different line
 * breaks) without affecting how it looks on desktop, or on any other field.
 *
 * `path` must be a stable, unique dot-path identifying this field within
 * the page (e.g. "hero.heading", "leadership.cards.0.bio") — it's the key
 * this override is stored under in the page's shared mobileOverrides blob.
 */
export function ResponsiveField({
  label,
  value,
  onChange,
  path,
  overrides,
  setOverride,
  clearOverride,
  style,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  path: string;
  overrides: MobileOverrides;
  setOverride: (path: string, value: unknown) => void;
  clearOverride: (path: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  placeholder?: string;
}) {
  const hasOverride = Object.prototype.hasOwnProperty.call(overrides, path);
  const mobileValue = typeof overrides[path] === "string" ? (overrides[path] as string) : "";

  return (
    <span style={{ display: "block" }}>
      <Field label={label} value={value} onChange={onChange} style={style} multiline={multiline} placeholder={placeholder} path={path} />
      {hasOverride ? (
        <span
          style={{
            display: "block",
            marginTop: 6,
            paddingLeft: 12,
            borderLeft: "2px solid rgba(53,62,91,0.35)",
          }}
        >
          <Field
            label={`${label} · mobile version`}
            value={mobileValue}
            onChange={(v) => setOverride(path, v)}
            style={{ ...style, opacity: 0.82 }}
            multiline={multiline}
            placeholder="Mobile-only text — leave blank to fall back to the desktop text above"
          />
          <button type="button" onClick={() => clearOverride(path)} style={toggleBtn}>
            📱 Remove mobile override — use the same text on mobile
          </button>
        </span>
      ) : (
        <button type="button" onClick={() => setOverride(path, value)} style={toggleBtn}>
          📱 Use different text on mobile
        </button>
      )}
    </span>
  );
}
