"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutPage } from "@/payload/payload-types";
import { saveAboutPage } from "./aboutVisualEditorActions";
import { ResponsiveField } from "./visual-editor/ResponsiveField";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { eyebrowStyle, pageHeroH1Style, pageHeroLedeStyle, sectionH2Style, bodyTextStyle } from "./visual-editor/typeScale";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: AboutPage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

export function AboutVisualEditorClient({ initialData, colors, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const { data, set, dirty, setDirty } = useCloneState<AboutPage>(initialData, () => setStatus({ kind: "idle" }));
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { overrides, setOverride, clearOverride, dirty: overridesDirty, setDirty: setOverridesDirty } = useMobileOverrides(
    initialData.mobileOverrides as Record<string, unknown> | null | undefined,
  );

  const overallDirty = dirty || overridesDirty;

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
        mobileOverrides: overrides,
      });
      if (!result.ok) throw new Error(result.error);
      setDirty(false);
      setOverridesDirty(false);
      setStatus({ kind: "ok", message: "Published — live on the site." });
      // Re-render the server component so what's on screen is what's
      // actually stored, rather than trusting local state to have stayed
      // in sync with the database.
      router.refresh();
      setPreviewKey((k) => k + 1);
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const sessionExpired = status.kind === "error" && /not signed in/i.test(status.message ?? "");

  const type = {
    eyebrow: eyebrowStyle(colors),
    h1: pageHeroH1Style(colors),
    lede: pageHeroLedeStyle(),
    h2: sectionH2Style(colors),
    body: bodyTextStyle(colors),
    lead: { fontSize: "16.8px", fontWeight: 700, color: colors.black },
    name: { fontSize: "18.4px", fontWeight: 700, color: colors.blue },
    role: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: colors.red },
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
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>About — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The About page in schematic form — each text sits where it appears on the real page, at
            roughly its real size. Hover or click any text to edit it. Photos and SEO stay in the{" "}
            <a href="/admin/globals/about-page">regular form</a>.
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

      {/* A save result has to be impossible to miss — the previous version
          put it in small grey text beside the button, where a failed save
          (an expired session, most likely) read as "nothing happened". */}
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
        {/* Section 1 — dark top banner */}
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
              placeholder="About Real Numbers"
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
            <ResponsiveField
              label="Intro paragraph"
              value={data.hero?.lede ?? ""}
              onChange={(v) => set((d) => { d.hero.lede = v; })}
              path="hero.lede"
              overrides={overrides}
              setOverride={setOverride}
              clearOverride={clearOverride}
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
              <ResponsiveField
                label="Heading"
                value={data.ourStory?.heading ?? ""}
                onChange={(v) => set((d) => { d.ourStory = { ...d.ourStory, heading: v }; })}
                path="ourStory.heading"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.h2}
              />
              {(data.ourStory?.paragraphs ?? []).map((p, i) => (
                <ResponsiveField
                  key={p.id ?? i}
                  label={`Paragraph ${i + 1}`}
                  value={p.text ?? ""}
                  onChange={(v) => set((d) => { d.ourStory!.paragraphs![i].text = v; })}
                  path={`ourStory.paragraphs.${i}.text`}
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
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
              <PhotoSlots
                photos={data.ourStory?.photos ?? []}
                resolve={mediaById}
                onPick={(index) => setPicking(index)}
                onRemove={(index) =>
                  set((d) => {
                    d.ourStory!.photos!.splice(index, 1);
                  })
                }
              />
              <div style={{ marginTop: 8 }}>
                <ResponsiveField
                  label="Photo caption"
                  value={data.ourStory?.photoCaption ?? ""}
                  onChange={(v) => set((d) => { d.ourStory = { ...d.ourStory, photoCaption: v }; })}
                  path="ourStory.photoCaption"
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
                  style={{ fontSize: 10.5, color: "rgba(36,30,28,0.6)" }}
                />
              </div>
            </div>
          </div>

          {/* Section 3 — What We Believe */}
          <div style={block}>
            <span style={sectionLabel}>3 · What we believe</span>
            <div style={{ display: "grid", gap: 10, maxWidth: 620 }}>
              <ResponsiveField
                label="Heading"
                value={data.whatWeBelieve?.heading ?? ""}
                onChange={(v) => set((d) => { d.whatWeBelieve = { ...d.whatWeBelieve, heading: v }; })}
                path="whatWeBelieve.heading"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.h2}
              />
              <ResponsiveField
                label="Intro paragraph"
                value={data.whatWeBelieve?.intro ?? ""}
                onChange={(v) => set((d) => { d.whatWeBelieve = { ...d.whatWeBelieve, intro: v }; })}
                path="whatWeBelieve.intro"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.body}
                multiline
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18, marginTop: 16 }}>
              {(data.whatWeBelieve?.principles ?? []).map((p, i) => (
                <div key={p.id ?? i} style={{ display: "grid", gap: 5, borderLeft: `2px solid ${colors.red}`, paddingLeft: 12 }}>
                  <ResponsiveField
                    label={`Principle ${i + 1} · title`}
                    value={p.lead ?? ""}
                    onChange={(v) => set((d) => { d.whatWeBelieve!.principles![i].lead = v; })}
                    path={`whatWeBelieve.principles.${i}.lead`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.lead}
                  />
                  <ResponsiveField
                    label={`Principle ${i + 1} · text`}
                    value={p.text ?? ""}
                    onChange={(v) => set((d) => { d.whatWeBelieve!.principles![i].text = v; })}
                    path={`whatWeBelieve.principles.${i}.text`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
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
              <ResponsiveField
                label="Heading"
                value={data.howWeWork?.heading ?? ""}
                onChange={(v) => set((d) => { d.howWeWork = { ...d.howWeWork, heading: v }; })}
                path="howWeWork.heading"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.h2}
              />
              {(data.howWeWork?.paragraphs ?? []).map((p, i) => (
                <ResponsiveField
                  key={p.id ?? i}
                  label={`Paragraph ${i + 1}`}
                  value={p.text ?? ""}
                  onChange={(v) => set((d) => { d.howWeWork!.paragraphs![i].text = v; })}
                  path={`howWeWork.paragraphs.${i}.text`}
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
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
            <ResponsiveField
              label="Heading"
              value={data.leadership?.heading ?? ""}
              onChange={(v) => set((d) => { d.leadership = { ...d.leadership, heading: v }; })}
              path="leadership.heading"
              overrides={overrides}
              setOverride={setOverride}
              clearOverride={clearOverride}
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
                  <ResponsiveField
                    label={`Person ${i + 1} · name`}
                    value={c.name ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].name = v; })}
                    path={`leadership.cards.${i}.name`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.name}
                  />
                  <ResponsiveField
                    label={`Person ${i + 1} · job title`}
                    value={c.role ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].role = v; })}
                    path={`leadership.cards.${i}.role`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={type.role}
                  />
                  <ResponsiveField
                    label={`Person ${i + 1} · bio`}
                    value={c.bio ?? ""}
                    onChange={(v) => set((d) => { d.leadership!.cards![i].bio = v; })}
                    path={`leadership.cards.${i}.bio`}
                    overrides={overrides}
                    setOverride={setOverride}
                    clearOverride={clearOverride}
                    style={{ ...type.body, fontSize: 11.5 }}
                    multiline
                  />
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gap: 8, marginTop: 14, maxWidth: 620 }}>
              <ResponsiveField
                label="Closing note"
                value={data.leadership?.note ?? ""}
                onChange={(v) => set((d) => { d.leadership = { ...d.leadership, note: v }; })}
                path="leadership.note"
                overrides={overrides}
                setOverride={setOverride}
                clearOverride={clearOverride}
                style={type.body}
                multiline
              />
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, maxWidth: 260 }}>
                <ResponsiveField
                  label="Link text"
                  value={data.leadership?.teamLinkLabel ?? ""}
                  onChange={(v) => set((d) => { d.leadership = { ...d.leadership, teamLinkLabel: v }; })}
                  path="leadership.teamLinkLabel"
                  overrides={overrides}
                  setOverride={setOverride}
                  clearOverride={clearOverride}
                  style={{ fontSize: 12, fontWeight: 700, color: colors.red }}
                />
                <span style={{ color: colors.red, fontSize: 12 }}>→</span>
              </span>
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
              d.ourStory = d.ourStory ?? {};
              d.ourStory.photos = d.ourStory.photos ?? [];
              if (picking === "new") d.ourStory.photos.push({ image: id });
              else d.ourStory.photos[picking] = { ...d.ourStory.photos[picking], image: id };
            });
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
