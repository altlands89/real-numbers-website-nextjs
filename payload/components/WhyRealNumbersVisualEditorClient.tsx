"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { WhyRealNumbersPage } from "@/payload/payload-types";
import { saveWhyRealNumbersPage } from "./whyRealNumbersVisualEditorActions";
import { ResponsiveField } from "./visual-editor/ResponsiveField";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { eyebrowStyle, pageHeroH1Style, pageHeroLedeStyle, sectionH2Style, cardH3Style, bodyTextStyle } from "./visual-editor/typeScale";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: WhyRealNumbersPage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

export function WhyRealNumbersVisualEditorClient({ initialData, colors, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const { data, set, dirty, setDirty } = useCloneState<WhyRealNumbersPage>(initialData, () =>
    setStatus({ kind: "idle" }),
  );
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { dragHandlers: valuePropDragHandlers, dragOverIndex: valuePropDragOverIndex } = useDragReorder((from, to) =>
    set((d) => {
      const list = d.valueProps ?? [];
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
      const result = await saveWhyRealNumbersPage({
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          ledeParagraphs: (data.hero?.ledeParagraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
        },
        whyChooseUs: {
          heading: data.whyChooseUs?.heading ?? "",
          paragraphs: (data.whyChooseUs?.paragraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
        },
        valueProps: (data.valueProps ?? []).map((v) => ({
          id: v.id,
          title: v.title ?? "",
          paragraph1: v.paragraph1 ?? "",
          paragraph2: v.paragraph2 ?? "",
        })),
        whatMakesDifferent: {
          heading: data.whatMakesDifferent?.heading ?? "",
          paragraphs: (data.whatMakesDifferent?.paragraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
          photos: (data.whatMakesDifferent?.photos ?? [])
            .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
            .filter((p): p is { image: number } => typeof p.image === "number"),
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

  // Why Real Numbers shares the same page-hero / prose-section / h2 CSS
  // classes About does — same type scale on purpose, not a coincidence.
  const type = {
    eyebrow: eyebrowStyle(colors),
    h1: pageHeroH1Style(colors),
    lede: pageHeroLedeStyle(),
    h2: sectionH2Style(colors),
    body: bodyTextStyle(colors),
    cardTitle: cardH3Style(colors),
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

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <style>{`
        .rn-ve input::placeholder, .rn-ve textarea::placeholder { color: rgba(120,120,120,0.55); font-style: italic; }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Why Real Numbers — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Why Real Numbers page in schematic form — each text sits where it appears on the real page,
            at roughly its real size. Hover or click any text to edit it. Photos and SEO stay in the{" "}
            <a href="/admin/globals/why-real-numbers-page">regular form</a>.
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
              placeholder="Why Real Numbers"
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

        {/* Sections 2–5 — light prose area */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          {/* Section 2 — Why Choose Us */}
          <span style={sectionLabel}>2 · Why choose us</span>
          <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
            <ResponsiveField
              label="Heading"
              value={data.whyChooseUs?.heading ?? ""}
              onChange={(v) => set((d) => { d.whyChooseUs = { ...d.whyChooseUs, heading: v }; })}
              path="whyChooseUs.heading"
              overrides={overrides}
              setOverride={setOverride}
              clearOverride={clearOverride}
              style={type.h2}
            />
            {(data.whyChooseUs?.paragraphs ?? []).map((p, i) => (
              <ResponsiveField
                key={p.id ?? i}
                label={`Paragraph ${i + 1}`}
                value={p.text ?? ""}
                onChange={(v) => set((d) => { d.whyChooseUs!.paragraphs![i].text = v; })}
                path={`whyChooseUs.paragraphs.${p.id ?? i}.text`}
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.body}
                multiline
              />
            ))}
            <RowActions
              onAdd={() => set((d) => {
                d.whyChooseUs = d.whyChooseUs ?? {};
                d.whyChooseUs.paragraphs = [...(d.whyChooseUs.paragraphs ?? []), { text: "" }];
              })}
              onRemove={
                (data.whyChooseUs?.paragraphs?.length ?? 0) > 1
                  ? () => set((d) => { d.whyChooseUs!.paragraphs!.pop(); })
                  : undefined
              }
            />
          </div>

          {/* Section 3 — Feature Cards (fixed 4-card grid) */}
          <div style={block}>
            <span style={sectionLabel}>3 · Feature cards</span>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
              {(data.valueProps ?? []).map((v, i) => (
                <div
                  key={v.id ?? i}
                  {...valuePropDragHandlers(i)}
                  style={{
                    display: "grid",
                    gap: 6,
                    background: "rgba(255,255,255,0.6)",
                    border: valuePropDragOverIndex === i ? `1px dashed ${colors.blue}` : "1px solid rgba(36,30,28,0.12)",
                    borderRadius: 8,
                    padding: 14,
                    cursor: "grab",
                  }}
                >
                  <ResponsiveField
                    label={`Card ${i + 1} · title`}
                    value={v.title ?? ""}
                    onChange={(val) => set((d) => { d.valueProps![i].title = val; })}
                    path={`valueProps.${v.id ?? i}.title`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.cardTitle}
                  />
                  <ResponsiveField
                    label={`Card ${i + 1} · first paragraph`}
                    value={v.paragraph1 ?? ""}
                    onChange={(val) => set((d) => { d.valueProps![i].paragraph1 = val; })}
                    path={`valueProps.${v.id ?? i}.paragraph1`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.body}
                    multiline
                  />
                  <ResponsiveField
                    label={`Card ${i + 1} · second paragraph`}
                    value={v.paragraph2 ?? ""}
                    onChange={(val) => set((d) => { d.valueProps![i].paragraph2 = val; })}
                    path={`valueProps.${v.id ?? i}.paragraph2`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.body}
                    multiline
                  />
                  <span style={{ fontSize: 10.5, color: "rgba(36,30,28,0.4)" }} title="Drag to reorder">
                    ⠿ Drag to reorder
                  </span>
                </div>
              ))}
            </div>
            <RowActions
              onAdd={
                (data.valueProps?.length ?? 0) < 4
                  ? () => set((d) => {
                      d.valueProps = [...(d.valueProps ?? []), { title: "", paragraph1: "" }];
                    })
                  : undefined
              }
              onRemove={
                (data.valueProps?.length ?? 0) > 1
                  ? () => set((d) => { d.valueProps!.pop(); })
                  : undefined
              }
            />
          </div>

          {/* Section 4 — What Makes Us Different (two columns: text | photo) */}
          <div style={block}>
            <span style={sectionLabel}>4 · What makes us different</span>
            <div style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 26, alignItems: "start" }}>
              <div style={{ display: "grid", gap: 10 }}>
                <ResponsiveField
                  label="Heading"
                  value={data.whatMakesDifferent?.heading ?? ""}
                  onChange={(v) => set((d) => { d.whatMakesDifferent = { ...d.whatMakesDifferent, heading: v }; })}
                  path="whatMakesDifferent.heading"
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
                  style={type.h2}
                />
                {(data.whatMakesDifferent?.paragraphs ?? []).map((p, i) => (
                  <ResponsiveField
                    key={p.id ?? i}
                    label={`Paragraph ${i + 1}`}
                    value={p.text ?? ""}
                    onChange={(v) => set((d) => { d.whatMakesDifferent!.paragraphs![i].text = v; })}
                    path={`whatMakesDifferent.paragraphs.${p.id ?? i}.text`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.body}
                    multiline
                  />
                ))}
                <RowActions
                  onAdd={() => set((d) => {
                    d.whatMakesDifferent = d.whatMakesDifferent ?? {};
                    d.whatMakesDifferent.paragraphs = [...(d.whatMakesDifferent.paragraphs ?? []), { text: "" }];
                  })}
                  onRemove={
                    (data.whatMakesDifferent?.paragraphs?.length ?? 0) > 1
                      ? () => set((d) => { d.whatMakesDifferent!.paragraphs!.pop(); })
                      : undefined
                  }
                />
              </div>
              <PhotoSlots
                photos={data.whatMakesDifferent?.photos ?? []}
                resolve={mediaById}
                onPick={(index) => setPicking(index)}
                onRemove={(index) =>
                  set((d) => {
                    d.whatMakesDifferent!.photos!.splice(index, 1);
                  })
                }
              />
            </div>
          </div>

          {/* Section 5 — Closing Banner */}
          <div style={{ ...block, background: colors.black, margin: "26px -34px -40px", padding: "34px" }}>
            <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>5 · Closing banner</span>
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
              d.whatMakesDifferent = d.whatMakesDifferent ?? {};
              d.whatMakesDifferent.photos = d.whatMakesDifferent.photos ?? [];
              if (picking === "new") d.whatMakesDifferent.photos.push({ image: id });
              else d.whatMakesDifferent.photos[picking] = { ...d.whatMakesDifferent.photos[picking], image: id };
            });
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
