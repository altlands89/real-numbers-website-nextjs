"use client";

import React from "react";

/**
 * "View live page ↗" — opens the real page in a new browser tab.
 *
 * Two variants, both sharing the same component so the two places this
 * appears (see below) stay visually/behaviorally identical:
 * - `variant="toolbar"` — a plain outlined button next to Undo/Redo,
 *   always visible, for jumping out to see the page at any time.
 * - `variant="banner"` — the post-Publish nudge, shown inline in the
 *   existing green success banner. Research on this pattern (WordPress's
 *   Gutenberg post-publish panel's "View Post" link, which the Gutenberg
 *   team's own backlog confirms is meant to open in a new tab rather than
 *   navigate away from the editor: github.com/WordPress/gutenberg/issues/70126)
 *   confirms the established shape: a single, low-friction link placed
 *   right where the confirmation already is — not a separate modal/toast
 *   the editor has to notice and dismiss, and not a new tab that silently
 *   opens on its own (surprising, and useless if the editor wants to keep
 *   working). `target="_blank"` here matches that: one click, new tab, the
 *   editor's own tab stays exactly where it was.
 */
export function ViewLiveLink({ pageUrl, variant }: { pageUrl: string; variant: "toolbar" | "banner" }) {
  const toolbarStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid var(--theme-elevation-150)",
    background: "var(--theme-elevation-0)",
    color: "var(--theme-text)",
    borderRadius: "var(--style-radius-s, 4px)",
    padding: "7px 12px",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
  };

  const bannerStyle: React.CSSProperties = {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    border: "1px solid rgba(46,125,50,0.4)",
    background: "rgba(255,255,255,0.5)",
    color: "var(--theme-text)",
    borderRadius: "var(--style-radius-s, 4px)",
    padding: "6px 12px",
    fontSize: 12,
    fontWeight: 600,
    textDecoration: "none",
    whiteSpace: "nowrap",
    flexShrink: 0,
  };

  return (
    <a href={pageUrl} target="_blank" rel="noopener noreferrer" style={variant === "toolbar" ? toolbarStyle : bannerStyle}>
      View live page ↗
    </a>
  );
}
