"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import type { AboutPage } from "@/payload/payload-types";
import { saveAboutPage } from "./aboutVisualEditorActions";

type Colors = {
  black: string;
  offwhite: string;
  red: string;
  blue: string;
  clay: string;
  stone: string;
};

type Props = {
  initialData: AboutPage;
  colors: Colors;
  photoUrls: string[];
};

/** Every editable field renders as a borderless input that approximates
 *  its real typography on the live page, so scale and position — not just
 *  a form label — tell the editor which text they're looking at. The
 *  field path only appears on hover/focus, keeping the canvas readable as
 *  a page rather than a form. */
function Field({
  label,
  value,
  onChange,
  style,
  multiline,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (next: string) => void;
  style?: React.CSSProperties;
  multiline?: boolean;
  placeholder?: string;
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
    <span style={{ position: "relative", display: "block" }}>
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

function RowActions({ onAdd, onRemove }: { onAdd: () => void; onRemove?: () => void }) {
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
      <button type="button" onClick={onAdd} style={btn} title="Add another">
        +
      </button>
      {onRemove && (
        <button type="button" onClick={onRemove} style={btn} title="Remove this one">
          ×
        </button>
      )}
    </span>
  );
}

export function AboutVisualEditorClient({ initialData, colors, photoUrls }: Props) {
  const [data, setData] = useState<AboutPage>(initialData);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [dirty, setDirty] = useState(false);

  // Generic immutable setter for a nested path, so each field below stays
  // a one-liner instead of repeating spread-merge boilerplate 20 times.
  const set = useCallback((updater: (draft: AboutPage) => void) => {
    setData((prev) => {
      const next = structuredClone(prev) as AboutPage;
      updater(next);
      return next;
    });
    setDirty(true);
    setStatus({ kind: "idle" });
  }, []);

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      // Send only the groups this editor owns, with photo relations back
      // as plain IDs — the loaded data has them populated as full Media
      // objects, and passing those through would fail validation.
      const result = await saveAboutPage({
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          lede: data.hero?.lede ?? "",
        },
        ourStory: {
          heading: data.ourStory?.heading ?? "",
          paragraphs: (data.ourStory?.paragraphs ?? []).map((p) => ({ text: p.text ?? "" })),
          photos: (data.ourStory?.photos ?? [])
            .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
            .filter((p): p is { image: number } => typeof p.image === "number"),
          photoCaption: data.ourStory?.photoCaption ?? "",
        },
        whatWeBelieve: {
          heading: data.whatWeBelieve?.heading ?? "",
          intro: data.whatWeBelieve?.intro ?? "",
          principles: (data.whatWeBelieve?.principles ?? []).map((p) => ({ lead: p.lead ?? "", text: p.text ?? "" })),
        },
        howWeWork: {
          heading: data.howWeWork?.heading ?? "",
          paragraphs: (data.howWeWork?.paragraphs ?? []).map((p) => ({ text: p.text ?? "" })),
        },
        leadership: {
          heading: data.leadership?.heading ?? "",
          cards: (data.leadership?.cards ?? []).map((c) => ({ name: c.name ?? "", role: c.role ?? "", bio: c.bio ?? "" })),
          note: data.leadership?.note ?? "",
          teamLinkLabel: data.leadership?.teamLinkLabel ?? "",
        },
      });
      if (!result.ok) throw new Error(result.error);
      setDirty(false);
      setStatus({ kind: "ok", message: "Published — live on the site." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const type = {
    eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: colors.clay },
    h1: { fontSize: 30, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em", color: colors.offwhite },
    lede: { fontSize: 13, lineHeight: 1.5, color: colors.offwhite, opacity: 0.85 },
    h2: { fontSize: 19, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: colors.blue },
    body: { fontSize: 12, lineHeight: 1.6, color: "rgba(36,30,28,0.82)" },
    lead: { fontSize: 12.5, fontWeight: 700, color: colors.black },
    name: { fontSize: 14, fontWeight: 700, color: colors.blue },
    role: { fontSize: 9.5, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: colors.red },
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "rgba(36,30,28,0.35)",
    fontFamily: "system-ui, sans-serif",
    marginBottom: 10,
    display: "block",
  };

  const block: React.CSSProperties = {
    borderTop: "1px solid rgba(36,30,28,0.12)",
    paddingTop: 22,
    marginTop: 26,
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 80px" }}>
      <style>{`
        .rn-ve input::placeholder, .rn-ve textarea::placeholder { color: rgba(120,120,120,0.55); font-style: italic; }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>About — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The About page in schematic form — each text sits where it appears on the real page, at
            roughly its real size. Hover or click any text to edit it. Photos and SEO stay in the{" "}
            <a href="/admin/globals/about-page">regular form</a>.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {status.kind !== "idle" && (
            <span style={{ fontSize: 12, color: status.kind === "ok" ? "var(--theme-success-500)" : "var(--theme-error-500, #b85840)" }}>
              {status.message}
            </span>
          )}
          <button
            type="button"
            onClick={save}
            disabled={saving || !dirty}
            style={{
              padding: "9px 18px",
              borderRadius: "var(--style-radius-m, 8px)",
              border: "none",
              background: dirty ? "var(--theme-success-500)" : "var(--theme-elevation-150)",
              color: dirty ? "#fff" : "var(--theme-elevation-500)",
              fontWeight: 600,
              fontSize: 13,
              cursor: dirty && !saving ? "pointer" : "default",
            }}
          >
            {saving ? "Publishing…" : dirty ? "Publish changes" : "No changes"}
          </button>
        </div>
      </div>

      {/* ---- The schematic canvas ---- */}
      <div
        className="rn-ve"
        style={{
          border: "1px solid var(--theme-elevation-150)",
          borderRadius: "var(--style-radius-m, 8px)",
          overflow: "hidden",
          fontFamily: '"TASA Orbiter Editor", system-ui, sans-serif',
          boxShadow: "0 12px 40px -20px rgba(36,30,28,0.4)",
        }}
      >
        {/* Section 1 — dark top banner */}
        <div style={{ background: colors.black, padding: "40px 34px 34px", position: "relative" }}>
          <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>1 · Top banner</span>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            <Field
              label="Small label"
              value={data.hero?.eyebrow ?? ""}
              onChange={(v) => set((d) => { d.hero.eyebrow = v; })}
              style={type.eyebrow}
              placeholder="About Real Numbers"
            />
            <Field
              label="Heading"
              value={data.hero?.heading ?? ""}
              onChange={(v) => set((d) => { d.hero.heading = v; })}
              style={type.h1}
              multiline
            />
            <Field
              label="Intro paragraph"
              value={data.hero?.lede ?? ""}
              onChange={(v) => set((d) => { d.hero.lede = v; })}
              style={type.lede}
              multiline
            />
          </div>
        </div>

        {/* Sections 2–5 — light prose area */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          {/* Section 2 — Our Story (two columns: text | photo) */}
          <span style={sectionLabel}>2 · Our story</span>
          <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 26, alignItems: "start" }}>
            <div style={{ display: "grid", gap: 10 }}>
              <Field
                label="Heading"
                value={data.ourStory?.heading ?? ""}
                onChange={(v) => set((d) => { d.ourStory = { ...d.ourStory, heading: v }; })}
                style={type.h2}
              />
              {(data.ourStory?.paragraphs ?? []).map((p, i) => (
                <Field
                  key={p.id ?? i}
                  label={`Paragraph ${i + 1}`}
                  value={p.text ?? ""}
                  onChange={(v) => set((d) => { d.ourStory!.paragraphs![i].text = v; })}
                  style={type.body}
                  multiline
                />
              ))}
              <RowActions
                onAdd={() => set((d) => {
                  d.ourStory = d.ourStory ?? {};
                  d.ourStory.paragraphs = [...(d.ourStory.paragraphs ?? []), { text: "" }];
                })}
                onRemove={
                  (data.ourStory?.paragraphs?.length ?? 0) > 1
                    ? () => set((d) => { d.ourStory!.paragraphs!.pop(); })
                    : undefined
                }
              />
            </div>
            <div>
              <PhotoPlaceholder urls={photoUrls} count={photoUrls.length} />
              <div style={{ marginTop: 8 }}>
                <Field
                  label="Photo caption"
                  value={data.ourStory?.photoCaption ?? ""}
                  onChange={(v) => set((d) => { d.ourStory = { ...d.ourStory, photoCaption: v }; })}
                  style={{ fontSize: 10.5, color: "rgba(36,30,28,0.6)" }}
                />
              </div>
            </div>
          </div>

          {/* Section 3 — What We Believe */}
          <div style={block}>
            <span style={sectionLabel}>3 · What we believe</span>
            <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
              <Field
                label="Heading"
                value={data.whatWeBelieve?.heading ?? ""}
                onChange={(v) => set((d) => { d.whatWeBelieve = { ...d.whatWeBelieve, heading: v }; })}
                style={type.h2}
              />
              <Field
                label="Intro paragraph"
                value={data.whatWeBelieve?.intro ?? ""}
                onChange={(v) => set((d) => { d.whatWeBelieve = { ...d.whatWeBelieve, intro: v }; })}
                style={type.body}
                multiline
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 16 }}>
              {(data.whatWeBelieve?.principles ?? []).map((p, i) => (
                <div key={p.id ?? i} style={{ display: "grid", gap: 5, borderLeft: `2px solid ${colors.red}`, paddingLeft: 12 }}>
                  <Field
                    label={`Principle ${i + 1} · title`}
                    value={p.lead ?? ""}
                    onChange={(v) => set((d) => { d.whatWeBelieve!.principles![i].lead = v; })}
                    style={type.lead}
                  />
                  <Field
                    label={`Principle ${i + 1} · text`}
                    value={p.text ?? ""}
                    onChange={(v) => set((d) => { d.whatWeBelieve!.principles![i].text = v; })}
                    style={type.body}
                    multiline
                  />
                </div>
              ))}
            </div>
            <RowActions
              onAdd={() => set((d) => {
                d.whatWeBelieve = d.whatWeBelieve ?? {};
                d.whatWeBelieve.principles = [...(d.whatWeBelieve.principles ?? []), { lead: "", text: "" }];
              })}
              onRemove={
                (data.whatWeBelieve?.principles?.length ?? 0) > 1
                  ? () => set((d) => { d.whatWeBelieve!.principles!.pop(); })
                  : undefined
              }
            />
          </div>

          {/* Section 4 — How We Work */}
          <div style={block}>
            <span style={sectionLabel}>4 · How we work</span>
            <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
              <Field
                label="Heading"
                value={data.howWeWork?.heading ?? ""}
                onChange={(v) => set((d) => { d.howWeWork = { ...d.howWeWork, heading: v }; })}
                style={type.h2}
              />
              {(data.howWeWork?.paragraphs ?? []).map((p, i) => (
                <Field
                  key={p.id ?? i}
                  label={`Paragraph ${i + 1}`}
                  value={p.text ?? ""}
                  onChange={(v) => set((d) => { d.howWeWork!.paragraphs![i].text = v; })}
                  style={type.body}
                  multiline
                />
              ))}
              <RowActions
                onAdd={() => set((d) => {
                  d.howWeWork = d.howWeWork ?? {};
                  d.howWeWork.paragraphs = [...(d.howWeWork.paragraphs ?? []), { text: "" }];
                })}
                onRemove={
                  (data.howWeWork?.paragraphs?.length ?? 0) > 1
                    ? () => set((d) => { d.howWeWork!.paragraphs!.pop(); })
                    : undefined
                }
              />
            </div>
          </div>

          {/* Section 5 — Leadership */}
          <div style={block}>
            <span style={sectionLabel}>5 · Leadership</span>
            <Field
              label="Heading"
              value={data.leadership?.heading ?? ""}
              onChange={(v) => set((d) => { d.leadership = { ...d.leadership, heading: v }; })}
              style={type.h2}
            />
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 16 }}>
              {(data.leadership?.cards ?? []).map((c, i) => (
                <div
                  key={c.id ?? i}
                  style={{
                    display: "grid",
                    gap: 6,
                    background: "rgba(255,255,255,0.6)",
                    border: "1px solid rgba(36,30,28,0.12)",
                    borderRadius: 8,
                    padding: 14,
                  }}
                >
                  <Field
                    label={`Person ${i + 1} · name`}
                    value={c.name ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].name = v; })}
                    style={type.name}
                  />
                  <Field
                    label={`Person ${i + 1} · job title`}
                    value={c.role ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].role = v; })}
                    style={type.role}
                  />
                  <Field
                    label={`Person ${i + 1} · bio`}
                    value={c.bio ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].bio = v; })}
                    style={{ ...type.body, fontSize: 11.5 }}
                    multiline
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 14, maxWidth: 620 }}>
              <Field
                label="Closing note"
                value={data.leadership?.note ?? ""}
                onChange={(v) => set((d) => { d.leadership = { ...d.leadership, note: v }; })}
                style={type.body}
                multiline
              />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 260 }}>
                <Field
                  label="Link text"
                  value={data.leadership?.teamLinkLabel ?? ""}
                  onChange={(v) => set((d) => { d.leadership = { ...d.leadership, teamLinkLabel: v }; })}
                  style={{ fontSize: 12, fontWeight: 700, color: colors.red }}
                />
                <span style={{ color: colors.red, fontSize: 12 }}>→</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Photos aren't editable here on purpose — uploads belong in the regular
 *  form. This just shows what's currently set, so the canvas still reads
 *  like the real two-column layout instead of a gap. */
function PhotoPlaceholder({ urls, count }: { urls: string[]; count: number }) {
  return (
    <div
      style={{
        position: "relative",
        aspectRatio: "4 / 5",
        borderRadius: 8,
        overflow: "hidden",
        background: "rgba(36,30,28,0.08)",
        border: "1px dashed rgba(36,30,28,0.25)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {urls[0] ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={urls[0]} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.85 }} />
      ) : (
        <span style={{ fontSize: 10, color: "rgba(36,30,28,0.45)", fontFamily: "system-ui, sans-serif" }}>Photo</span>
      )}
      <span
        style={{
          position: "absolute",
          bottom: 6,
          left: 6,
          background: "rgba(36,30,28,0.75)",
          color: "#f0efe8",
          fontSize: 9,
          padding: "2px 6px",
          borderRadius: 3,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {count > 1 ? `${count} photos — edit in form` : "Photo — edit in form"}
      </span>
    </div>
  );
}
