import React from "react";
import { getCMS } from "@/lib/payload";
import type { QuestionsFoundersAskPage } from "@/payload/payload-types";
import { QuestionsVisualEditorClient, type FaqEntry } from "./QuestionsVisualEditorClient";
import { type AdminViewProps, requireAdminSession, VisualEditorShell } from "./visual-editor/ViewShell";
import { fetchMediaLibrary, resolveBrandColors } from "./visual-editor/serverData";
import { getSiteUrl } from "@/lib/site-url";

/**
 * Spatial alternative to the Questions Founders Ask page's normal edit
 * form — same pattern as TeamVisualEditorView.tsx, extended to manage the
 * FAQItems collection inline (see questionsVisualEditorActions.ts's
 * saveFaqItems for the create/update/soft-delete reconciliation). The
 * standard form at /admin/globals/questions-founders-ask-page stays
 * authoritative for SEO, drafts and version history; the regular
 * FAQItems collection screens stay available too.
 */
export async function QuestionsVisualEditorView(props: AdminViewProps) {
  const { templateProps } = requireAdminSession(props, "/admin/visual-editor/questions");

  const payload = await getCMS();
  const [page, tokens, mediaLibrary, faqItems] = await Promise.all([
    payload.findGlobal({ slug: "questions-founders-ask-page" }),
    payload.findGlobal({ slug: "design-tokens" }),
    fetchMediaLibrary(payload),
    payload.find({ collection: "faq-items", sort: "order", limit: 200 }),
  ]);

  const initialFaqItems: FaqEntry[] = faqItems.docs.map((d) => ({
    id: d.id,
    question: d.question ?? "",
    answer: d.answer ?? "",
  }));

  return (
    <VisualEditorShell templateProps={templateProps}>
      <QuestionsVisualEditorClient
        initialData={page as QuestionsFoundersAskPage}
        initialFaqItems={initialFaqItems}
        colors={resolveBrandColors(tokens)}
        mediaLibrary={mediaLibrary}
        pageUrl={`${getSiteUrl()}/questions-founders-ask`}
      />
    </VisualEditorShell>
  );
}
