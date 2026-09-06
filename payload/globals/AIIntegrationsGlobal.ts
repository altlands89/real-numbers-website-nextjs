import type { GlobalConfig } from "payload";

// Holds the client's own AI provider connection — "bring your own key", not
// an agency-billed integration, so the client controls their own usage/cost
// once this is handed off. `apiKey` is `admin.hidden` deliberately: the
// value is never read into the native Payload admin form at all (same
// pattern as every visual-editor-owned content field elsewhere in this
// project) — it's only ever written via the Settings page's own Server
// Action (payload/components/settingsActions.ts), which is also the only
// place that ever reads the real value back out (to actually call the
// provider, or to run a Test Connection check). The Settings page itself
// never sends the raw key down to the browser either, even to redisplay it
// — see SettingsView.tsx's masking before it hands data to the client
// component. `lastVerifiedAt`/`lastVerifiedOk` are set by that same action
// after a real Test Connection call, not hand-edited.
export const AIIntegrationsGlobal: GlobalConfig = {
  slug: "ai-integrations",
  label: "AI Integrations",
  admin: {
    group: "Settings",
    description: "Connect an AI provider using your own API key — configure this from Settings → AI Integrations, not here.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "provider",
      type: "select",
      label: "AI Provider",
      options: [
        { label: "OpenAI", value: "openai" },
        { label: "Anthropic (Claude)", value: "anthropic" },
        { label: "Google (Gemini)", value: "google" },
      ],
      defaultValue: "openai",
    },
    {
      name: "apiKey",
      type: "text",
      label: "API Key",
      admin: { hidden: true },
    },
    {
      name: "lastVerifiedAt",
      type: "date",
      label: "Last Verified",
      admin: { readOnly: true, description: "Set automatically by the Settings page's Test Connection button." },
    },
    {
      name: "lastVerifiedOk",
      type: "checkbox",
      label: "Last Verification Succeeded",
      admin: { readOnly: true },
    },
  ],
};
