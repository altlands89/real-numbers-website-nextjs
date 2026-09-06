"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { OurExpertisePage } from "@/payload/payload-types";
import { saveOurExpertisePage } from "./ourExpertiseVisualEditorActions";
import { ListManager, TextPreview, removeBtnStyle } from "./visual-editor/ListManager";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
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

type Props = {
  initialData: OurExpertisePage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

const EMPTY_AREA = { title: "", tagline: "", paragraphs: [{ text: "" }], services: [{ label: "" }] };

export function OurExpertiseVisualEditorClient({ initialData, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const history = useLastTouchedHistory();
  const {
    data,
    set,
    dirty,
    setDirty,
    undo: undoData,
    redo: redoData,
    canUndo: canUndoData,
    canRedo: canRedoData,
  } = useCloneState<OurExpertisePage>(initialData, () => {
    setStatus({ kind: "idle" });
    history.mark("data");
  });
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { dragHandlers: areaDragHandlers, dragOverIndex: areaDragOverIndex } = useDragReorder((from, to) =>
    set((d) => {
      const list = d.areas ?? [];
      if (from === to || from < 0 || from >= list.length) return;
      const [item] = list.splice(from, 1);
      list.splice(to, 0, item);
    }),
  );
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
    overrides: { canUndo: canUndoOverrides, canRedo: canRedoOverrides, undo: undoOverrides, redo: redoOverrides },
  };
  const canUndo = canUndoData || canUndoOverrides;
  const canRedo = canRedoData || canRedoOverrides;
  const handleUndo = () => history.undo(historySlices);
  const handleRedo = () => history.redo(historySlices);

  const overallDirty = dirty || overridesDirty;

  useUnsavedChangesGuard(overallDirty);

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

  const handleFieldCommit = (path: string, value: string) => {
    const segs = path.split(".");
    set((d) => {
      if (path === "hero.eyebrow") { d.hero.eyebrow = value; return; }
      if (path === "hero.heading") { d.hero.heading = value; return; }
      if (segs[0] === "hero" && segs[1] === "ledeParagraphs") {
        const idx = (d.hero?.ledeParagraphs ?? []).findIndex((p, i) => String(p.id ?? i) === segs[2]);
        if (idx >= 0) d.hero.ledeParagraphs![idx].text = value;
        return;
      }
      if (segs[0] === "areas") {
        const areaIdx = (d.areas ?? []).findIndex((a, i) => String(a.id ?? i) === segs[1]);
        if (areaIdx < 0) return;
        if (segs[2] === "title" || segs[2] === "tagline") {
          d.areas![areaIdx][segs[2]] = value;
          return;
        }
        if (segs[2] === "paragraphs") {
          const pIdx = (d.areas![areaIdx].paragraphs ?? []).findIndex((p, i) => String(p.id ?? i) === segs[3]);
          if (pIdx >= 0) d.areas![areaIdx].paragraphs![pIdx].text = value;
          return;
        }
        if (segs[2] === "services") {
          const sIdx = (d.areas![areaIdx].services ?? []).findIndex((s, i) => String(s.id ?? i) === segs[3]);
          if (sIdx >= 0) d.areas![areaIdx].services![sIdx].label = value;
          return;
        }
        return;
      }
      if (path === "integrated.heading") { d.integrated = { ...d.integrated, heading: value }; return; }
      if (path === "integrated.text") { d.integrated = { ...d.integrated, text: value }; return; }
      if (path === "integrated.photoCaption") { d.integrated = { ...d.integrated, photoCaption: value }; return; }
      if (path === "closingCta.heading") { d.closingCta = { ...d.closingCta, heading: value }; return; }
      if (path === "closingCta.closingLine") { d.closingCta = { ...d.closingCta, closingLine: value }; return; }
      if (path === "closingCta.buttonLabel") { d.closingCta = { ...d.closingCta, buttonLabel: value }; return; }
      // eslint-disable-next-line no-console
      console.warn("[our-expertise-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  const handleMobileFieldCommit = (path: string, value: string) => setOverride(path, value);

  const handleImageClick = (path: string) => {
    if (path === "integrated.photos") setPicking(0);
  };

  const rowLabel: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--theme-text)" };

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Our Expertise — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text or photo below to see
            what it is, click to edit it in place. Adding/removing areas, paragraphs, service tags or
            photos happens in the panel underneath. SEO stays in the{" "}
            <a href="/admin/globals/our-expertise-page">regular form</a>.
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
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} dirty={overallDirty} title="Our Expertise page — live canvas" data={data} onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Manage lists
        </span>

        <ListManager
          label="Intro paragraphs"
          itemLabel="paragraph"
          items={data.hero?.ledeParagraphs ?? []}
          maxRows={2}
          onAdd={() => set((d) => { d.hero.ledeParagraphs = [...(d.hero.ledeParagraphs ?? []), { text: "" }]; })}
          onRemove={(i) => set((d) => { d.hero.ledeParagraphs!.splice(i, 1); })}
          renderItem={(p) => <TextPreview text={p.text ?? ""} />}
        />

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={rowLabel}>Expertise areas ({(data.areas ?? []).length}/4) — drag to reorder</span>
            <button
              type="button"
              onClick={() => set((d) => { d.areas = [...(d.areas ?? []), structuredClone(EMPTY_AREA)]; })}
              disabled={(data.areas?.length ?? 0) >= 4}
              style={{
                border: "1px dashed var(--theme-elevation-250)",
                background: "var(--theme-elevation-0)",
                color: (data.areas?.length ?? 0) >= 4 ? "var(--theme-elevation-350)" : "var(--theme-text)",
                borderRadius: 6,
                padding: "6px 12px",
                fontSize: 12,
                fontWeight: 600,
                cursor: (data.areas?.length ?? 0) >= 4 ? "default" : "pointer",
              }}
              title={(data.areas?.length ?? 0) >= 4 ? "Up to 4 areas — remove one to add another" : undefined}
            >
              + Add area
            </button>
          </div>
          <div style={{ display: "grid", gap: 10 }}>
            {(data.areas ?? []).map((a, ai) => (
              <div
                key={a.id ?? ai}
                style={{
                  borderRadius: 6,
                  border: areaDragOverIndex === ai ? "1px dashed var(--theme-elevation-800)" : "1px solid var(--theme-elevation-100)",
                  overflow: "hidden",
                }}
              >
                <div
                  {...areaDragHandlers(ai)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "8px 10px",
                    cursor: "grab",
                    background: "var(--theme-elevation-50, transparent)",
                  }}
                >
                  <span style={{ fontSize: 12, fontWeight: 600, color: "var(--theme-elevation-600)" }}>⠿ {a.title || `Area ${ai + 1}`}</span>
                  {(data.areas?.length ?? 0) > 1 && (
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm("Remove this whole area, including its paragraphs and tags? You can still Undo before you click Publish, but not after.")) {
                          set((d) => { d.areas!.splice(ai, 1); });
                        }
                      }}
                      style={removeBtnStyle}
                    >
                      Remove area
                    </button>
                  )}
                </div>
                <div style={{ padding: "8px 10px", display: "grid", gap: 8 }}>
                  <ListManager
                    label="Paragraphs"
                    itemLabel="paragraph"
                    items={a.paragraphs ?? []}
                    onAdd={() => set((d) => { d.areas![ai].paragraphs = [...(d.areas![ai].paragraphs ?? []), { text: "" }]; })}
                    onRemove={(pi) => set((d) => { d.areas![ai].paragraphs!.splice(pi, 1); })}
                    renderItem={(p) => <TextPreview text={p.text ?? ""} />}
                  />
                  <ListManager
                    label="Tags"
                    itemLabel="tag"
                    items={a.services ?? []}
                    onAdd={() => set((d) => { d.areas![ai].services = [...(d.areas![ai].services ?? []), { label: "" }]; })}
                    onRemove={(si) => set((d) => { d.areas![ai].services!.splice(si, 1); })}
                    renderItem={(s) => <TextPreview text={s.label ?? ""} placeholder="(empty — click it on the page above to add text)" />}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <span style={{ ...rowLabel, display: "block", marginBottom: 8 }}>Integrated Partnership — photos</span>
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
        </div>
      </div>

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
