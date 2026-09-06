"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { QuestionsFoundersAskPage } from "@/payload/payload-types";
import { saveFaqItems, saveQuestionsPage } from "./questionsVisualEditorActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { removeBtnStyle } from "./visual-editor/ListManager";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { useLastTouchedHistory } from "./visual-editor/useCombinedHistory";
import { UndoRedoBar } from "./visual-editor/UndoRedoBar";
import { useUnsavedChangesGuard } from "./visual-editor/useUnsavedChangesGuard";
import { ViewLiveLink } from "./visual-editor/ViewLiveLink";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { LiveCanvas } from "./visual-editor/LiveCanvas";
import { MobilePreview } from "./visual-editor/MobilePreview";
import { MobileOverridesPanel } from "./visual-editor/MobileOverridesPanel";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

export type FaqEntry = { id: number | null; question: string; answer: string };

type Props = {
  initialData: QuestionsFoundersAskPage;
  initialFaqItems: FaqEntry[];
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

export function QuestionsVisualEditorClient({ initialData, initialFaqItems, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const history = useLastTouchedHistory();
  const onMutate = () => setStatus({ kind: "idle" });
  const {
    data,
    set,
    dirty,
    setDirty,
    undo: undoData,
    redo: redoData,
    canUndo: canUndoData,
    canRedo: canRedoData,
  } = useCloneState<QuestionsFoundersAskPage>(initialData, () => {
    onMutate();
    history.mark("data");
  });
  const {
    data: faqItems,
    set: setFaqItems,
    dirty: faqDirty,
    setDirty: setFaqDirty,
    undo: undoFaq,
    redo: redoFaq,
    canUndo: canUndoFaq,
    canRedo: canRedoFaq,
  } = useCloneState<FaqEntry[]>(initialFaqItems, () => {
    onMutate();
    history.mark("faq");
  });
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const {
    overrides,
    setOverride,
    clearOverride,
    dirty: overridesDirty,
    setDirty: setOverridesDirty,
    undo: undoOverrides,
    redo: redoOverrides,
    canUndo: canUndoOverrides,
    canRedo: canRedoOverrides,
  } = useMobileOverrides(initialData.mobileOverrides as Record<string, unknown> | null | undefined, () =>
    history.mark("overrides"),
  );

  const historySlices = {
    data: { canUndo: canUndoData, canRedo: canRedoData, undo: undoData, redo: redoData },
    faq: { canUndo: canUndoFaq, canRedo: canRedoFaq, undo: undoFaq, redo: redoFaq },
    overrides: { canUndo: canUndoOverrides, canRedo: canRedoOverrides, undo: undoOverrides, redo: redoOverrides },
  };
  const canUndo = canUndoData || canUndoFaq || canUndoOverrides;
  const canRedo = canRedoData || canRedoFaq || canRedoOverrides;
  const handleUndo = () => history.undo(historySlices);
  const handleRedo = () => history.redo(historySlices);

  const overallDirty = dirty || faqDirty || overridesDirty;

  useUnsavedChangesGuard(overallDirty);

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const pageResult = await saveQuestionsPage({
        hero: { eyebrow: data.hero?.eyebrow ?? "", heading: data.hero?.heading ?? "" },
        atmospherePhotos: (data.atmospherePhotos ?? [])
          .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
          .filter((p): p is { image: number } => typeof p.image === "number"),
        mobileOverrides: overrides,
      });
      if (!pageResult.ok) throw new Error(pageResult.error);

      const faqResult = await saveFaqItems(
        faqItems.map((f) => ({ id: f.id, question: f.question, answer: f.answer })),
      );
      if (!faqResult.ok) throw new Error(faqResult.error);

      setDirty(false);
      setFaqDirty(false);
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

  const handleFieldCommit = (path: string, value: string) => {
    const segs = path.split(".");
    if (segs[0] === "faq") {
      const idx = faqItems.findIndex((f, i) => String(f.id ?? `new-${i}`) === segs[1]);
      if (idx >= 0 && (segs[2] === "question" || segs[2] === "answer")) {
        setFaqItems((d) => { d[idx][segs[2] as "question" | "answer"] = value; });
      } else {
        // eslint-disable-next-line no-console
        console.warn("[questions-visual-editor] unrecognized faq path from live canvas:", path);
      }
      return;
    }
    set((d) => {
      if (path === "hero.eyebrow") { d.hero.eyebrow = value; return; }
      if (path === "hero.heading") { d.hero.heading = value; return; }
      // eslint-disable-next-line no-console
      console.warn("[questions-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  const handleMobileFieldCommit = (path: string, value: string) => setOverride(path, value);

  const handleImageClick = (path: string) => {
    if (path === "atmospherePhotos") setPicking(0);
  };

  const addFaqItem = () => setFaqItems((d) => { d.push({ id: null, question: "", answer: "" }); });
  const removeFaqItem = (i: number) => {
    if (!window.confirm("Remove this question? You can still Undo before you click Publish, but not after.")) return;
    setFaqItems((d) => { d.splice(i, 1); });
  };
  const reorderFaqItems = (from: number, to: number) =>
    setFaqItems((d) => {
      if (from === to || from < 0 || from >= d.length) return;
      const [item] = d.splice(from, 1);
      d.splice(to, 0, item);
    });
  const { dragHandlers, dragOverIndex } = useDragReorder(reorderFaqItems);

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Questions Founders Ask — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text or photo below —
            including a question or its answer — to edit it in place. Adding, removing and reordering
            questions happens in the panel underneath. SEO stays in the{" "}
            <a href="/admin/globals/questions-founders-ask-page">regular form</a>; the list also has its
            own <a href="/admin/collections/faq-items">collection screen</a> if you prefer a plain form.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0, position: "sticky", top: 0, zIndex: 20, background: "var(--theme-elevation-0)", padding: "8px 0 8px 12px", borderRadius: "var(--style-radius-m, 8px)" }}>
          <ViewLiveLink pageUrl={pageUrl} variant="toolbar" />
          <UndoRedoBar canUndo={canUndo} canRedo={canRedo} onUndo={handleUndo} onRedo={handleRedo} />
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
            border: `1px solid var(--theme-${status.kind === "ok" ? "success" : "error"}-600)`,
            background: `var(--theme-${status.kind === "ok" ? "success" : "error"}-100)`,
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
          {status.kind === "ok" && <ViewLiveLink pageUrl={pageUrl} variant="banner" />}
        </div>
      )}

      <MobilePreview pageUrl={pageUrl} refreshKey={previewKey} dirty={overallDirty} inlineEditing onFieldCommit={handleMobileFieldCommit} />
      <MobileOverridesPanel overrides={overrides} onClear={clearOverride} />

      <div style={{ marginTop: 14, border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-m, 8px)", overflow: "hidden", boxShadow: "0 12px 40px -20px rgba(36,30,28,0.4)" }}>
        <DeviceFrame>
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} dirty={overallDirty} title="Questions Founders Ask page — live canvas" data={{ ...data, faq: faqItems }} onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Manage lists
        </span>

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)", display: "block", marginBottom: 8 }}>Background photo</span>
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

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)" }}>Questions ({faqItems.length}) — drag to reorder</span>
            <button
              type="button"
              onClick={addFaqItem}
              style={{
                border: "1px dashed var(--theme-elevation-250)",
                background: "var(--theme-elevation-0)",
                color: "var(--theme-text)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              + Add question
            </button>
          </div>
          <div style={{ display: "grid", gap: 6 }}>
            {faqItems.map((f, i) => (
              <div
                key={f.id ?? `new-${i}`}
                {...dragHandlers(i)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: dragOverIndex === i ? "1px dashed var(--theme-elevation-800)" : "1px solid var(--theme-elevation-100)",
                  cursor: "grab",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--theme-elevation-600)" }}>⠿ {f.question || `Question ${i + 1}`}</span>
                <button type="button" onClick={() => removeFaqItem(i)} style={removeBtnStyle} title="Remove this question">
                  Remove
                </button>
              </div>
            ))}
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
