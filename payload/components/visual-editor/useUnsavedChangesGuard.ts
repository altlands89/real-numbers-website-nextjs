"use client";

import { useEffect } from "react";

/**
 * Warns before a real browser navigation (tab close, refresh, typed URL,
 * or clicking one of this admin's own plain <a> sidebar links — none of
 * which are Next <Link>, so each one is a genuine page unload) discards
 * unpublished edits. This is the single biggest thing a non-technical
 * editor needs protecting from: every visual editor's own state lives only
 * in memory until Publish, with no autosave.
 *
 * What this can't cover: client-side (same-page, no reload) navigation —
 * this editor's own in-canvas "jump to another page's visual editor" is
 * guarded separately, with an explicit confirm, right where that
 * `router.push` happens (see LiveCanvas.tsx / MobilePreview.tsx) — and any
 * future client-side link Payload's own generated admin chrome might use
 * isn't something this hook (or reasonably, this codebase) can intercept.
 */
export function useUnsavedChangesGuard(dirty: boolean) {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!dirty) return;
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);
}
