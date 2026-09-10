"use client";

import React from "react";
import { useField, FieldLabel } from "@payloadcms/ui";
import type { SelectFieldClientProps } from "payload";

type Option = { label: string; value: string };

// Renders an existing `select` field's own options as a native range slider
// instead of a dropdown — no schema change, the field is still a plain
// `select` underneath (same options, same stored string value), just a
// different admin Field component, exactly like ColorPickerField swaps in a
// color picker over a plain `text` field.
export function SliderField(props: SelectFieldClientProps) {
  const { path, field } = props;
  const { value, setValue } = useField<string>({ path });
  const label = typeof field?.label === "string" ? field.label : undefined;
  const description =
    field?.admin && "description" in field.admin && typeof field.admin.description === "string"
      ? field.admin.description
      : undefined;

  const options: Option[] = (field?.options ?? []).map((o) =>
    typeof o === "string" ? { label: o, value: o } : { label: String(o.label), value: String(o.value) },
  );

  const currentIndex = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );
  const currentOption = options[currentIndex];

  return (
    <div className="field-type" style={{ marginBottom: "var(--base, 20px)" }}>
      {label && <FieldLabel label={label} path={path} />}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <input
          type="range"
          min={0}
          max={Math.max(0, options.length - 1)}
          step={1}
          value={currentIndex}
          onChange={(e) => setValue(options[Number(e.target.value)]?.value)}
          style={{ flex: 1, accentColor: "var(--theme-success-500)" }}
          aria-label={label}
        />
        {currentOption && (
          <span style={{ minWidth: 120, textAlign: "right", fontSize: 13, fontWeight: 600 }}>
            {currentOption.label}
          </span>
        )}
      </div>
      {description && (
        <div className="field-description" style={{ fontSize: 13, opacity: 0.65, marginTop: 4 }}>
          {description}
        </div>
      )}
    </div>
  );
}
