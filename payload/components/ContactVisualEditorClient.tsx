"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactPage } from "@/payload/payload-types";
import { saveContactPage } from "./contactVisualEditorActions";
import { Field } from "./visual-editor/Field";
import { useCloneState } from "./visual-editor/useCloneState";
import type { BrandColors } from "./visual-editor/serverData";

type Props = {
  initialData: ContactPage;
  colors: BrandColors;
};

export function ContactVisualEditorClient({ initialData, colors }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const { data, set, dirty, setDirty } = useCloneState<ContactPage>(initialData, () => setStatus({ kind: "idle" }));

  const save = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const result = await saveContactPage({
        hero: { eyebrow: data.hero?.eyebrow ?? "", heading: data.hero?.heading ?? "" },
        directContact: {
          label: data.directContact?.label ?? "",
          whatsappNumber: data.directContact?.whatsappNumber ?? "",
          email: data.directContact?.email ?? "",
        },
        manifesto: { heading: data.manifesto?.heading ?? "", text: data.manifesto?.text ?? "" },
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

  const type = {
    eyebrow: { fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" as const, color: colors.clay },
    h1: { fontSize: 30, fontWeight: 800, lineHeight: 1.02, letterSpacing: "-0.03em", color: colors.offwhite },
    directLabel: { fontSize: 13, fontWeight: 700, color: colors.black },
    directValue: { fontSize: 12, color: colors.red, fontWeight: 600 },
    h3: { fontSize: 17, fontWeight: 700, lineHeight: 1.15, color: colors.blue },
    body: { fontSize: 12, lineHeight: 1.6, color: "rgba(36,30,28,0.82)" },
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
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Contact — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 560 }}>
            The Contact page in schematic form — each text sits where it appears on the real page, at
            roughly its real size. Hover or click any text to edit it. SEO stays in the{" "}
            <a href="/admin/globals/contact-page">regular form</a>.
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
        {/* Section 1 — dark top banner (page-hero, no lede on this page) */}
        <div style={{ background: colors.black, padding: "40px 34px 34px", position: "relative" }}>
          <span style={{ ...sectionLabel, color: "rgba(240,239,232,0.35)" }}>1 · Top banner</span>
          <div style={{ display: "grid", gap: 12, maxWidth: 560 }}>
            <Field
              label="Small label"
              value={data.hero?.eyebrow ?? ""}
              onChange={(v) => set((d) => { d.hero.eyebrow = v; })}
              style={type.eyebrow}
              placeholder="Contact"
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

        {/* Sections 2–3 — light prose area */}
        <div style={{ background: colors.offwhite, padding: "30px 34px 40px" }}>
          {/* Section 2 — Contact form + direct contact */}
          <span style={sectionLabel}>2 · Contact form</span>
          <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 26, alignItems: "start" }}>
            <div
              style={{
                border: "1px dashed rgba(36,30,28,0.25)",
                borderRadius: 8,
                padding: 18,
                fontSize: 11,
                color: "rgba(36,30,28,0.5)",
                fontFamily: "system-ui, sans-serif",
                fontStyle: "italic",
              }}
            >
              The form fields themselves (Name, Email, Message) aren't connected to any content yet —
              nothing here to edit. Only the direct-contact details on the right are.
            </div>
            <div style={{ display: "grid", gap: 8 }}>
              <Field
                label="Direct contact — heading"
                value={data.directContact?.label ?? ""}
                onChange={(v) => set((d) => { d.directContact = { ...d.directContact, label: v }; })}
                style={type.directLabel}
                placeholder="Prefer a direct conversation?"
              />
              <Field
                label="WhatsApp number (digits + country code, e.g. 972501234567)"
                value={data.directContact?.whatsappNumber ?? ""}
                onChange={(v) => set((d) => { d.directContact = { ...d.directContact, whatsappNumber: v }; })}
                style={type.directValue}
                placeholder="972501234567"
              />
              <Field
                label="Email address"
                value={data.directContact?.email ?? ""}
                onChange={(v) => set((d) => { d.directContact = { ...d.directContact, email: v }; })}
                style={type.directValue}
                placeholder="hello@realnumbers.co.il"
              />
            </div>
          </div>

          {/* Section 3 — Closing Statement */}
          <div style={block}>
            <span style={sectionLabel}>3 · Closing statement</span>
            <div style={{ display: "grid", gap: 8, maxWidth: 620 }}>
              <Field
                label="Statement"
                value={data.manifesto?.heading ?? ""}
                onChange={(v) => set((d) => { d.manifesto = { ...d.manifesto, heading: v }; })}
                style={type.h3}
                multiline
              />
              <Field
                label="Supporting text"
                value={data.manifesto?.text ?? ""}
                onChange={(v) => set((d) => { d.manifesto = { ...d.manifesto, text: v }; })}
                style={type.body}
                multiline
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
