import type { GlobalConfig } from "payload";

// Tracks progress on the concrete, external account-transfer steps needed
// to hand this whole system over to the client's own accounts once the
// project is finished. Deliberately NOT a generic/freeform checklist array
// — each step below is a specific real action tied to a specific external
// service this project actually uses (GitHub, Vercel, Supabase), fixed and
// named rather than editable text, matching this project's established
// "curated, not generic" approach to admin schema everywhere else. The
// step-by-step instructions and real dashboard links live in
// SettingsView.tsx (content, not data) — this Global only stores each
// step's checked/unchecked state and an optional free-text note, so a
// non-technical client (or whoever is walking them through it) has
// somewhere to track what's actually been done.
//
// IMPORTANT — what this can't do: none of these transfers can happen from
// inside this admin panel with a single click. Transferring a GitHub repo,
// a Vercel project (billing + env vars + deployments), or a Supabase
// project's ownership are account-level actions that only the actual
// account owner can perform, in that service's own dashboard, for real
// security/billing reasons — this CMS has no API access to any of those
// control planes and shouldn't be given any. This checklist is a guided
// tracker for those real steps, not an automation of them.
export const AccountHandoffGlobal: GlobalConfig = {
  slug: "account-handoff",
  label: "Ownership & Handoff",
  admin: {
    group: "Settings",
    description: "Track progress on transferring this site's accounts to the client. See Settings → Ownership & Handoff for the full step-by-step guide with real links.",
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: "githubTransfer",
      type: "group",
      label: "GitHub Repository",
      fields: [
        { name: "done", type: "checkbox", label: "Repository transferred to the client's GitHub account", defaultValue: false },
        { name: "notes", type: "text", label: "Notes" },
      ],
    },
    {
      name: "vercelTransfer",
      type: "group",
      label: "Vercel Project",
      fields: [
        { name: "done", type: "checkbox", label: "Project (and its environment variables, Blob store, deployments) transferred to the client's Vercel account", defaultValue: false },
        { name: "notes", type: "text", label: "Notes" },
      ],
    },
    {
      name: "supabaseTransfer",
      type: "group",
      label: "Supabase Project",
      fields: [
        { name: "done", type: "checkbox", label: "Project ownership/billing transferred to the client's Supabase account", defaultValue: false },
        { name: "notes", type: "text", label: "Notes" },
      ],
    },
    {
      name: "domainTransfer",
      type: "group",
      label: "Custom Domain",
      fields: [
        { name: "done", type: "checkbox", label: "Custom domain connected and/or transferred to the client's registrar account", defaultValue: false },
        { name: "notes", type: "text", label: "Notes", defaultValue: "Not applicable yet — the site currently runs on its default *.vercel.app domain." },
      ],
    },
    {
      name: "clientAdminAccount",
      type: "group",
      label: "Client Admin Account",
      fields: [
        { name: "done", type: "checkbox", label: "Client's own Payload admin (Owner) account created and credentials sent securely", defaultValue: false },
        { name: "notes", type: "text", label: "Notes" },
      ],
    },
    {
      name: "agencyAccessRemoved",
      type: "group",
      label: "Agency Access Removed",
      fields: [
        { name: "done", type: "checkbox", label: "Agency's own admin/dev access removed or downgraded, once the client confirms they're in", defaultValue: false },
        { name: "notes", type: "text", label: "Notes" },
      ],
    },
  ],
};
