"use server";

import { headers as nextHeaders } from "next/headers";
import { getCMS } from "@/lib/payload";

type AIProvider = "openai" | "anthropic" | "google";

async function requireUser() {
  const payload = await getCMS();
  const { user } = await payload.auth({ headers: await nextHeaders() });
  if (!user) throw new Error("Not signed in — reload the admin and try again.");
  return payload;
}

/** Saves the selected provider and, only when a new key is actually typed,
 *  the API key itself — an empty `apiKey` means "keep whatever's already
 *  saved" (see SettingsClient.tsx: the input is never pre-filled with the
 *  real key, so an untouched field submits empty on purpose, not a blank
 *  overwrite). */
export async function saveAIIntegration(input: {
  provider: AIProvider;
  apiKey?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = await requireUser();
    const data: Record<string, unknown> = { provider: input.provider };
    if (input.apiKey) data.apiKey = input.apiKey;
    await payload.updateGlobal({ slug: "ai-integrations", data });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}

/** Makes one real, minimal-cost request to the given provider to confirm
 *  the key actually works — a client with no technical background gets a
 *  plain "✓ Connected" / "✗ <reason>" instead of finding out a key was
 *  wrong the first time an AI feature quietly fails. When `apiKey` isn't
 *  passed, re-tests whatever is already saved (read server-side — this is
 *  the one place besides saveAIIntegration that ever touches the real
 *  value; see AIIntegrationsGlobal.ts's comment on why the field is hidden
 *  from the native admin form). Records the result so the Settings page can
 *  show "last verified" without re-testing on every page load. */
export async function testAIConnection(input: {
  provider: AIProvider;
  apiKey?: string;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  let payload;
  try {
    payload = await requireUser();
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Not signed in" };
  }

  let apiKey = input.apiKey;
  if (!apiKey) {
    const current = await payload.findGlobal({ slug: "ai-integrations" });
    apiKey = typeof current.apiKey === "string" ? current.apiKey : undefined;
  }
  if (!apiKey) {
    return { ok: false, error: "No API key saved yet — paste one above first." };
  }

  const result = await checkProviderKey(input.provider, apiKey);

  try {
    await payload.updateGlobal({
      slug: "ai-integrations",
      data: { lastVerifiedAt: new Date().toISOString(), lastVerifiedOk: result.ok },
    });
  } catch {
    // Recording the check result is a nice-to-have — a failure here
    // shouldn't mask the actual connection result the user is waiting on.
  }

  return result;
}

async function checkProviderKey(provider: AIProvider, apiKey: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    if (provider === "openai") {
      const res = await fetch("https://api.openai.com/v1/models", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) return { ok: true };
      return { ok: false, error: res.status === 401 ? "Invalid API key." : `OpenAI returned ${res.status}.` };
    }
    if (provider === "anthropic") {
      const res = await fetch("https://api.anthropic.com/v1/models", {
        headers: { "x-api-key": apiKey, "anthropic-version": "2023-06-01" },
      });
      if (res.ok) return { ok: true };
      return { ok: false, error: res.status === 401 ? "Invalid API key." : `Anthropic returned ${res.status}.` };
    }
    // google
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(apiKey)}`);
    if (res.ok) return { ok: true };
    return { ok: false, error: res.status === 400 || res.status === 403 ? "Invalid API key." : `Google returned ${res.status}.` };
  } catch {
    return { ok: false, error: "Couldn't reach the provider — check your internet connection and try again." };
  }
}

export type HandoffStep = { done: boolean; notes: string };
export type HandoffPayload = {
  githubTransfer: HandoffStep;
  vercelTransfer: HandoffStep;
  supabaseTransfer: HandoffStep;
  domainTransfer: HandoffStep;
  clientAdminAccount: HandoffStep;
  agencyAccessRemoved: HandoffStep;
};

/** One save for the whole checklist — matches every other visual editor's
 *  single "save the panel" action rather than a save-per-row, since a
 *  client walking through this list will typically tick a few boxes in one
 *  sitting. */
export async function saveHandoffChecklist(data: HandoffPayload): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const payload = await requireUser();
    await payload.updateGlobal({ slug: "account-handoff", data });
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : "Save failed" };
  }
}
