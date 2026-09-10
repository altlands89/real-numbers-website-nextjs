"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

/** Every editable field renders as a borderless input that approximates
 *  its real typography on the live page, so scale and position — not just
 *  a form label — tell the editor which text they're looking at. The
 *  field path only appears on hover/focus, keeping the canvas readable as
 *  a page rather than a form. Shared by every page's visual editor. */
export function Field({
  label,
  value,
  onChange,
  style,
  multiline,
  placeholder,
  path,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  placeholder?: string;
  // Same dot-path used by mobileOverrides/ResponsiveText — when set, becomes
  // this field's DOM id (`rn-field-<path>`) so the editor-bridge click
  // handler (MobilePreview.tsx) can scroll to and focus it.
  path?: string;
}) {
  const [active, setActive] = useState(false);
  const ref = useRef<HTMLTextAreaElement | null>(null);
  const lastWidth = useRef(0);

  // Textareas grow to fit their content so a long paragraph doesn't hide
  // behind a scrollbar — the canvas should read like the page it mirrors.
  const autoSize = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (multiline) autoSize();
  }, [value, multiline, autoSize]);

  // A height measured on mount is measured against the wrong layout: the
  // brand @font-face is still loading (fallback metrics wrap differently)
  // and the column widths haven't settled, so the text wraps into far
  // more lines than it finally needs and the box stays stuck at that
  // stale height. Re-measure once fonts are ready, and again whenever the
  // element's *width* changes — width is what drives wrapping, and
  // ignoring height changes keeps the observer from re-triggering itself.
  useEffect(() => {
    if (!multiline) return;
    const el = ref.current;
    if (!el) return;

    document.fonts?.ready.then(autoSize).catch(() => {});

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (Math.abs(width - lastWidth.current) < 1) return;
      lastWidth.current = width;
      autoSize();
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [multiline, autoSize]);

  const shared: React.CSSProperties = {
    width: "100%",
    display: "block",
    background: active ? "rgba(184, 88, 64, 0.08)" : "transparent",
    border: "1px dashed transparent",
    borderColor: active ? "rgba(184, 88, 64, 0.55)" : "transparent",
    borderRadius: 4,
    padding: "2px 4px",
    margin: "-2px -4px",
    outline: "none",
    resize: "none",
    // Height is driven by autoSize, so a scrollbar track would only ever
    // be a visible grey strip down the side of otherwise plain text.
    overflow: "hidden",
    fontFamily: "inherit",
    color: "inherit",
    transition: "background 120ms ease, border-color 120ms ease",
    ...style,
  };

  return (
    <span id={path ? `rn-field-${path}` : undefined} style={{ position: "relative", display: "block" }}>
      {active && (
        <span
          style={{
            position: "absolute",
            top: -16,
            left: -4,
            zIndex: 3,
            background: "#b85840",
            color: "#fff",
            fontSize: 9,
            fontWeight: 700,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            padding: "2px 6px",
            borderRadius: 3,
            whiteSpace: "nowrap",
            fontFamily: "system-ui, sans-serif",
            pointerEvents: "none",
          }}
        >
          {label}
        </span>
      )}
      {multiline ? (
        <textarea
          ref={ref}
          rows={1}
          value={value}
          placeholder={placeholder}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => document.activeElement !== ref.current && setActive(false)}
          style={shared}
        />
      ) : (
        <input
          type="text"
          value={value}
          placeholder={placeholder}
          aria-label={label}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setActive(true)}
          onBlur={() => setActive(false)}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          style={shared}
        />
      )}
    </span>
  );
}
