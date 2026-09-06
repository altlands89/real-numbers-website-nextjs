"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { AboutPage } from "@/payload/payload-types";
import { saveAboutPage } from "./aboutVisualEditorActions";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { useLastTouchedHistory } from "./visual-editor/useCombinedHistory";
import { UndoRedoBar } from "./visual-editor/UndoRedoBar";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { LiveCanvas } from "./visual-editor/LiveCanvas";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";
import type { MediaItem } from "./visual-editor/shared";

type Props = {
  initialData: AboutPage;
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

export function AboutVisualEditorClient({ initialData, mediaLibrary, pageUrl }: Props) {
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
  } = useCloneState<AboutPage>(initialData, () => {
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
          paragraphs: (data.ourStory?.paragraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
          photos: (data.ourStory?.photos ?? [])
            .map((p) => ({ image: typeof p.image === "object" ? p.image?.id : p.image }))
            .filter((p): p is { image: number } => typeof p.image === "number"),
          photoCaption: data.ourStory?.photoCaption ?? "",
        },
        whatWeBelieve: {
          heading: data.whatWeBelieve?.heading ?? "",
          intro: data.whatWeBelieve?.intro ?? "",
          principles: (data.whatWeBelieve?.principles ?? []).map((p) => ({ id: p.id, lead: p.lead ?? "", text: p.text ?? "" })),
        },
        howWeWork: {
          heading: data.howWeWork?.heading ?? "",
          paragraphs: (data.howWeWork?.paragraphs ?? []).map((p) => ({ id: p.id, text: p.text ?? "" })),
        },
        leadership: {
          heading: data.leadership?.heading ?? "",
          cards: (data.leadership?.cards ?? []).map((c) => ({ id: c.id, name: c.name ?? "", role: c.role ?? "", bio: c.bio ?? "" })),
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

  // Mobile preview's live-iframe click → inline edit → commit lands here.
  // Unlike the desktop canvas, this always writes a *mobile override*
  // (never the shared desktop value) — EditorBridgeListener decides this
  // is a mobile-viewport edit by the iframe's own 390px width, and
  // mobileOverrides is already a flat {path: value} map, so no per-field
  // dispatch table is needed the way the desktop commit below needs one.
  const handleMobileFieldCommit = (path: string, value: string) => {
    setOverride(path, value);
  };

  // The main canvas's live-iframe click → inline edit → commit lands here.
  // Explicit per-path dispatch (not a generic path-parser) so a stray/
  // unrecognized path can never silently write to the wrong field — it
  // just logs and no-ops instead.
  const handleFieldCommit = (path: string, value: string) => {
    const segs = path.split(".");
    set((d) => {
      if (path === "hero.eyebrow") { d.hero.eyebrow = value; return; }
      if (path === "hero.heading") { d.hero.heading = value; return; }
      if (path === "hero.lede") { d.hero.lede = value; return; }
      if (path === "ourStory.heading") { d.ourStory = { ...d.ourStory, heading: value }; return; }
      if (path === "ourStory.photoCaption") { d.ourStory = { ...d.ourStory, photoCaption: value }; return; }
      if (segs[0] === "ourStory" && segs[1] === "paragraphs") {
        const idx = (d.ourStory?.paragraphs ?? []).findIndex((p, i) => String(p.id ?? i) === segs[2]);
        if (idx >= 0) d.ourStory!.paragraphs![idx].text = value;
        return;
      }
      if (path === "whatWeBelieve.heading") { d.whatWeBelieve = { ...d.whatWeBelieve, heading: value }; return; }
      if (path === "whatWeBelieve.intro") { d.whatWeBelieve = { ...d.whatWeBelieve, intro: value }; return; }
      if (segs[0] === "whatWeBelieve" && segs[1] === "principles") {
        const idx = (d.whatWeBelieve?.principles ?? []).findIndex((p, i) => String(p.id ?? i) === segs[2]);
        if (idx >= 0 && (segs[3] === "lead" || segs[3] === "text")) d.whatWeBelieve!.principles![idx][segs[3]] = value;
        return;
      }
      if (path === "howWeWork.heading") { d.howWeWork = { ...d.howWeWork, heading: value }; return; }
      if (segs[0] === "howWeWork" && segs[1] === "paragraphs") {
        const idx = (d.howWeWork?.paragraphs ?? []).findIndex((p, i) => String(p.id ?? i) === segs[2]);
        if (idx >= 0) d.howWeWork!.paragraphs![idx].text = value;
        return;
      }
      if (path === "leadership.heading") { d.leadership = { ...d.leadership, heading: value }; return; }
      if (path === "leadership.note") { d.leadership = { ...d.leadership, note: value }; return; }
      if (path === "leadership.teamLinkLabel") { d.leadership = { ...d.leadership, teamLinkLabel: value }; return; }
      if (segs[0] === "leadership" && segs[1] === "cards") {
        const idx = (d.leadership?.cards ?? []).findIndex((c, i) => String(c.id ?? i) === segs[2]);
        if (idx >= 0 && (segs[3] === "name" || segs[3] === "role" || segs[3] === "bio")) d.leadership!.cards![idx][segs[3]] = value;
        return;
      }
      // eslint-disable-next-line no-console
      console.warn("[about-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  // The live canvas can only reach the currently-visible (first) slide of
  // a photo slideshow — clicking it is a shortcut for "change photo 1",
  // same as the first row in the Photos panel below.
  const handleImageClick = (path: string) => {
    if (path === "ourStory.photos") setPicking(0);
  };

  const rowLabel: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 600,
    color: "var(--theme-text)",
  };

  const rowWrap: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 14px",
    border: "1px solid var(--theme-elevation-150)",
    borderRadius: "var(--style-radius-s, 6px)",
  };

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>About — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text or photo below to
            see what it is, click to edit it in place. Adding/removing paragraphs, principles, cards
            or photos happens in the panel underneath. SEO stays in the{" "}
            <a href="/admin/globals/about-page">regular form</a>.
          </p>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
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

      <MobilePreview pageUrl={pageUrl} refreshKey={previewKey} inlineEditing onFieldCommit={handleMobileFieldCommit} />

      {/* ---- The real page, live, editable in place ---- */}
      <div style={{ marginTop: 14, border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-m, 8px)", overflow: "hidden", boxShadow: "0 12px 40px -20px rgba(36,30,28,0.4)" }}>
        <DeviceFrame>
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} title="About page — live canvas" data={data} onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      {/* ---- Manage lists — add/remove/reorder has no on-page gesture yet
          (see "Risks" in cached-whistling-hopper.md), and a slideshow's
          2nd+ photo isn't visible/clickable in the frozen canvas above. ---- */}
      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Manage lists
        </span>

        <div style={rowWrap}>
          <span style={rowLabel}>Our Story — paragraphs ({(data.ourStory?.paragraphs ?? []).length})</span>
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

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <span style={{ ...rowLabel, display: "block", marginBottom: 8 }}>Our Story — photos</span>
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
        </div>

        <div style={rowWrap}>
          <span style={rowLabel}>What We Believe — principles ({(data.whatWeBelieve?.principles ?? []).length})</span>
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

        <div style={rowWrap}>
          <span style={rowLabel}>How We Work — paragraphs ({(data.howWeWork?.paragraphs ?? []).length})</span>
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
