"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type {
  AudienceBlock,
  CtaDarkBlock,
  DifferenceBlock,
  Home,
  HeroBlock,
  StoriesBlock,
} from "@/payload/payload-types";
import { saveHomeSections } from "./homeVisualEditorActions";
import { ResponsiveField } from "./visual-editor/ResponsiveField";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { scaledH2Style, homeHeroHeadlineStyle, bodyTextStyle } from "./visual-editor/typeScale";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: Home;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

const BLOCK_LABEL: Record<string, string> = {
  hero: "Top Banner",
  diff: "Numbers Section",
  stats: "Stats",
  divider: "Video Background Divider",
  cta: "Dark Banner",
  audience: "Service Areas",
  stories: "Client Stories",
};

export function HomeVisualEditorClient({ initialData, colors, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  // Which section's PhotoSlots opened the picker — `picking` itself is
  // only the photo's index *within* that section's images array, so this
  // is needed too now that more than one section could theoretically
  // have a photo field.
  const pickingSectionIndexRef = useRef<number | null>(null);

  const { data, set, dirty, setDirty } = useCloneState<Home>(initialData, () => setStatus({ kind: "idle" }));
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { overrides, setOverride, clearOverride, dirty: overridesDirty, setDirty: setOverridesDirty } = useMobileOverrides(
    initialData.mobileOverrides as Record<string, unknown> | null | undefined,
  );

  const sections = data.sections ?? [];
  const overallDirty = dirty || overridesDirty;

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      // Photo/video relations load populated (full Media objects) —
      // normalize every one back to a bare id before saving, same as
      // every other stage's photo fields, including on block types
      // (stats, divider) this editor doesn't expose fields for, since
      // their *existing* relations are still populated in local state.
      const normalized = sections.map((section) => {
        if (section.blockType === "hero") {
          const s = section as HeroBlock;
          return {
            ...s,
            featuredPhoto: {
              ...s.featuredPhoto,
              images: (s.featuredPhoto?.images ?? [])
                .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
                .filter((p): p is { image: number } => typeof p.image === "number"),
            },
          };
        }
        if (section.blockType === "divider") {
          return { ...section, video: typeof section.video === "object" ? (section.video?.id ?? null) : section.video };
        }
        return section;
      });

      const result = await saveHomeSections(normalized as Home["sections"], overrides);
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

  // Editor bridge: a click inside the mobile-preview iframe (on the live
  // rendered page) posts {path} back here — scroll the matching field in
  // the canvas above into view and focus its input.
  const handleFieldSelect = (path: string) => {
    const el = document.getElementById(`rn-field-${path}`);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    el.querySelector<HTMLInputElement | HTMLTextAreaElement>("input, textarea")?.focus();
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    set((d) => {
      const arr = d.sections ?? [];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
    });
  };

  // Each Home section scales the shared h2 by its own real multiplier
  // (.v2-difference ×1.45, .v2-stats/.v2-audience ×1.17, .v2-cta-dark ×0.94
  // — see CLAUDE.md's Stage 1 note / typeScale.ts), so unlike every other
  // page's editor this one can't use one flat "heading" style for every
  // block — each block gets its own real-sized heading below.
  const type = {
    label: { fontSize: 14, fontWeight: 700, color: colors.black },
    heading: scaledH2Style(colors, 1),
    headingLight: scaledH2Style(colors, 1, true),
    heroRotatingWord: homeHeroHeadlineStyle(colors),
    // .v2-photo-feature-overlay h2 is an uncapped 8vw in the real CSS (no
    // clamp — a known "orphan" size, not one of the shared multipliers) —
    // approximated here against the shared h2 scale instead of raw vw, so
    // it stays stable inside the editor's fixed-width canvas.
    featuredPhotoHeading: scaledH2Style(colors, 1.3, true),
    diffHeading: scaledH2Style(colors, 1.45),
    ctaHeading: scaledH2Style(colors, 0.94, true),
    audienceHeading: scaledH2Style(colors, 1.17, true),
    body: bodyTextStyle(colors),
    bodyLight: { fontSize: 16, lineHeight: 1.6, color: colors.offwhite, opacity: 0.85 },
    small: { fontSize: 13, color: colors.blue, fontWeight: 600 },
    smallLight: { fontSize: 13, color: colors.offwhite, opacity: 0.75, fontWeight: 600 },
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    fontFamily: "system-ui, sans-serif",
  };

  const placeholderNote = (text: string, light: boolean): React.CSSProperties => ({
    border: `1px dashed ${light ? "rgba(240,239,232,0.3)" : "rgba(36,30,28,0.25)"}`,
    borderRadius: 8,
    padding: 14,
    fontSize: 11,
    color: light ? "rgba(240,239,232,0.55)" : "rgba(36,30,28,0.5)",
    fontFamily: "system-ui, sans-serif",
    fontStyle: "italic",
  });

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <style>{`
        .rn-ve input::placeholder, .rn-ve textarea::placeholder { color: rgba(120,120,120,0.55); font-style: italic; }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Home — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The Home page in schematic form, in real section order. Drag a section by its ⠿ handle to
            reorder the page. Hover or click any text to edit it. Stats, client logos, and testimonials
            come from their own collections/globals — not editable here. SEO and adding/removing whole
            sections stay in the <a href="/admin/globals/home">regular form</a>.
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

      <MobilePreview pageUrl={pageUrl} refreshKey={previewKey} onFieldSelect={handleFieldSelect} />

      {/* ---- The schematic canvas — one card per section, in page order ---- */}
      <DeviceFrame>
      <div
        className="rn-ve"
        style={{
          display: "grid",
          gap: 10,
          fontFamily: '"TASA Orbiter Editor", system-ui, sans-serif',
        }}
      >
        {sections.map((section, i) => {
          const dark = section.blockType === "hero" || section.blockType === "cta" || section.blockType === "audience";
          const sectionKey = section.id ?? i;
          return (
            <div
              key={section.id ?? i}
              draggable
              onDragStart={() => { dragIndexRef.current = i; }}
              onDragOver={(e) => { e.preventDefault(); if (dragOverIndex !== i) setDragOverIndex(i); }}
              onDragLeave={() => setDragOverIndex((cur) => (cur === i ? null : cur))}
              onDrop={(e) => {
                e.preventDefault();
                const from = dragIndexRef.current;
                dragIndexRef.current = null;
                setDragOverIndex(null);
                if (from !== null) reorder(from, i);
              }}
              onDragEnd={() => { dragIndexRef.current = null; setDragOverIndex(null); }}
              style={{
                border: `1px solid ${dragOverIndex === i ? colors.red : "var(--theme-elevation-150)"}`,
                borderRadius: "var(--style-radius-m, 8px)",
                overflow: "hidden",
                boxShadow: "0 8px 24px -16px rgba(36,30,28,0.35)",
                background: dark ? colors.black : colors.offwhite,
                transition: "border-color 120ms ease",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "8px 14px",
                  background: dark ? "rgba(255,255,255,0.06)" : "rgba(36,30,28,0.05)",
                  borderBottom: `1px solid ${dark ? "rgba(255,255,255,0.1)" : "rgba(36,30,28,0.1)"}`,
                  cursor: "grab",
                }}
                title="Drag to reorder"
              >
                <span style={{ fontSize: 14, color: dark ? "rgba(240,239,232,0.4)" : "rgba(36,30,28,0.35)", lineHeight: 1 }}>⠿</span>
                <span style={{ ...sectionLabel, color: dark ? "rgba(240,239,232,0.45)" : "rgba(36,30,28,0.4)" }}>
                  {i + 1} · {BLOCK_LABEL[section.blockType] ?? section.blockType}
                </span>
              </div>

              <div style={{ padding: "22px 24px" }}>
                {section.blockType === "hero" && (() => {
                  const s = section as HeroBlock;
                  return (
                    <div style={{ display: "grid", gap: 14 }}>
                      <div>
                        <div style={{ display: "grid", gap: 6 }}>
                          {(s.rotatingWords ?? []).map((w, wi) => (
                            <ResponsiveField
                              key={w.id ?? wi}
                              label={`Rotating word ${wi + 1}`}
                              value={w.word ?? ""}
                              onChange={(v) => set((d) => { ((d.sections![i] as HeroBlock).rotatingWords![wi].word) = v; })}
                              path={`${sectionKey}.rotatingWords.${w.id ?? wi}.word`}
                              overrides={overrides}
                              setOverride={setOverride}
                              clearOverride={clearOverride}
                              style={type.heroRotatingWord}
                            />
                          ))}
                        </div>
                        <RowActions
                          onAdd={() => set((d) => { const hb = d.sections![i] as HeroBlock; hb.rotatingWords = [...(hb.rotatingWords ?? []), { word: "" }]; })}
                          onRemove={(s.rotatingWords?.length ?? 0) > 1 ? () => set((d) => { (d.sections![i] as HeroBlock).rotatingWords!.pop(); }) : undefined}
                        />
                      </div>
                      <ResponsiveField
                        label="Description"
                        value={s.description ?? ""}
                        onChange={(v) => set((d) => { (d.sections![i] as HeroBlock).description = v; })}
                        path={`${sectionKey}.description`}
                        overrides={overrides}
                        setOverride={setOverride}
                        clearOverride={clearOverride}
                        style={type.bodyLight}
                        multiline
                      />
                      <div style={{ display: "flex", gap: 16 }}>
                        <ResponsiveField
                          label="Primary button text"
                          value={s.primaryCtaLabel ?? ""}
                          onChange={(v) => set((d) => { (d.sections![i] as HeroBlock).primaryCtaLabel = v; })}
                          path={`${sectionKey}.primaryCtaLabel`}
                          overrides={overrides}
                          setOverride={setOverride}
                          clearOverride={clearOverride}
                          style={type.smallLight}
                        />
                        <ResponsiveField
                          label="Secondary button text"
                          value={s.secondaryCtaLabel ?? ""}
                          onChange={(v) => set((d) => { (d.sections![i] as HeroBlock).secondaryCtaLabel = v; })}
                          path={`${sectionKey}.secondaryCtaLabel`}
                          overrides={overrides}
                          setOverride={setOverride}
                          clearOverride={clearOverride}
                          style={type.smallLight}
                        />
                      </div>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14, display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
                        <div style={{ display: "grid", gap: 8 }}>
                          <ResponsiveField
                            label="Featured photo · heading"
                            value={s.featuredPhoto?.heading ?? ""}
                            onChange={(v) => set((d) => { const hb = d.sections![i] as HeroBlock; hb.featuredPhoto = { ...hb.featuredPhoto, heading: v }; })}
                            path={`${sectionKey}.featuredPhoto.heading`}
                            overrides={overrides}
                            setOverride={setOverride}
                            clearOverride={clearOverride}
                            style={type.featuredPhotoHeading}
                          />
                          <ResponsiveField
                            label="Featured photo · button text"
                            value={s.featuredPhoto?.ctaLabel ?? ""}
                            onChange={(v) => set((d) => { const hb = d.sections![i] as HeroBlock; hb.featuredPhoto = { ...hb.featuredPhoto, ctaLabel: v }; })}
                            path={`${sectionKey}.featuredPhoto.ctaLabel`}
                            overrides={overrides}
                            setOverride={setOverride}
                            clearOverride={clearOverride}
                            style={type.smallLight}
                          />
                        </div>
                        <PhotoSlots
                          photos={s.featuredPhoto?.images ?? []}
                          resolve={mediaById}
                          onPick={(index) => { pickingSectionIndexRef.current = i; setPicking(index); }}
                          onRemove={(index) => set((d) => { (d.sections![i] as HeroBlock).featuredPhoto!.images!.splice(index, 1); })}
                        />
                      </div>
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 14, display: "grid", gap: 8 }}>
                        <ResponsiveField
                          label="Client logos strip · button text"
                          value={s.logosStrip?.ctaLabel ?? ""}
                          onChange={(v) => set((d) => { const hb = d.sections![i] as HeroBlock; hb.logosStrip = { ...hb.logosStrip, ctaLabel: v }; })}
                          path={`${sectionKey}.logosStrip.ctaLabel`}
                          overrides={overrides}
                          setOverride={setOverride}
                          clearOverride={clearOverride}
                          style={type.smallLight}
                        />
                        <p style={placeholderNote("", true)}>The logos themselves come from the Client Logos collection, not here.</p>
                      </div>
                    </div>
                  );
                })()}

                {section.blockType === "diff" && (
                  <ResponsiveField
                    label="Heading"
                    value={(section as DifferenceBlock).heading ?? ""}
                    onChange={(v) => set((d) => { (d.sections![i] as DifferenceBlock).heading = v; })}
                    path={`${sectionKey}.heading`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.diffHeading}
                    multiline
                  />
                )}

                {section.blockType === "stats" && (
                  <p style={placeholderNote("", false)}>
                    No fields here — this renders the separate{" "}
                    <a href="/admin/globals/stats" style={{ color: colors.red }}>Stats global</a>, wherever this block sits in the order.
                  </p>
                )}

                {section.blockType === "divider" && (
                  <p style={placeholderNote("", false)}>
                    Decorative video/image strip — edit the video upload in the{" "}
                    <a href="/admin/globals/home" style={{ color: colors.red }}>regular form</a>.
                  </p>
                )}

                {section.blockType === "cta" && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <ResponsiveField
                      label="Heading"
                      value={(section as CtaDarkBlock).heading ?? ""}
                      onChange={(v) => set((d) => { (d.sections![i] as CtaDarkBlock).heading = v; })}
                      path={`${sectionKey}.heading`}
                      overrides={overrides}
                      setOverride={setOverride}
                      clearOverride={clearOverride}
                      style={type.ctaHeading}
                      multiline
                    />
                    <ResponsiveField
                      label="Button text"
                      value={(section as CtaDarkBlock).ctaLabel ?? ""}
                      onChange={(v) => set((d) => { (d.sections![i] as CtaDarkBlock).ctaLabel = v; })}
                      path={`${sectionKey}.ctaLabel`}
                      overrides={overrides}
                      setOverride={setOverride}
                      clearOverride={clearOverride}
                      style={{ ...type.smallLight, background: colors.red, color: "#fff", display: "inline-block", padding: "6px 12px", borderRadius: 6, width: "fit-content", opacity: 1 }}
                    />
                  </div>
                )}

                {section.blockType === "audience" && (() => {
                  const s = section as AudienceBlock;
                  return (
                    <div style={{ display: "grid", gap: 12 }}>
                      <ResponsiveField
                        label="Heading"
                        value={s.heading ?? ""}
                        onChange={(v) => set((d) => { (d.sections![i] as AudienceBlock).heading = v; })}
                        path={`${sectionKey}.heading`}
                        overrides={overrides}
                        setOverride={setOverride}
                        clearOverride={clearOverride}
                        style={type.audienceHeading}
                        multiline
                      />
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {(s.areas ?? []).map((a, ai) => (
                          <div key={a.id ?? ai} style={{ display: "grid", gap: 4, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: 12 }}>
                            <ResponsiveField
                              label={`Area ${ai + 1} · title`}
                              value={a.title ?? ""}
                              onChange={(v) => set((d) => { (d.sections![i] as AudienceBlock).areas![ai].title = v; })}
                              path={`${sectionKey}.areas.${a.id ?? ai}.title`}
                              overrides={overrides}
                              setOverride={setOverride}
                              clearOverride={clearOverride}
                              style={type.smallLight}
                            />
                            <ResponsiveField
                              label={`Area ${ai + 1} · description`}
                              value={a.text ?? ""}
                              onChange={(v) => set((d) => { (d.sections![i] as AudienceBlock).areas![ai].text = v; })}
                              path={`${sectionKey}.areas.${a.id ?? ai}.text`}
                              overrides={overrides}
                              setOverride={setOverride}
                              clearOverride={clearOverride}
                              style={type.bodyLight}
                              multiline
                            />
                          </div>
                        ))}
                      </div>
                      <RowActions
                        onAdd={(s.areas?.length ?? 0) < 4 ? () => set((d) => { const ab = d.sections![i] as AudienceBlock; ab.areas = [...(ab.areas ?? []), { title: "", text: "" }]; }) : undefined}
                        onRemove={(s.areas?.length ?? 0) > 1 ? () => set((d) => { (d.sections![i] as AudienceBlock).areas!.pop(); }) : undefined}
                      />
                    </div>
                  );
                })()}

                {section.blockType === "stories" && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <ResponsiveField
                      label="Small label"
                      value={(section as StoriesBlock).eyebrow ?? ""}
                      onChange={(v) => set((d) => { (d.sections![i] as StoriesBlock).eyebrow = v; })}
                      path={`${sectionKey}.eyebrow`}
                      overrides={overrides}
                      setOverride={setOverride}
                      clearOverride={clearOverride}
                      style={type.small}
                    />
                    <ResponsiveField
                      label="Heading"
                      value={(section as StoriesBlock).heading ?? ""}
                      onChange={(v) => set((d) => { (d.sections![i] as StoriesBlock).heading = v; })}
                      path={`${sectionKey}.heading`}
                      overrides={overrides}
                      setOverride={setOverride}
                      clearOverride={clearOverride}
                      style={type.heading}
                      multiline
                    />
                    <p style={placeholderNote("", false)}>Testimonials themselves come from the Testimonials collection, not here.</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      </DeviceFrame>

      {picking !== null && picking !== "new" && (
        <MediaPicker
          library={library}
          onUpload={registerUpload}
          onClose={() => setPicking(null)}
          onSelect={(id) => {
            const sectionIndex = pickingSectionIndexRef.current;
            set((d) => {
              if (sectionIndex === null) return;
              const hb = d.sections![sectionIndex] as HeroBlock;
              hb.featuredPhoto = hb.featuredPhoto ?? {};
              hb.featuredPhoto.images = hb.featuredPhoto.images ?? [];
              hb.featuredPhoto.images[picking] = { ...hb.featuredPhoto.images[picking], image: id };
            });
            pickingSectionIndexRef.current = null;
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
