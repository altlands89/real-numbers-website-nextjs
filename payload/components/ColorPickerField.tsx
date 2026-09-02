"use client";

import React from "react";
import { useField, FieldLabel, TextInput } from "@payloadcms/ui";
import type { TextFieldClientProps } from "payload";

// The site's full brand palette, shown as fixed one-click swatches on every
// color field — lets an editor reuse an existing brand color instead of
// retyping/guessing a hex value, which keeps the palette from drifting.
const BRAND_SWATCHES = [
  { label: "Black", value: "#191716" },
  { label: "Off-white", value: "#f0efe8" },
  { label: "White", value: "#ffffff" },
  { label: "Red", value: "#b85840" },
  { label: "Red Dark", value: "#9c4933" },
  { label: "Blue", value: "#353e5b" },
  { label: "Blue Dark", value: "#2a3148" },
  { label: "Stone", value: "#cfc9bc" },
  { label: "Horizon", value: "#5c6787" },
  { label: "Clay", value: "#ce8570" },
  { label: "Jet", value: "#0d0d0d" },
];

const isValidHex = (v: unknown): v is string => typeof v === "string" && /^#[0-9a-fA-F]{6}$/.test(v);

export function ColorPickerField(props: TextFieldClientProps) {
  const { path, field } = props;
  const { value, setValue } = useField<string>({ path });
  const label = typeof field?.label === "string" ? field.label : undefined;
  const description =
    field?.admin && "description" in field.admin && typeof field.admin.description === "string"
      ? field.admin.description
      : undefined;

  return (
    <div className="field-type" style={{ marginBottom: "var(--base, 20px)" }}>
      {label && <FieldLabel label={label} path={path} />}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <input
          type="color"
          value={isValidHex(value) ? value : "#000000"}
          onChange={(e) => setValue(e.target.value)}
          aria-label={label ? `Pick a color for ${label}` : "Pick a color"}
          style={{
            width: 44,
            height: 38,
            padding: 2,
            border: "1px solid var(--theme-elevation-150)",
            borderRadius: 4,
            cursor: "pointer",
            background: "none",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1 }}>
          <TextInput
            path={path}
            value={value || ""}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          />
        </div>
      </div>
      {description && (
        <div
          className="field-description"
          style={{ fontSize: 13, opacity: 0.65, marginTop: 4 }}
        >
          {description}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 8 }}>
        {BRAND_SWATCHES.map((s) => (
          <button
            key={s.value}
            type="button"
            title={`${s.label} — ${s.value}`}
            onClick={() => setValue(s.value)}
            style={{
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: s.value,
              border: value === s.value ? "2px solid var(--theme-text)" : "1px solid rgba(0,0,0,0.15)",
              boxShadow: value === s.value ? "0 0 0 2px var(--theme-bg)" : "none",
              cursor: "pointer",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}
