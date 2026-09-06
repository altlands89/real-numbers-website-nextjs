"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamPage } from "@/payload/payload-types";
import { saveTeamPage, saveTeamRoster } from "./teamVisualEditorActions";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { LiveCanvas } from "./visual-editor/LiveCanvas";
import { MobilePreview } from "./visual-editor/MobilePreview";
import { photoBtn, type MediaItem } from "./visual-editor/shared";
import type { BrandColors } from "./visual-editor/serverData";

export type RosterMember = {
  id: number | null;
  name: string;
  role: string;
  bio: string;
  education: string;
  photo: number | { id: number; url?: string | null } | null;
};

type Props = {
  initialData: TeamPage;
  initialRoster: RosterMember[];
  colors: BrandColors;
  mediaLibrary: MediaItem[];
  pageUrl: string;
};

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function TeamVisualEditorClient({ initialData, initialRoster, mediaLibrary, pageUrl }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });
  const [previewKey, setPreviewKey] = useState(0);

  const onMutate = () => setStatus({ kind: "idle" });
  const { data, set, dirty, setDirty } = useCloneState<TeamPage>(initialData, onMutate);
  const { data: roster, set: setRoster, dirty: rosterDirty, setDirty: setRosterDirty } = useCloneState<
    RosterMember[]
  >(initialRoster, onMutate);
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);
  const { overrides, setOverride, dirty: overridesDirty, setDirty: setOverridesDirty } = useMobileOverrides(
    initialData.mobileOverrides as Record<string, unknown> | null | undefined,
  );

  const overallDirty = dirty || rosterDirty || overridesDirty;

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const pageResult = await saveTeamPage({
        hero: {
          eyebrow: data.hero?.eyebrow ?? "",
          heading: data.hero?.heading ?? "",
          lede: data.hero?.lede ?? "",
        },
        sectionHeading: data.sectionHeading ?? "",
        closingCta: {
          heading: data.closingCta?.heading ?? "",
          closingLine: data.closingCta?.closingLine ?? "",
          buttonLabel: data.closingCta?.buttonLabel ?? "",
        },
        mobileOverrides: overrides,
      });
      if (!pageResult.ok) throw new Error(pageResult.error);

      const rosterResult = await saveTeamRoster(
        roster.map((m) => ({
          id: m.id,
          name: m.name,
          role: m.role,
          bio: m.bio,
          education: m.education,
          photo: typeof m.photo === "object" ? (m.photo?.id ?? null) : m.photo,
        })),
      );
      if (!rosterResult.ok) throw new Error(rosterResult.error);

      setDirty(false);
      setRosterDirty(false);
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
    if (segs[0] === "roster") {
      const idx = roster.findIndex((m, i) => String(m.id ?? `new-${i}`) === segs[1]);
      if (idx >= 0 && (segs[2] === "name" || segs[2] === "role" || segs[2] === "bio" || segs[2] === "education")) {
        setRoster((d) => { d[idx][segs[2] as "name" | "role" | "bio" | "education"] = value; });
      } else {
        // eslint-disable-next-line no-console
        console.warn("[team-visual-editor] unrecognized roster path from live canvas:", path);
      }
      return;
    }
    set((d) => {
      if (path === "hero.eyebrow") { d.hero.eyebrow = value; return; }
      if (path === "hero.heading") { d.hero.heading = value; return; }
      if (path === "hero.lede") { d.hero.lede = value; return; }
      if (path === "sectionHeading") { d.sectionHeading = value; return; }
      if (path === "closingCta.heading") { d.closingCta = { ...d.closingCta, heading: value }; return; }
      if (path === "closingCta.closingLine") { d.closingCta = { ...d.closingCta, closingLine: value }; return; }
      if (path === "closingCta.buttonLabel") { d.closingCta = { ...d.closingCta, buttonLabel: value }; return; }
      // eslint-disable-next-line no-console
      console.warn("[team-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  const handleMobileFieldCommit = (path: string, value: string) => setOverride(path, value);

  // Roster photos aren't individually clickable on the live page (plain
  // next/image, no slideshow) — always managed from the roster panel below.
  const handleImageClick = () => {};

  const addMember = () =>
    setRoster((d) => {
      d.push({ id: null, name: "New team member", role: "", bio: "", education: "", photo: null });
    });
  const removeMember = (i: number) => {
    if (!window.confirm("Remove this person from the team page? This can't be undone from here.")) return;
    setRoster((d) => {
      d.splice(i, 1);
    });
  };
  const reorderMembers = (from: number, to: number) =>
    setRoster((d) => {
      if (from === to || from < 0 || from >= d.length) return;
      const [item] = d.splice(from, 1);
      d.splice(to, 0, item);
    });
  const { dragHandlers, dragOverIndex } = useDragReorder(reorderMembers);

  const resolvePhotoUrl = useCallback(
    (photo: RosterMember["photo"]) => {
      if (!photo) return undefined;
      if (typeof photo === "object") return photo.url ?? mediaById(photo.id)?.url;
      return mediaById(photo)?.url;
    },
    [mediaById],
  );

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
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Team — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text below — including a
            team member&apos;s name, role, bio or education — to edit it in place. Adding, removing,
            reordering and photo changes for the roster happen in the panel underneath. SEO stays in the{" "}
            <a href="/admin/globals/team-page">regular form</a>; the roster also has its own{" "}
            <a href="/admin/collections/team-members">collection screen</a> if you prefer a plain form.
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
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} title="Team page — live canvas" onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
            Manage roster — drag to reorder
          </span>
          <button
            type="button"
            onClick={addMember}
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
            + Add team member
          </button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {roster.map((m, i) => {
            const url = resolvePhotoUrl(m.photo);
            return (
              <div
                key={m.id ?? `new-${i}`}
                {...dragHandlers(i)}
                style={{
                  display: "grid",
                  gap: 8,
                  padding: 10,
                  borderRadius: 8,
                  border: `1px solid ${dragOverIndex === i ? "var(--theme-elevation-800)" : "var(--theme-elevation-150)"}`,
                  cursor: "grab",
                }}
              >
                <div style={{ display: "flex", gap: 10 }}>
                  <div style={{ position: "relative", width: 44, height: 44, flexShrink: 0, borderRadius: 6, overflow: "hidden", background: "var(--theme-elevation-100)" }}>
                    {url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", fontSize: 13, fontWeight: 700, color: "var(--theme-elevation-500)" }}>
                        {initials(m.name || "?")}
                      </div>
                    )}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--theme-text)", alignSelf: "center" }}>
                    {m.name || `Person ${i + 1}`}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <button type="button" onClick={() => setPicking(i)} style={photoBtn}>
                    {url ? "Change photo" : "Add photo"}
                  </button>
                  {url && (
                    <button type="button" onClick={() => setRoster((d) => { d[i].photo = null; })} style={photoBtn}>
                      Remove photo
                    </button>
                  )}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "var(--theme-elevation-500)", cursor: "grab" }} title="Drag to reorder">
                    ⠿ Drag to reorder
                  </span>
                  <button type="button" onClick={() => removeMember(i)} style={cardBtn} title="Remove this person">
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {picking !== null && picking !== "new" && (
        <MediaPicker
          library={library}
          onUpload={registerUpload}
          onClose={() => setPicking(null)}
          onSelect={(id) => {
            setRoster((d) => {
              d[picking].photo = id;
            });
            setPicking(null);
          }}
        />
      )}
    </div>
  );
}
