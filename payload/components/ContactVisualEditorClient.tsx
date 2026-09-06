"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import type { ContactPage } from "@/payload/payload-types";
import { saveContactPage } from "./contactVisualEditorActions";
import { Field } from "./visual-editor/Field";
import { useCloneState } from "./visual-editor/useCloneState";
import { useMobileOverrides } from "./visual-editor/useMobileOverrides";
import { useLastTouchedHistory } from "./visual-editor/useCombinedHistory";
import { UndoRedoBar } from "./visual-editor/UndoRedoBar";
import { DeviceFrame } from "./visual-editor/DeviceFrame";
import { LiveCanvas } from "./visual-editor/LiveCanvas";
import { MobilePreview } from "./visual-editor/MobilePreview";
import type { BrandColors } from "./visual-editor/serverData";

type Props = {
  initialData: ContactPage;
  colors: BrandColors;
  pageUrl: string;
};

export function ContactVisualEditorClient({ initialData, pageUrl }: Props) {
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
  } = useCloneState<ContactPage>(initialData, () => {
    setStatus({ kind: "idle" });
    history.mark("data");
  });
  const {
    overrides,
    setOverride,
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
      const result = await saveContactPage({
        hero: { eyebrow: data.hero?.eyebrow ?? "", heading: data.hero?.heading ?? "" },
        directContact: {
          label: data.directContact?.label ?? "",
          whatsappNumber: data.directContact?.whatsappNumber ?? "",
          email: data.directContact?.email ?? "",
        },
        manifesto: { heading: data.manifesto?.heading ?? "", text: data.manifesto?.text ?? "" },
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
    set((d) => {
      if (path === "hero.eyebrow") { d.hero.eyebrow = value; return; }
      if (path === "hero.heading") { d.hero.heading = value; return; }
      if (path === "directContact.label") { d.directContact = { ...d.directContact, label: value }; return; }
      if (path === "manifesto.heading") { d.manifesto = { ...d.manifesto, heading: value }; return; }
      if (path === "manifesto.text") { d.manifesto = { ...d.manifesto, text: value }; return; }
      // eslint-disable-next-line no-console
      console.warn("[contact-visual-editor] unrecognized field path from live canvas:", path);
    });
  };

  const handleMobileFieldCommit = (path: string, value: string) => setOverride(path, value);

  // No image fields on this page.
  const handleImageClick = () => {};

  const type = {
    directValue: { fontSize: 14, color: "var(--theme-text)", fontWeight: 600 },
  };

  return (
    <div style={{ maxWidth: 1440, margin: "0 auto", padding: "28px 24px 80px" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 18 }}>
        <div>
          <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Contact — Visual Editor</h1>
          <p style={{ margin: 0, fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 620 }}>
            The real page, shown at desktop size and scaled to fit. Hover any text below to see what it
            is, click to edit it in place. The WhatsApp number/email used for the direct-contact links
            (not visible page text) are set in the panel underneath, and the form fields themselves
            (Name, Email, Message) aren&apos;t connected to any content yet. SEO stays in the{" "}
            <a href="/admin/globals/contact-page">regular form</a>.
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
          <LiveCanvas pageUrl={pageUrl} refreshKey={previewKey} title="Contact page — live canvas" data={data} onFieldCommit={handleFieldCommit} onImageClick={handleImageClick} />
        </DeviceFrame>
      </div>

      <div style={{ marginTop: 22, display: "grid", gap: 10 }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--theme-elevation-500)" }}>
          Direct contact links
        </span>
        <div style={{ padding: "10px 14px", border: "1px solid var(--theme-elevation-150)", borderRadius: "var(--style-radius-s, 6px)", display: "grid", gap: 8 }}>
          <p style={{ margin: 0, fontSize: 11, color: "var(--theme-elevation-500)" }}>
            Not visible page text — these drive the WhatsApp deep link and mailto:, so they don&apos;t
            have a mobile-only variant.
          </p>
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
    </div>
  );
}
