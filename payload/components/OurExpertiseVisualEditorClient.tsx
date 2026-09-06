"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { OurExpertisePage } from "@/payload/payload-types";
import { saveOurExpertisePage } from "./ourExpertiseVisualEditorActions";
import { RowActions } from "./visual-editor/RowActions";
import { PhotoSlots } from "./visual-editor/PhotoSlots";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { LiveCanvas } from "./visual-editor/LiveCanvas";
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

export function OurExpertiseVisualEditorClient({ initialData, mediaLibrary, pageUrl }: Props) {
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
  const { overrides, setOverride, dirty: overridesDirty, setDirty: setOverridesDirty } = useMobileOverrides(
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
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Our Expertise — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text or photo below to see
            what it is, click to edit it in place. Adding/removing areas, paragraphs, service tags or
            photos happens in the panel underneath. SEO stays in the{" "}
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

      <MobilePreview pageUrl={pageUrl} refreshKey={previewKey} inlineEditing onFieldCommit={handleMobileFieldCommit} />

      <div style={{ marginTop: 14, border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-m, 8px)", overflow: "hidden", boxShadow: "0 12px 40px -20px rgba(36,30,28,0.4)" }}>
        <DeviceFrame>
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} title="Our Expertise page — live canvas" onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Manage lists
        </span>

        <div style={rowWrap}>
          <span style={rowLabel}>Intro paragraphs ({(data.hero?.ledeParagraphs ?? []).length})</span>
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

        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={rowLabel}>Expertise areas ({(data.areas ?? []).length}) — drag to reorder</span>
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
          <div style={{ display: "grid", gap: 8 }}>
            {(data.areas ?? []).map((a, ai) => (
              <div
                key={a.id ?? ai}
                {...areaDragHandlers(ai)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: areaDragOverIndex === ai ? "1px dashed var(--theme-elevation-800)" : "1px solid var(--theme-elevation-100)",
                  cursor: "grab",
                }}
              >
                <span style={{ fontSize: 12, color: "var(--theme-elevation-600)" }}>⠿ {a.title || `Area ${ai + 1}`}</span>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, color: "var(--theme-elevation-500)" }}>
                    {(a.paragraphs ?? []).length} paragraph{(a.paragraphs ?? []).length === 1 ? "" : "s"}
                  </span>
                  <RowActions
                    onAdd={() => set((d) => { d.areas![ai].paragraphs = [...(d.areas![ai].paragraphs ?? []), { text: "" }]; })}
                    onRemove={
                      (a.paragraphs?.length ?? 0) > 1
                        ? () => set((d) => { d.areas![ai].paragraphs!.pop(); })
                        : undefined
                    }
                  />
                  <span style={{ fontSize: 11, color: "var(--theme-elevation-500)" }}>
                    {(a.services ?? []).length} tag{(a.services ?? []).length === 1 ? "" : "s"}
                  </span>
                  <RowActions
                    onAdd={() => set((d) => { d.areas![ai].services = [...(d.areas![ai].services ?? []), { label: "" }]; })}
                    onRemove={
                      (a.services?.length ?? 0) > 1
                        ? () => set((d) => { d.areas![ai].services!.pop(); })
                        : undefined
                    }
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
