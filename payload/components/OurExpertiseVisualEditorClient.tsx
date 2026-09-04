"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { OurExpertisePage } from "@/payload/payload-types";
import { saveOurExpertisePage } from "./ourExpertiseVisualEditorActions";
import { ResponsiveField } from "./visual-editor/ResponsiveField";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { eyebrowStyle, pageHeroH1Style, pageHeroLedeStyle, sectionH2Style, bodyTextStyle } from "./visual-editor/typeScale";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: OurExpertisePage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

const EMPTY_AREA = { title: "", tagline: "", paragraphs: [{ text: "" }], services: [{ label: "" }] };

export function OurExpertiseVisualEditorClient({ initialData, colors, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const { data, set, dirty, setDirty } = useCloneState<OurExpertisePage>(initialData, () =>
    setStatus({ kind: "idle" }),
  );
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { dragHandlers: areaDragHandlers, dragOverIndex: areaDragOverIndex } = useDragReorder((from, to) =>
    set((d) => {
      const list = d.areas ?? [];
      if (from === to || from < 0 || from >= list.length) return;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    }),
  );
  const { overrides, setOverride, clearOverride, dirty: overridesDirty, setDirty: setOverridesDirty } = useMobileOverrides(
    initialData.mobileOverrides as Record<string, unknown> | null | undefined,
  );

  const overallDirty = dirty || overridesDirty;

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const result = await saveOurExpertisePage({
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          ledeParagraphs: (data.hero?.ledeParagraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
        },
        areas: (data.areas ?? []).map((a) => ({
          id: a.id,
          title: a.title ?? "",
          tagline: a.tagline ?? "",
          paragraphs: (a.paragraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
          services: (a.services ?? []).map((s) => ({ id: s.id, label: s.label ?? "" })),
        })),
        integrated: {
          heading: data.integrated?.heading ?? "",
          text: data.integrated?.text ?? "",
          photos: (data.integrated?.photos ?? [])
            .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
            .filter((p): p is { image: number } => typeof p.image === "number"),
          photoCaption: data.integrated?.photoCaption ?? "",
        },
        closingCta: {
          heading: data.closingCta?.heading ?? "",
          closingLine: data.closingCta?.closingLine ?? "",
          buttonLabel: data.closingCta?.buttonLabel ?? "",
        },
        mobileOverrides: overrides,
      });
      if (!result.ok) throw new Error(result.error);
      setDirty(false);
      setOverridesDirty(false);
      setStatus({ kind: "ok", message: "Published — live on the site." });
      router.refresh();
      setPreviewKey((k) => k + 1);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const sessionExpired = status.kind === "error" && /not signed in/i.test(status.message ?? "");

  // Same page-hero / prose-section / h2 type scale as About and Why Real
  // Numbers — all three share the underlying CSS classes.
  const type = {
    eyebrow: eyebrowStyle(colors),
    h1: pageHeroH1Style(colors),
    lede: pageHeroLedeStyle(),
    h2: sectionH2Style(colors),
    tagline: { fontSize: "16.8px", fontWeight: 700, color: colors.red },
    body: bodyTextStyle(colors),
    pill: { fontSize: 12, fontWeight: 600, color: colors.blue },
    closingH2: sectionH2Style(colors, true),
    closingLine: { fontSize: 14, lineHeight: 1.5, color: colors.offwhite, opacity: 0.8 },
    button: { fontSize: 13, fontWeight: 700, color: colors.offwhite },
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

  const areaBlock: React.CSSProperties = {
    borderLeft: `2px solid ${colors.red}`,
    paddingLeft: 14,
    marginTop: 18,
  };

  const pillInput: React.CSSProperties = {
    ...type.pill,
    background: "rgba(53,62,91,0.08)",
    borderRadius: 999,
    padding: "4px 10px",
    margin: 0,
    display: "inline-block",
    width: "auto",
    minWidth: 60,
  };

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <style>{`
        .rn-ve input::placeholder, .rn-ve textarea::placeholder { color: rgba(120,120,120,0.55); font-style: italic; }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Our Expertise — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Our Expertise page in schematic form — each text sits where it appears on the real page,
            at roughly its real size. Hover or click any text to edit it. Photos and SEO stay in the{" "}
            <a href="/admin/globals/our-expertise-page">regular form</a>.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <button
            type="button"
            onClick={save}
            disabled={saving || !overallDirty}
            style={{
              padding: "9px 18px",
              borderRadius: "var(--style-radius-m, 8px)",
              border: "none",
              background: overallDirty ? "var(--theme-success-500)" : "var(--theme-elevation-150)",
              color: overallDirty ? "#fff" : "var(--theme-elevation-500)",
              fontWeight: 600,
              fontSize: 13,
              cursor: overallDirty && !saving ? "pointer" : "default",
            }}
          >
            {saving ? "Publishing…" : overallDirty ? "Publish changes" : "No changes"}
          </button>
        </div>
      </div>

      {status.kind !== "idle" && (
        <div
          role="status"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            marginBottom: 14,
            padding: "12px 16px",
            borderRadius: "var(--style-radius-m, 8px)",
            border: `1px solid ${status.kind === "ok" ? "rgba(46,125,50,0.35)" : "rgba(184,88,64,0.45)"}`,
            background: status.kind === "ok" ? "rgba(46,125,50,0.10)" : "rgba(184,88,64,0.10)",
            color: "var(--theme-text)",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          <span>
            {status.kind === "ok" ? "✓ " : "⚠ "}
            {status.message}
          </span>
          {sessionExpired && (
            <button
              type="button"
              onClick={() => window.location.reload()}
              style={{
                border: "1px solid var(--theme-elevation-250)",
                background: "var(--theme-elevation-0)",
                color: "var(--theme-text)",
                borderRadius: "var(--style-radius-s, 4px)",
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                flexShrink: 0,
              }}
            >
              Reload &amp; sign in
            </button>
          )}
        </div>
      )}

      <MobilePreview pageUrl={pageUrl} refreshKey={previewKey} />

      {/* ---- The schematic canvas ---- */}
      <DeviceFrame>
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
        {/* Section 1 — dark top banner (page-hero) */}
        <div style={{ background: colors.black, padding: "40px 34px 34px", position: "relative" }}>
          <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>1 · Top banner</span>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            <ResponsiveField
              label="Small label"
              value={data.hero?.eyebrow ?? ""}
              onChange={(v) => set((d) => { d.hero.eyebrow = v; })}
              path="hero.eyebrow"
              overrides={overrides}
              setOverride={setOverride}
              clearOverride={clearOverride}
              style={type.eyebrow}
              placeholder="Our Expertise"
            />
            <ResponsiveField
              label="Heading"
              value={data.hero?.heading ?? ""}
              onChange={(v) => set((d) => { d.hero.heading = v; })}
              path="hero.heading"
              overrides={overrides}
              setOverride={setOverride}
              clearOverride={clearOverride}
              style={type.h1}
              multiline
            />
            {(data.hero?.ledeParagraphs ?? []).map((p, i) => (
              <ResponsiveField
                key={p.id ?? i}
                label={`Intro paragraph ${i + 1}`}
                value={p.text ?? ""}
                onChange={(v) => set((d) => { d.hero.ledeParagraphs![i].text = v; })}
                path={`hero.ledeParagraphs.${p.id ?? i}.text`}
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.lede}
                multiline
              />
            ))}
            <RowActions
              onAdd={
                (data.hero?.ledeParagraphs?.length ?? 0) < 2
                  ? () => set((d) => { d.hero.ledeParagraphs = [...(d.hero.ledeParagraphs ?? []), { text: "" }]; })
                  : undefined
              }
              onRemove={
                (data.hero?.ledeParagraphs?.length ?? 0) > 1
                  ? () => set((d) => { d.hero.ledeParagraphs!.pop(); })
                  : undefined
              }
            />
          </div>
        </div>

        {/* Sections 2–4 — light prose area */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          {/* Section 2 — Expertise Areas (up to 4, stacked) */}
          <span style={sectionLabel}>2 · Expertise areas</span>
          {(data.areas ?? []).map((a, ai) => (
            <div
              key={a.id ?? ai}
              {...areaDragHandlers(ai)}
              style={{
                ...(ai === 0 ? { marginTop: 4 } : areaBlock),
                cursor: "grab",
                outline: areaDragOverIndex === ai ? `1px dashed ${colors.blue}` : "none",
                outlineOffset: 6,
              }}
            >
              <ResponsiveField
                label={`Area ${ai + 1} · title`}
                value={a.title ?? ""}
                onChange={(v) => set((d) => { d.areas![ai].title = v; })}
                path={`areas.${a.id ?? ai}.title`}
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.h2}
              />
              <ResponsiveField
                label={`Area ${ai + 1} · tagline`}
                value={a.tagline ?? ""}
                onChange={(v) => set((d) => { d.areas![ai].tagline = v; })}
                path={`areas.${a.id ?? ai}.tagline`}
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.tagline}
              />
              <span style={{ fontSize: 10.5, color: "rgba(36,30,28,0.4)" }} title="Drag to reorder">
                ⠿ Drag to reorder
              </span>
              <div style={{ display: "grid", gap: 8, marginTop: 8 }}>
                {(a.paragraphs ?? []).map((p, pi) => (
                  <ResponsiveField
                    key={p.id ?? pi}
                    label={`Area ${ai + 1} · paragraph ${pi + 1}`}
                    value={p.text ?? ""}
                    onChange={(v) => set((d) => { d.areas![ai].paragraphs![pi].text = v; })}
                    path={`areas.${a.id ?? ai}.paragraphs.${p.id ?? pi}.text`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.body}
                    multiline
                  />
                ))}
                <RowActions
                  onAdd={() => set((d) => {
                    d.areas![ai].paragraphs = [...(d.areas![ai].paragraphs ?? []), { text: "" }];
                  })}
                  onRemove={
                    (a.paragraphs?.length ?? 0) > 1
                      ? () => set((d) => { d.areas![ai].paragraphs!.pop(); })
                      : undefined
                  }
                />
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12, alignItems: "center" }}>
                {(a.services ?? []).map((s, si) => (
                  <ResponsiveField
                    key={s.id ?? si}
                    label={`Area ${ai + 1} · service tag ${si + 1}`}
                    value={s.label ?? ""}
                    onChange={(v) => set((d) => { d.areas![ai].services![si].label = v; })}
                    path={`areas.${a.id ?? ai}.services.${s.id ?? si}.label`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={pillInput}
                  />
                ))}
                <RowActions
                  onAdd={() => set((d) => {
                    d.areas![ai].services = [...(d.areas![ai].services ?? []), { label: "" }];
                  })}
                  onRemove={
                    (a.services?.length ?? 0) > 1
                      ? () => set((d) => { d.areas![ai].services!.pop(); })
                      : undefined
                  }
                />
              </div>
            </div>
          ))}
          <div style={{ marginTop: 14 }}>
            <RowActions
              onAdd={
                (data.areas?.length ?? 0) < 4
                  ? () => set((d) => { d.areas = [...(d.areas ?? []), structuredClone(EMPTY_AREA)]; })
                  : undefined
              }
              onRemove={
                (data.areas?.length ?? 0) > 1
                  ? () => set((d) => { d.areas!.pop(); })
                  : undefined
              }
            />
          </div>

          {/* Section 3 — Integrated Partnership (two columns: text | photo) */}
          <div style={block}>
            <span style={sectionLabel}>3 · Integrated partnership</span>
            <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 26, alignItems: "start" }}>
              <div style={{ display: "grid", gap: 10 }}>
                <ResponsiveField
                  label="Heading"
                  value={data.integrated?.heading ?? ""}
                  onChange={(v) => set((d) => { d.integrated = { ...d.integrated, heading: v }; })}
                  path="integrated.heading"
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
                  style={type.h2}
                />
                <ResponsiveField
                  label="Paragraph"
                  value={data.integrated?.text ?? ""}
                  onChange={(v) => set((d) => { d.integrated = { ...d.integrated, text: v }; })}
                  path="integrated.text"
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
                  style={type.body}
                  multiline
                />
              </div>
              <div>
                <PhotoSlots
                  photos={data.integrated?.photos ?? []}
                  resolve={mediaById}
                  onPick={(index) => setPicking(index)}
                  onRemove={(index) =>
                    set((d) => {
                      d.integrated!.photos!.splice(index, 1);
                    })
                  }
                />
                <div style={{ marginTop: 8 }}>
                  <ResponsiveField
                    label="Photo caption"
                    value={data.integrated?.photoCaption ?? ""}
                    onChange={(v) => set((d) => { d.integrated = { ...d.integrated, photoCaption: v }; })}
                    path="integrated.photoCaption"
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={{ fontSize: 10.5, color: "rgba(36,30,28,0.6)" }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4 — Closing Banner */}
          <div style={{ ...block, background: colors.black, margin: "26px -34px -40px", padding: "34px" }}>
            <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>4 · Closing banner</span>
            <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
              <ResponsiveField
                label="Heading"
                value={data.closingCta?.heading ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, heading: v }; })}
                path="closingCta.heading"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.closingH2}
                multiline
              />
              <ResponsiveField
                label="Supporting line"
                value={data.closingCta?.closingLine ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, closingLine: v }; })}
                path="closingCta.closingLine"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.closingLine}
                multiline
              />
              <ResponsiveField
                label="Button text"
                value={data.closingCta?.buttonLabel ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, buttonLabel: v }; })}
                path="closingCta.buttonLabel"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={{ ...type.button, background: colors.red, display: "inline-block", padding: "6px 12px", borderRadius: 6, width: "fit-content" }}
              />
            </div>
          </div>
        </div>
      </div>
      </DeviceFrame>

      {picking !== null && (
        <MediaPicker
          library={library}
          onUpload={registerUpload}
          onClose={() => setPicking(null)}
          onSelect={(id) => {
            set((d) => {
              d.integrated = d.integrated ?? {};
              d.integrated.photos = d.integrated.photos ?? [];
              if (picking === "new") d.integrated.photos.push({ image: id });
              else d.integrated.photos[picking] = { ...d.integrated.photos[picking], image: id };
            });
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
