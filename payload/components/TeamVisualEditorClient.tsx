"use client";

import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import type { TeamPage } from "@/payload/payload-types";
import { saveTeamPage, saveTeamRoster } from "./teamVisualEditorActions";
import { Field } from "./visual-editor/Field";
import { MediaPicker } from "./visual-editor/MediaPicker";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMediaPicker } from "./visual-editor/useMediaPicker";
import { useDragReorder } from "./visual-editor/useDragReorder";
import { eyebrowStyle, pageHeroH1Style, pageHeroLedeStyle, sectionH2Style } from "./visual-editor/typeScale";
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
};

function initials(name: string) {
  return name.trim().split(/\s+/).filter(Boolean).map((p) => p[0]?.toUpperCase()).join("") || "?";
}

export function TeamVisualEditorClient({ initialData, initialRoster, colors, mediaLibrary }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const onMutate = () => setStatus({ kind: "idle" });
  const { data, set, dirty, setDirty } = useCloneState<TeamPage>(initialData, onMutate);
  const { data: roster, set: setRoster, dirty: rosterDirty, setDirty: setRosterDirty } = useCloneState<
    RosterMember[]
  >(initialRoster, onMutate);
  const { library, mediaById, picking, setPicking, registerUpload } = useMediaPicker(mediaLibrary);

  const overallDirty = dirty || rosterDirty;

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
      setStatus({ kind: "ok", message: "Published — live on the site." });
      router.refresh();
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const sessionExpired = status.kind === "error" && /not signed in/i.test(status.message ?? "");

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

  const type = {
    eyebrow: eyebrowStyle(colors),
    h1: pageHeroH1Style(colors),
    lede: pageHeroLedeStyle(),
    h2: sectionH2Style(colors),
    name: { fontSize: "18.4px", fontWeight: 700, color: colors.blue },
    role: { fontSize: 12, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: colors.red },
    bio: { fontSize: 14, lineHeight: 1.6, color: "rgba(36,30,28,0.82)" },
    education: { fontSize: 12, fontWeight: 600, color: "rgba(36,30,28,0.7)" },
    closingH2: sectionH2Style(colors, true),
    closingLine: { fontSize: 14, lineHeight: 1.5, color: colors.offwhite, opacity: 0.8 },
    button: { fontSize: 13, fontWeight: 700, color: colors.offwhite },
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
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Team — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Team page in schematic form, including the roster — add, remove, reorder, and edit cards
            right here. Hover or click any text to edit it. SEO stays in the{" "}
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
              placeholder="Our Team"
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
          {/* Section 2 — Team List */}
          <span style={sectionLabel}>2 · Team list</span>
          <Field
            label="Section title"
            value={data.sectionHeading ?? ""}
            onChange={(v) => set((d) => { d.sectionHeading = v; })}
            style={type.h2}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 16 }}>
            {roster.map((m, i) => {
              const url = resolvePhotoUrl(m.photo);
              return (
                <div
                  key={m.id ?? `new-${i}`}
                  {...dragHandlers(i)}
                  style={{
                    display: "grid",
                    gap: 8,
                    background: "rgba(255,255,255,0.6)",
                    border: dragOverIndex === i ? `1px dashed ${colors.blue}` : "1px solid rgba(36,30,28,0.12)",
                    borderRadius: 8,
                    padding: 14,
                    cursor: "grab",
                  }}
                >
                  <div style={{ display: "flex", gap: 10 }}>
                    <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0, borderRadius: 6, overflow: "hidden" }}>
                      {url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            display: "grid",
                            placeItems: "center",
                            background: i % 2 === 0 ? colors.blue : colors.red,
                            color: colors.offwhite,
                            fontSize: 16,
                            fontWeight: 700,
                          }}
                        >
                          {initials(m.name || "?")}
                        </div>
                      )}
                    </div>
                    <div style={{ display: "grid", gap: 4, flex: 1, minWidth: 0 }}>
                      <Field
                        label={`Person ${i + 1} · name`}
                        value={m.name}
                        onChange={(v) => setRoster((d) => { d[i].name = v; })}
                        style={type.name}
                      />
                      <Field
                        label={`Person ${i + 1} · job title`}
                        value={m.role}
                        onChange={(v) => setRoster((d) => { d[i].role = v; })}
                        style={type.role}
                      />
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button type="button" onClick={() => setPicking(i)} style={photoBtn}>
                      {url ? "Change photo" : "Add photo"}
                    </button>
                    {url && (
                      <button
                        type="button"
                        onClick={() => setRoster((d) => { d[i].photo = null; })}
                        style={photoBtn}
                      >
                        Remove photo
                      </button>
                    )}
                  </div>
                  <Field
                    label={`Person ${i + 1} · bio`}
                    value={m.bio}
                    onChange={(v) => setRoster((d) => { d[i].bio = v; })}
                    style={type.bio}
                    multiline
                  />
                  <Field
                    label={`Person ${i + 1} · education (optional)`}
                    value={m.education}
                    onChange={(v) => setRoster((d) => { d[i].education = v; })}
                    style={type.education}
                    placeholder="Education / credential — leave blank to hide"
                  />
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 11, color: "rgba(36,30,28,0.4)", cursor: "grab" }} title="Drag to reorder">
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
          <button
            type="button"
            onClick={addMember}
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
            + Add team member
          </button>

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
                label="Supporting line"
                value={data.closingCta?.closingLine ?? ""}
                onChange={(v) => set((d) => { d.closingCta = { ...d.closingCta, closingLine: v }; })}
                style={type.closingLine}
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
