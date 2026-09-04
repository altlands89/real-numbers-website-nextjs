import React from "react";
import { getCMS } from "@/lib/payload";
import type { ContactPage } from "@/payload/payload-types";
import { ContactVisualEditorClient } from "./ContactVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { resolveBrandColors } from "./visual-editor/serverData";

/**
 * Spatial alternative to the Contact page's normal edit form — same
 * pattern as AboutVisualEditorView.tsx. No photo fields and no media
 * library needed on this page. The actual form inputs (Name/Email/
 * Message) are hardcoded in ContactForm.tsx, not CMS-driven at all —
 * confirmed by reading that component before building this — so the
 * canvas shows that region as a labeled, non-editable placeholder rather
 * than pretending it's editable. The standard form at
 * /admin/globals/contact-page stays the authoritative editor for SEO,
 * drafts and version history.
 */
export async function ContactVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/contact");

  const payload = await getCMS();
  const [page, tokens] = await Promise.all([
    payload.findGlobal({ slug: "contact-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
  ]);

  return (
    <VisualEditorShell templateProps={templateProps}>
      <ContactVisualEditorClient initialData={page as ContactPage} colors={resolveBrandColors(tokens)} />
    </VisualEditorShell>
  );
}
