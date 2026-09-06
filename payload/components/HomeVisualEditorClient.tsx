"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { AudienceBlock, Home, HeroBlock } from "@/payload/payload-types";
import { saveHomeSections } from "./homeVisualEditorActions";
import { ListManager, TextPreview } from "./visual-editor/ListManager";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { Field } from "./visual-editor/Field";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
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

export function HomeVisualEditorClient({ initialData, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const dragIndexRef = useRef<number | null>(null);
  // Which section's PhotoSlots opened the picker — `picking` itself is only
  // the photo's index *within* that section's images array.
  const pickingSectionIndexRef = useRef<number | null>(null);

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
  } = useCloneState<Home>(initialData, () => {
    setStatus({ kind: "idle" });
    history.mark("data");
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
    overrides: { canUndo: canUndoOverrides, canRedo: canRedoOverrides, undo: undoOverrides, redo: redoOverrides },
  };
  const canUndo = canUndoData || canUndoOverrides;
  const canRedo = canRedoData || canRedoOverrides;
  const handleUndo = () => history.undo(historySlices);
  const handleRedo = () => history.redo(historySlices);

  const sections = data.sections ?? [];
  const overallDirty = dirty || overridesDirty;
  useUnsavedChangesGuard(overallDirty);

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

  const findSectionIndex = (sectionKey: string) => sections.findIndex((s, i) => String(s.id ?? i) === sectionKey);

  // Explicit per-blockType dispatch, same discipline as every other
  // migrated page's handleFieldCommit — an unrecognized path logs and
  // no-ops instead of risking a write to the wrong block/field.
  const handleFieldCommit = (path: string, value: string) => {
    const segs = path.split(".");
    const idx = findSectionIndex(segs[0]);
    if (idx < 0) {
      // eslint-disable-next-line no-console
      console.warn("[home-visual-editor] unrecognized section in path from live canvas:", path);
      return;
    }
    set((d) => {
      const section = d.sections![idx];
      if (section.blockType === "hero") {
        if (segs[1] === "description" || segs[1] === "primaryCtaLabel" || segs[1] === "secondaryCtaLabel") {
          (section as HeroBlock)[segs[1]] = value;
          return;
        }
        if (segs[1] === "featuredPhoto" && (segs[2] === "heading" || segs[2] === "ctaLabel")) {
          const hb = section as HeroBlock;
          hb.featuredPhoto = { ...hb.featuredPhoto, [segs[2]]: value };
          return;
        }
        if (segs[1] === "logosStrip" && segs[2] === "ctaLabel") {
          const hb = section as HeroBlock;
          hb.logosStrip = { ...hb.logosStrip, ctaLabel: value };
          return;
        }
      } else if (section.blockType === "diff" && segs[1] === "heading") {
        section.heading = value;
        return;
      } else if (section.blockType === "cta" && (segs[1] === "heading" || segs[1] === "ctaLabel")) {
        section[segs[1]] = value;
        return;
      } else if (section.blockType === "audience") {
        const ab = section as AudienceBlock;
        if (segs[1] === "heading") {
          ab.heading = value;
          return;
        }
        if (segs[1] === "areas") {
          const areaIdx = (ab.areas ?? []).findIndex((a, i) => String(a.id ?? i) === segs[2]);
          if (areaIdx >= 0 && (segs[3] === "title" || segs[3] === "text")) {
            ab.areas![areaIdx][segs[3]] = value;
          }
          return;
        }
      } else if (section.blockType === "stories" && (segs[1] === "eyebrow" || segs[1] === "heading")) {
        section[segs[1]] = value;
        return;
      }
      // eslint-disable-next-line no-console
      console.warn("[home-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  const handleMobileFieldCommit = (path: string, value: string) => setOverride(path, value);

  const handleImageClick = (path: string) => {
    const segs = path.split(".");
    if (segs[1] !== "featuredPhoto" || segs[2] !== "images") return;
    const idx = findSectionIndex(segs[0]);
    if (idx < 0) return;
    pickingSectionIndexRef.current = idx;
    setPicking(0);
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    set((d) => {
      const arr = d.sections ?? [];
      const [item] = arr.splice(from, 1);
      arr.splice(to, 0, item);
    });
  };

  const rowLabel: React.CSSProperties = { fontSize: 13, fontWeight: 600, color: "var(--theme-text)" };

  const heroSection = sections.find((s): s is HeroBlock => s.blockType === "hero");
  const heroIndex = sections.findIndex((s) => s.blockType === "hero");

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Home — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text or photo below to see
            what it is, click to edit it in place. Reordering sections, the rotating hero words (not
            clickable on the page itself), and adding/removing service areas or photos happen in the
            panel underneath. Stats, client logos, and testimonials come from their own collections/
            globals — not editable here. SEO and adding/removing whole sections stay in the{" "}
            <a href="/admin/globals/home">regular form</a>.
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
          {/* Home's field paths are keyed by section (e.g. "<sectionId>.description"),
              not nested under a "sections" property — pass the sections array itself
              as the resync root so getByPath's array-by-id lookup matches the first
              path segment directly. */}
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} dirty={overallDirty} title="Home page — live canvas" data={sections} onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Manage sections — drag to reorder
        </span>
        <div style={{ display: "grid", gap: 6 }}>
          {sections.map((section, i) => (
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
                padding: "8px 10px",
                borderRadius: 6,
                border: dragOverIndex === i ? "1px dashed var(--theme-elevation-800)" : "1px solid var(--theme-elevation-100)",
                fontSize: 12,
                color: "var(--theme-elevation-600)",
                cursor: "grab",
              }}
            >
              ⠿ {i + 1} · {BLOCK_LABEL[section.blockType] ?? section.blockType}
            </div>
          ))}
        </div>

        {heroSection && (
          <>
            <ListManager
              label="Rotating hero words — not shown on the page itself, so not clickable above"
              itemLabel="word"
              items={heroSection.rotatingWords ?? []}
              onAdd={() => set((d) => {
                const hb = d.sections![heroIndex] as HeroBlock;
                hb.rotatingWords = [...(hb.rotatingWords ?? []), { word: "" }];
              })}
              onRemove={(wi) => set((d) => { (d.sections![heroIndex] as HeroBlock).rotatingWords!.splice(wi, 1); })}
              renderItem={(w, wi) => (
                <Field
                  label={`Rotating word ${wi + 1}`}
                  value={w.word ?? ""}
                  onChange={(v) => set((d) => { ((d.sections![heroIndex] as HeroBlock).rotatingWords![wi].word) = v; })}
                  style={{ fontSize: 14 }}
                />
              )}
            />

            <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
              <span style={{ ...rowLabel, display: "block", marginBottom: 8 }}>Top Banner — featured photos</span>
              <PhotoSlots
                photos={heroSection.featuredPhoto?.images ?? []}
                resolve={mediaById}
                onPick={(index) => { pickingSectionIndexRef.current = heroIndex; setPicking(index); }}
                onRemove={(index) =>
                  set((d) => {
                    (d.sections![heroIndex] as HeroBlock).featuredPhoto!.images!.splice(index, 1);
                  })
                }
              />
            </div>
          </>
        )}

        {sections.map((section, i) => {
          if (section.blockType !== "audience") return null;
          const ab = section as AudienceBlock;
          return (
            <ListManager
              key={section.id ?? i}
              label="Service Areas — cards"
              itemLabel="card"
              items={ab.areas ?? []}
              maxRows={4}
              onAdd={() => set((d) => {
                const b = d.sections![i] as AudienceBlock;
                b.areas = [...(b.areas ?? []), { title: "", text: "" }];
              })}
              onRemove={(ai) => set((d) => { (d.sections![i] as AudienceBlock).areas!.splice(ai, 1); })}
              renderItem={(a) => <TextPreview text={[a.title, a.text].filter(Boolean).join(" — ")} />}
            />
          );
        })}

        {sections.some((s) => s.blockType === "stats" || s.blockType === "divider") && (
          <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)", background: "var(--theme-elevation-50, transparent)" }}>
            <p style={{ fontSize: 12.5, color: "var(--theme-elevation-600)", margin: 0 }}>
              The Stats section reads the separate{" "}
              <a href="/admin/globals/stats">Stats global</a>, and the video divider&apos;s upload lives in
              the <a href="/admin/globals/home">regular form</a> — neither has fields here.
            </p>
          </div>
        )}
      </div>

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
