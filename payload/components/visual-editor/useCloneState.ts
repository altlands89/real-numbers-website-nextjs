"use client";

import { useCallback, useState } from "react";

const MAX_HISTORY = 50;

/**
 * Generic immutable state updater for a nested editor document, built on
 * structuredClone, with session-level undo/redo. Every visual editor's
 * field-change handler needs this exact shape — mutate a draft via a
 * callback, get back a fresh clone — so an individual field's onChange
 * stays a one-liner instead of repeating spread-merge boilerplate for
 * every field on the page.
 *
 * Undo/redo is a plain bounded history of full clones (capped at
 * MAX_HISTORY) rather than a diff/patch log — this editor's documents are
 * small (one page's content), so keeping whole snapshots is simpler and
 * cheap, and it's exactly what `set` already produces on every call. This
 * is session-only (cleared on page reload) and independent per state slice
 * (a page's main content vs. its mobileOverrides vs., for Team/Questions,
 * the roster/FAQ list) — each editor combines them into one shared
 * Undo/Redo control via `useCombinedHistory` (see that file) rather than
 * this hook trying to know about the others.
 *
 * `onMutate` fires after every change (set, undo, or redo) — each editor
 * uses it to clear its save-status banner, since any edit invalidates
 * whatever "saved"/"failed" message was showing.
 */
export function useCloneState<T>(initial: T, onMutate?: () => void) {
  const [state, setState] = useState<{ data: T; past: T[]; future: T[] }>({
    data: initial,
    past: [],
    future: [],
  });
  const [dirty, setDirty] = useState(false);

  const set = useCallback(
    (updater: (draft: T) => void) => {
      setState((s) => {
        const next = structuredClone(s.data) as T;
        updater(next);
        return { data: next, past: [...s.past, s.data].slice(-MAX_HISTORY), future: [] };
      });
      setDirty(true);
      onMutate?.();
    },
    [onMutate],
  );

  const undo = useCallback(() => {
    setState((s) => {
      if (!s.past.length) return s;
      const data = s.past[s.past.length - 1];
      return { data, past: s.past.slice(0, -1), future: [s.data, ...s.future].slice(0, MAX_HISTORY) };
    });
    setDirty(true);
    onMutate?.();
  }, [onMutate]);

  const redo = useCallback(() => {
    setState((s) => {
      if (!s.future.length) return s;
      const data = s.future[0];
      return { data, past: [...s.past, s.data].slice(-MAX_HISTORY), future: s.future.slice(1) };
    });
    setDirty(true);
    onMutate?.();
  }, [onMutate]);

  return {
    data: state.data,
    set,
    dirty,
    setDirty,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  } as const;
}
