import React from "react";
import { getCMS } from "@/lib/payload";
import { SettingsClient } from "./SettingsClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";

// Custom top-level admin view (registered at /admin/settings via
// payload.config.ts's admin.components.views) — a consolidated hub for
// everything that isn't page content: quick links to the existing
// Site Design globals and Users, the AI provider connection, and the
// account-handoff checklist. Same auth-gate requirement as every other
// custom view here (see requireAdminSession's own comment on why — custom
// views don't inherit Payload's auth redirect).
//
// The AI Integrations global's `apiKey` is never read into a prop here in
// its real form — only a masked preview (last 4 characters) is computed
// server-side and handed to the client component, so the raw key never
// reaches the browser at all, even to redisplay a saved value. See
// AIIntegrationsGlobal.ts and settingsActions.ts for the rest of that
// design.
function maskKey(key: string | null | undefined): string | null {
  if (!key || key.length < 6) return key ? "••••" : null;
  return `${key.slice(0, 3)}…${key.slice(-4)}`;
}

function normalizeStep(step: { done?: boolean | null; notes?: string | null } | null | undefined): { done: boolean; notes: string } {
  return { done: Boolean(step?.done), notes: step?.notes ?? "" };
}

export async function SettingsView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/settings");

  const payload = await getCMS();
  const [ai, handoff] = await Promise.all([
    payload.findGlobal({ slug: "ai-integrations" }),
    payload.findGlobal({ slug: "account-handoff" }),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <SettingsClient
        ai={{
          provider: (ai.provider as "openai" | "anthropic" | "google") ?? "openai",
          maskedKey: maskKey(ai.apiKey as string | null | undefined),
          hasKey: Boolean(ai.apiKey),
          lastVerifiedAt: (ai.lastVerifiedAt as string | null | undefined) ?? null,
          lastVerifiedOk: Boolean(ai.lastVerifiedOk),
        }}
        handoff={{
          githubTransfer: normalizeStep(handoff.githubTransfer),
          vercelTransfer: normalizeStep(handoff.vercelTransfer),
          supabaseTransfer: normalizeStep(handoff.supabaseTransfer),
          domainTransfer: normalizeStep(handoff.domainTransfer),
          clientAdminAccount: normalizeStep(handoff.clientAdminAccount),
          agencyAccessRemoved: normalizeStep(handoff.agencyAccessRemoved),
        }}
      />
    </VisualEditorShell>
  );
}
