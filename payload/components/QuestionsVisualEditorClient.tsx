"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionsFoundersAskPage } from "@/payload/payload-types";
import { saveFaqItems, saveQuestionsPage } from "./questionsVisualEditorActions";
import { Field } from "./visual-editor/Field";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { eyebrowStyle, pageHeroH1Style } from "./visual-editor/typeScale";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

export type FaqEntry = { id: number | null; question: string; answer: string };

type Props = {
  initialData: QuestionsFoundersAskPage;
  initialFaqItems: FaqEntry[];
  colors: BrandColors;
  mediaLibrary: MediaItem[];
};

export function QuestionsVisualEditorClient({ initialData, initialFaqItems, colors, mediaLibrary }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const onMutate = () => setStatus({ kind: "idle" });
  const { data, set, dirty, setDirty } = useCloneState<QuestionsFoundersAskPage>(initialData, onMutate);
  const { data: faqItems, set: setFaqItems, dirty: faqDirty, setDirty: setFaqDirty } = useCloneState<FaqEntry[]>(
    initialFaqItems,
    onMutate,
  );
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);

  const overallDirty = dirty || faqDirty;

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const pageResult = await saveQuestionsPage({
        hero: { eyebrow: data.hero?.eyebrow ?? "", heading: data.hero?.heading ?? "" },
        atmospherePhotos: (data.atmospherePhotos ?? [])
          .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
          .filter((p): p is { image: number } => typeof p.image === "number"),
      });
      if (!pageResult.ok) throw new Error(pageResult.error);

      const faqResult = await saveFaqItems(
        faqItems.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
      );
      if (!faqResult.ok) throw new Error(faqResult.error);

      setDirty(false);
      setFaqDirty(false);
      setStatus({ kind: "ok", message: "Published — live on the site." });
      router.refresh();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const sessionExpired = status.kind === "error" && /not signed in/i.test(status.message ?? "");

  const addFaqItem = () => setFaqItems((d) => { d.push({ id: null, question: "", answer: "" }); });
  const removeFaqItem = (i: number) => {
    if (!window.confirm("Remove this question? This can't be undone from here.")) return;
    setFaqItems((d) => { d.splice(i, 1); });
  };
  const reorderFaqItems = (from: number, to: number) =>
    setFaqItems((d) => {
      if (from === to || from < 0 || from >= d.length) return;
      const [item] = d.splice(from, 1);
      d.splice(to, 0, item);
    });
  const { dragHandlers, dragOverIndex } = useDragReorder(reorderFaqItems);

  const type = {
    eyebrow: eyebrowStyle(colors),
    h1: pageHeroH1Style(colors),
    question: { fontSize: "17.6px", fontWeight: 700, color: colors.blue },
    answer: { fontSize: 14, lineHeight: 1.6, color: "rgba(36,30,28,0.82)" },
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

  const cardBtn: React.CSSProperties = {
    border: "1px solid rgba(36,30,28,0.2)",
    background: "rgba(255,255,255,0.7)",
    borderRadius: 4,
    width: 22,
    height: 20,
    lineHeight: 1,
    fontSize: 11,
    cursor: "pointer",
    color: "#241e1c",
    fontFamily: "system-ui, sans-serif",
  };

  return (
    <div style={{ maxWidth: 1280, margin: "0 auto", padding: "28px 24px 80px" }}>
      <style>{`
        .rn-ve input::placeholder, .rn-ve textarea::placeholder { color: rgba(120,120,120,0.55); font-style: italic; }
      `}</style>

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Questions Founders Ask — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Q&amp;A page in schematic form, including the question list — add, remove, reorder, and edit
            right here. SEO stays in the{" "}
            <a href="/admin/globals/questions-founders-ask-page">regular form</a>; the list also has its own{" "}
            <a href="/admin/collections/faq-items">collection screen</a> if you prefer a plain form.
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
        {/* Section 1 — dark top banner (page-hero, no lede on this page) */}
        <div style={{ background: colors.black, padding: "40px 34px 34px", position: "relative" }}>
          <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>1 · Top banner</span>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            <Field
              label="Small label"
              value={data.hero?.eyebrow ?? ""}
              onChange={(v) => set((d) => { d.hero.eyebrow = v; })}
              style={type.eyebrow}
              placeholder="Questions Founders Ask"
            />
            <Field
              label="Heading"
              value={data.hero?.heading ?? ""}
              onChange={(v) => set((d) => { d.hero.heading = v; })}
              style={type.h1}
              multiline
            />
          </div>
        </div>

        {/* Section 2 — atmosphere photo + Q&A list (no closing banner on this page) */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          <span style={sectionLabel}>2 · Background photo</span>
          <div style={{ maxWidth: 420, marginBottom: 24 }}>
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
          </div>

          <span style={sectionLabel}>3 · Questions</span>
          <div style={{ display: "grid", gap: 14 }}>
            {faqItems.map((f, i) => (
              <div
                key={f.id ?? `new-${i}`}
                {...dragHandlers(i)}
                style={{
                  display: "grid",
                  gap: 6,
                  background: "rgba(255,255,255,0.6)",
                  border: dragOverIndex === i ? `1px dashed ${colors.blue}` : "1px solid rgba(36,30,28,0.12)",
                  borderRadius: 8,
                  padding: 14,
                  cursor: "grab",
                }}
              >
                <Field
                  label={`Question ${i + 1}`}
                  value={f.question}
                  onChange={(v) => setFaqItems((d) => { d[i].question = v; })}
                  style={type.question}
                  multiline
                />
                <Field
                  label={`Question ${i + 1} · answer`}
                  value={f.answer}
                  onChange={(v) => setFaqItems((d) => { d[i].answer = v; })}
                  style={type.answer}
                  multiline
                />
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                  <span style={{ fontSize: 11, color: "rgba(36,30,28,0.4)", cursor: "grab" }} title="Drag to reorder">
                    ⠿ Drag to reorder
                  </span>
                  <button type="button" onClick={() => removeFaqItem(i)} style={cardBtn} title="Remove this question">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addFaqItem}
            style={{
              marginTop: 12,
              border: "1px dashed rgba(36,30,28,0.3)",
              background: "rgba(255,255,255,0.75)",
              color: "#241e1c",
              borderRadius: 6,
              padding: "8px 14px",
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "system-ui, sans-serif",
            }}
          >
            + Add question
          </button>
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
