"use client";

import React, { useState } from "react";
import { saveAIIntegration, testAIConnection, saveHandoffChecklist, type HandoffPayload, type HandoffStep } from "./settingsActions";

type AIProvider = "openai" | "anthropic" | "google";

type Props = {
  ai: {
    provider: AIProvider;
    maskedKey: string | null;
    hasKey: boolean;
    lastVerifiedAt: string | null;
    lastVerifiedOk: boolean;
  };
  handoff: HandoffPayload;
};

const PROVIDER_LABELS: Record<AIProvider, string> = {
  openai: "OpenAI",
  anthropic: "Anthropic (Claude)",
  google: "Google (Gemini)",
};

const PROVIDER_KEY_HELP: Record<AIProvider, { url: string; steps: string[] }> = {
  openai: {
    url: "https://platform.openai.com/api-keys",
    steps: ["Sign in at platform.openai.com", "Open API Keys in the sidebar", "Click \"Create new secret key\" and copy it"],
  },
  anthropic: {
    url: "https://console.anthropic.com/settings/keys",
    steps: ["Sign in at console.anthropic.com", "Open Settings → API Keys", "Click \"Create Key\" and copy it"],
  },
  google: {
    url: "https://aistudio.google.com/apikey",
    steps: ["Sign in at aistudio.google.com", "Click \"Create API key\"", "Copy the key shown"],
  },
};

const QUICK_LINKS: { href: string; label: string; description: string }[] = [
  { href: "/admin/globals/site-settings", label: "SEO & Site Info", description: "Site name, tagline, favicon, search indexing." },
  { href: "/admin/globals/branding", label: "Logo", description: "Header and footer logo files." },
  { href: "/admin/globals/design-tokens", label: "Colors", description: "Brand color palette." },
  { href: "/admin/globals/typography", label: "Typography", description: "Heading and body text scale." },
  { href: "/admin/globals/layout-motion", label: "Layout & Motion", description: "Container width, roundness, spacing, animation speed." },
  { href: "/admin/collections/users", label: "Admin Users", description: "Who can log into this admin panel." },
];

const HANDOFF_STEPS: {
  key: keyof HandoffPayload;
  title: string;
  description: string;
  linkLabel: string;
  linkUrl: string;
}[] = [
  {
    key: "githubTransfer",
    title: "GitHub Repository",
    description: "Transfer the code repository to the client's own GitHub account or organization, so they own the source code directly.",
    linkLabel: "Open repository settings ↗",
    linkUrl: "https://github.com/altlands89/real-numbers-website-nextjs/settings",
  },
  {
    key: "vercelTransfer",
    title: "Vercel Project",
    description: "Transfer the hosting project — this carries the deployments, environment variables, and the Blob media storage with it — to the client's own Vercel account or team.",
    linkLabel: "Open project settings ↗",
    linkUrl: "https://vercel.com/altlands/real-numbers-design-v2/settings",
  },
  {
    key: "supabaseTransfer",
    title: "Supabase Project",
    description: "Transfer ownership (and billing) of the Postgres database project to the client's own Supabase account.",
    linkLabel: "Open project settings ↗",
    linkUrl: "https://supabase.com/dashboard/project/ucmilkvivhvendtdutxn/settings/general",
  },
  {
    key: "domainTransfer",
    title: "Custom Domain",
    description: "If a custom domain gets connected later, its registrar/DNS should end up in the client's own account too. Not applicable yet — the site currently runs on its default *.vercel.app domain.",
    linkLabel: "Open Vercel domains ↗",
    linkUrl: "https://vercel.com/altlands/real-numbers-design-v2/settings/domains",
  },
  {
    key: "clientAdminAccount",
    title: "Client Admin Account",
    description: "Create the client's own admin (Owner) account in this panel and send them the login link and a temporary password through a secure channel.",
    linkLabel: "Create a new user ↗",
    linkUrl: "/admin/collections/users/create",
  },
  {
    key: "agencyAccessRemoved",
    title: "Agency Access Removed",
    description: "Once the client confirms they're logged in and everything above is transferred, remove or downgrade the agency's own admin and dev access.",
    linkLabel: "Manage users ↗",
    linkUrl: "/admin/collections/users",
  },
];

const card: React.CSSProperties = {
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: "var(--style-radius-m, 8px)",
  padding: 18,
  background: "var(--theme-elevation-0)",
};

const sectionTitle: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  margin: "0 0 4px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  fontSize: 13,
  padding: "8px 10px",
  borderRadius: 6,
  border: "1px solid var(--theme-elevation-150)",
  background: "var(--theme-input-bg, var(--theme-elevation-0))",
  color: "var(--theme-text)",
  boxSizing: "border-box",
};

function StatusBanner({ status }: { status: { kind: "idle" | "ok" | "error"; message?: string } }) {
  if (status.kind === "idle") return null;
  return (
    <div
      role="status"
      style={{
        marginTop: 10,
        padding: "8px 12px",
        borderRadius: 6,
        border: `1px solid ${status.kind === "ok" ? "rgba(46,125,50,0.35)" : "rgba(184,88,64,0.45)"}`,
        background: status.kind === "ok" ? "rgba(46,125,50,0.10)" : "rgba(184,88,64,0.10)",
        color: "var(--theme-text)",
        fontSize: 12.5,
        fontWeight: 500,
      }}
    >
      {status.kind === "ok" ? "✓ " : "⚠ "}
      {status.message}
    </div>
  );
}

function AIIntegrationCard({ initial }: { initial: Props["ai"] }) {
  const [provider, setProvider] = useState<AIProvider>(initial.provider);
  const [apiKey, setApiKey] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasKey, setHasKey] = useState(initial.hasKey);
  const [lastVerifiedAt, setLastVerifiedAt] = useState(initial.lastVerifiedAt);
  const [lastVerifiedOk, setLastVerifiedOk] = useState(initial.lastVerifiedOk);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const help = PROVIDER_KEY_HELP[provider];

  const handleSave = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const result = await saveAIIntegration({ provider, apiKey: apiKey || undefined });
      if (!result.ok) throw new Error(result.error);
      if (apiKey) setHasKey(true);
      setApiKey("");
      setStatus({ kind: "ok", message: "Saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    setStatus({ kind: "idle" });
    try {
      const result = await testAIConnection({ provider, apiKey: apiKey || undefined });
      setLastVerifiedAt(new Date().toISOString());
      setLastVerifiedOk(result.ok);
      if (!result.ok) throw new Error(result.error);
      if (apiKey) setHasKey(true);
      setStatus({ kind: "ok", message: "Connected — the key works." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Connection failed" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div style={card}>
      <h2 style={sectionTitle}>AI Integrations</h2>
      <p style={{ margin: "0 0 14px", fontSize: 12.5, color: "var(--theme-elevation-600)", maxWidth: 640 }}>
        Connect your own AI provider account — this uses your own API key and your own billing, so you stay in
        control of usage and cost. Once connected, AI-assisted features in this admin (like alt-text or SEO
        description suggestions) can use it. Nothing is called automatically — every AI action is something an
        editor clicks on purpose.
      </p>

      <div style={{ display: "grid", gap: 10, maxWidth: 460 }}>
        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>Provider</span>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value as AIProvider)}
            style={inputStyle}
          >
            {(Object.keys(PROVIDER_LABELS) as AIProvider[]).map((p) => (
              <option key={p} value={p}>{PROVIDER_LABELS[p]}</option>
            ))}
          </select>
        </label>

        <label style={{ display: "grid", gap: 4 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>API Key</span>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={hasKey ? `${initial.maskedKey ?? "••••"} — saved. Leave blank to keep it, or paste a new key to replace it.` : "Paste your API key"}
            style={inputStyle}
            autoComplete="off"
          />
        </label>

        <p style={{ margin: 0, fontSize: 11.5, color: "var(--theme-elevation-500)" }}>
          Don't have a key yet? <a href={help.url} target="_blank" rel="noopener noreferrer">Get one from {PROVIDER_LABELS[provider]} ↗</a>
          {" — "}{help.steps.join(" → ")}.
        </p>

        <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
          <button type="button" onClick={handleSave} disabled={saving} style={btn(true)}>
            {saving ? "Saving…" : "Save"}
          </button>
          <button type="button" onClick={handleTest} disabled={testing || (!hasKey && !apiKey)} style={btn(false)}>
            {testing ? "Testing…" : "Test Connection"}
          </button>
        </div>

        {lastVerifiedAt && (
          <p style={{ margin: 0, fontSize: 11.5, color: "var(--theme-elevation-500)" }}>
            {lastVerifiedOk ? "✓" : "⚠"} Last checked {new Date(lastVerifiedAt).toLocaleString()} — {lastVerifiedOk ? "connected" : "failed"}.
          </p>
        )}

        <StatusBanner status={status} />
      </div>
    </div>
  );
}

function btn(primary: boolean): React.CSSProperties {
  return {
    padding: "8px 16px",
    borderRadius: "var(--style-radius-s, 6px)",
    border: primary ? "none" : "1px solid var(--theme-elevation-150)",
    background: primary ? "var(--theme-success-500)" : "var(--theme-elevation-0)",
    color: primary ? "#fff" : "var(--theme-text)",
    fontWeight: 600,
    fontSize: 12.5,
    cursor: "pointer",
  };
}

function HandoffChecklist({ initial }: { initial: HandoffPayload }) {
  const [steps, setSteps] = useState<HandoffPayload>(initial);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; message?: string }>({ kind: "idle" });

  const doneCount = HANDOFF_STEPS.filter((s) => steps[s.key].done).length;

  const update = (key: keyof HandoffPayload, patch: Partial<HandoffStep>) =>
    setSteps((d) => ({ ...d, [key]: { ...d[key], ...patch } }));

  const handleSave = async () => {
    setSaving(true);
    setStatus({ kind: "idle" });
    try {
      const result = await saveHandoffChecklist(steps);
      if (!result.ok) throw new Error(result.error);
      setStatus({ kind: "ok", message: "Saved." });
    } catch (err) {
      setStatus({ kind: "error", message: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={card}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
        <div>
          <h2 style={sectionTitle}>Ownership &amp; Handoff</h2>
          <p style={{ margin: 0, fontSize: 12.5, color: "var(--theme-elevation-600)", maxWidth: 640 }}>
            When the project is finished, these are the real accounts that need to move to the client — each one
            happens in that service's own dashboard (a content admin has no access to transfer them, by design).
            Use this to track what's done. <strong>{doneCount}/{HANDOFF_STEPS.length} complete.</strong>
          </p>
        </div>
        <button type="button" onClick={handleSave} disabled={saving} style={{ ...btn(true), flexShrink: 0 }}>
          {saving ? "Saving…" : "Save"}
        </button>
      </div>

      <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
        {HANDOFF_STEPS.map((s) => {
          const step = steps[s.key];
          return (
            <div
              key={s.key}
              style={{
                border: `1px solid ${step.done ? "rgba(46,125,50,0.35)" : "var(--theme-elevation-150)"}`,
                background: step.done ? "rgba(46,125,50,0.06)" : "transparent",
                borderRadius: 6,
                padding: 12,
                display: "grid",
                gap: 6,
              }}
            >
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <input
                  type="checkbox"
                  checked={step.done}
                  onChange={(e) => update(s.key, { done: e.target.checked })}
                  style={{ marginTop: 3, flexShrink: 0 }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>{s.title}</span>
                    <a href={s.linkUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11.5, flexShrink: 0 }}>
                      {s.linkLabel}
                    </a>
                  </div>
                  <p style={{ margin: "2px 0 6px", fontSize: 12, color: "var(--theme-elevation-600)" }}>{s.description}</p>
                  <input
                    type="text"
                    value={step.notes}
                    onChange={(e) => update(s.key, { notes: e.target.value })}
                    placeholder="Notes (optional)"
                    style={{ ...inputStyle, fontSize: 12, padding: "6px 8px" }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <StatusBanner status={status} />
    </div>
  );
}

export function SettingsClient({ ai, handoff }: Props) {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "28px 24px 80px" }}>
      <h1 style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 700 }}>Settings</h1>
      <p style={{ margin: "0 0 22px", fontSize: 13, color: "var(--theme-elevation-600)", maxWidth: 640 }}>
        Everything that isn't page content lives here: brand/design controls, admin users, the AI provider
        connection, and the account-handoff checklist.
      </p>

      <div style={{ ...card, marginBottom: 18 }}>
        <h2 style={sectionTitle}>Quick Links</h2>
        <div style={{ marginTop: 10, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10 }}>
          {QUICK_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                display: "block",
                padding: 12,
                borderRadius: 6,
                border: "1px solid var(--theme-elevation-150)",
                textDecoration: "none",
                color: "var(--theme-text)",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 600 }}>{l.label}</div>
              <div style={{ fontSize: 11.5, color: "var(--theme-elevation-500)", marginTop: 2 }}>{l.description}</div>
            </a>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 18 }}>
        <AIIntegrationCard initial={ai} />
      </div>

      <HandoffChecklist initial={handoff} />
    </div>
  );
}
