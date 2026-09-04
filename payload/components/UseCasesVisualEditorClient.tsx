"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { UseCasesPage } from "@/payload/payload-types";
import { saveUseCasesPage } from "./useCasesVisualEditorActions";
import { Field } from "./visual-editor/Field";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: UseCasesPage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
};

export function UseCasesVisualEditorClient({ initialData, colors, mediaLibrary }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const { data, set, dirty, setDirty } = useCloneState<UseCasesPage>(initialData, () =>
    setStatus({ kind: "idle" }),
  );
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const result = await saveUseCasesPage({
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          lede: data.hero?.lede ?? "",
        },
        atmospherePhotos: (data.atmospherePhotos ?? [])
          .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
          .filter((p): p is { image: number } => typeof p.image === "number"),
        atmospherePhotoCaption: data.atmospherePhotoCaption ?? "",
        situationsIntro: data.situationsIntro ?? "",
        situations: (data.situations ?? []).map((s) => ({ question: s.question ?? "", answer: s.answer ?? "" })),
        closingCta: {
          heading: data.closingCta?.heading ?? "",
          buttonLabel: data.closingCta?.buttonLabel ?? "",
        },
      });
      if (!result.ok) throw new Error(result.error);
      setDirty(false);
      setStatus({ kind: "ok", message: "Published — live on the site." });
      router.refresh();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const sessionExpired = status.kind === "error" && /not signed in/i.test(status.message ?? "");

  // Same page-hero / prose-section type scale as About, Why Real Numbers
  // and Our Expertise.
  const type = {
    eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: colors.clay },
    h1: { fontSize: 30, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em", color: colors.offwhite },
    lede: { fontSize: 13, lineHeight: 1.5, color: colors.offwhite, opacity: 0.85 },
    intro: { fontSize: 13, fontWeight: 700, color: colors.black, opacity: 0.85 },
    question: { fontSize: 13.5, fontWeight: 700, fontStyle: "italic" as const, color: colors.blue },
    answer: { fontSize: 12, lineHeight: 1.6, color: "rgba(36,30,28,0.82)" },
    closingH2: { fontSize: 19, fontWeight: 700, lineHeight: 1.1, letterSpacing: "-0.02em", color: colors.offwhite },
    button: { fontSize: 12, fontWeight: 700, color: colors.offwhite },
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
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Use Cases — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Use Cases page in schematic form — each text sits where it appears on the real page, at
            roughly its real size. Hover or click any text to edit it. Photos and SEO stay in the{" "}
            <a href="/admin/globals/use-cases-page">regular form</a>.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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
        {/* Section 1 — dark top banner (page-hero) */}
        <div style={{ background: colors.black, padding: "40px 34px 34px", position: "relative" }}>
          <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>1 · Top banner</span>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            <Field
              label="Small label"
              value={data.hero?.eyebrow ?? ""}
              onChange={(v) => set((d) => { d.hero.eyebrow = v; })}
              style={type.eyebrow}
              placeholder="Use Cases"
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

        {/* Sections 2–3 — light prose area */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          {/* Section 2 — Situations (photo, intro, up to 7 Q&A entries) */}
          <span style={sectionLabel}>2 · Situations</span>
          <div style={{ maxWidth: 420, marginBottom: 20 }}>
            <PhotoSlots
              photos={data.atmospherePhotos ?? []}
              resolve={mediaById}
              onPick={(index) => setPicking(index)}
              onRemove={(index) =>
                set((d) => {
                  d.atmospherePhotos!.splice(index, 1);
                })
              }
            />
            <div style={{ marginTop: 8 }}>
              <Field
                label="Photo caption"
                value={data.atmospherePhotoCaption ?? ""}
                onChange={(v) => set((d) => { d.atmospherePhotoCaption = v; })}
                style={{ fontSize: 10.5, color: "rgba(36,30,28,0.6)" }}
              />
            </div>
          </div>
          <Field
            label="Intro line before the list"
            value={data.situationsIntro ?? ""}
            onChange={(v) => set((d) => { d.situationsIntro = v; })}
            style={type.intro}
          />
          <div style={{ display: "grid", gap: 16, marginTop: 16 }}>
            {(data.situations ?? []).map((s, i) => (
              <div key={s.id ?? i} style={{ display: "grid", gap: 4, borderLeft: `2px solid ${colors.blue}`, paddingLeft: 12 }}>
                <Field
                  label={`Situation ${i + 1} · founder quote`}
                  value={s.question ?? ""}
                  onChange={(v) => set((d) => { d.situations![i].question = v; })}
                  style={type.question}
                />
                <Field
                  label={`Situation ${i + 1} · our response`}
                  value={s.answer ?? ""}
                  onChange={(v) => set((d) => { d.situations![i].answer = v; })}
                  style={type.answer}
                  multiline
                />
              </div>
            ))}
          </div>
          <RowActions
            onAdd={
              (data.situations?.length ?? 0) < 7
                ? () => set((d) => { d.situations = [...(d.situations ?? []), { question: "", answer: "" }]; })
                : undefined
            }
            onRemove={
              (data.situations?.length ?? 0) > 1
                ? () => set((d) => { d.situations!.pop(); })
                : undefined
            }
          />

          {/* Section 3 — Closing Banner */}
          <div style={{ ...block, background: colors.black, margin: "26px -34px -40px", padding: "34px" }}>
            <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>3 · Closing banner</span>
            <div style={{ display: "grid", gap: 10, maxWidth: 560 }}>
              <Field
                label="Heading"
                value={data.closingCta?.heading ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, heading: v }; })}
                style={type.closingH2}
                multiline
              />
              <Field
                label="Button text"
                value={data.closingCta?.buttonLabel ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, buttonLabel: v }; })}
                style={{ ...type.button, background: colors.red, display: "inline-block", padding: "6px 12px", borderRadius: 6, width: "fit-content" }}
              />
            </div>
          </div>
        </div>
      </div>

      {picking !== null && (
        <MediaPicker
          library={library}
          onUpload={registerUpload}
          onClose={() => setPicking(null)}
          onSelect={(id) => {
            set((d) => {
              d.atmospherePhotos = d.atmospherePhotos ?? [];
              if (picking === "new") d.atmospherePhotos.push({ image: id });
              else d.atmospherePhotos[picking] = { ...d.atmospherePhotos[picking], image: id };
            });
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
