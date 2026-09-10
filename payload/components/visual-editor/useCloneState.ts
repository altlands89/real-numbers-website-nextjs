"use client";

import { useCallback, useRef, useState } from "react";
import { deepEqual } from "./deepEqual";

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
 * `dirty` is derived, not an imperative flag: `savedRef` tracks the last
 * snapshot actually published (moved forward whenever `setDirty(false)` is
 * called, i.e. right after a successful save), and every set/undo/redo
 * compares the resulting data against it. This matters for two real bugs
 * a plain "any mutation flips dirty to true" flag has: (1) a no-op edit —
 * dragging a row back into its own slot, or a stray field-commit for a
 * path that matched nothing — used to light up "Publish changes" with
 * nothing to actually publish; (2) undoing back to exactly the published
 * content used to leave "Publish changes" active even though there was,
 * again, nothing left to publish. A no-op `set()` call (the clone equals
 * what was already there) is skipped entirely — no history entry, no
 * `onMutate` — so Undo never has to "undo" something that never happened.
 *
 * `onMutate` fires after every REAL change (set, undo, or redo) — each
 * editor uses it to clear its save-status banner, since any edit
 * invalidates whatever "saved"/"failed" message was showing.
 */
export function useCloneState<T>(initial: T, onMutate?: () => void) {
  const [state, setState] = useState<{ data: T; past: T[]; future: T[] }>({
    data: initial,
    past: [],
    future: [],
  });
  const savedRef = useRef(initial);
  const [dirty, setDirtyState] = useState(false);

  const set = useCallback(
    (updater: (draft: T) => void) => {
      let changed = false;
      setState((s) => {
        const next = structuredClone(s.data) as T;
        updater(next);
        if (deepEqual(next, s.data)) return s;
        changed = true;
        setDirtyState(!deepEqual(next, savedRef.current));
        return { data: next, past: [...s.past, s.data].slice(-MAX_HISTORY), future: [] };
      });
      if (changed) onMutate?.();
    },
    [onMutate],
  );

  const undo = useCallback(() => {
    let changed = false;
    setState((s) => {
      if (!s.past.length) return s;
      changed = true;
      const data = s.past[s.past.length - 1];
      setDirtyState(!deepEqual(data, savedRef.current));
      return { data, past: s.past.slice(0, -1), future: [s.data, ...s.future].slice(0, MAX_HISTORY) };
    });
    if (changed) onMutate?.();
  }, [onMutate]);

  const redo = useCallback(() => {
    let changed = false;
    setState((s) => {
      if (!s.future.length) return s;
      changed = true;
      const data = s.future[0];
      setDirtyState(!deepEqual(data, savedRef.current));
      return { data, past: [...s.past, s.data].slice(-MAX_HISTORY), future: s.future.slice(1) };
    });
    if (changed) onMutate?.();
  }, [onMutate]);

  // Called by each editor's save() after a successful publish. `false`
  // moves the "what counts as saved" baseline forward to whatever is
  // showing right now — everything from here is compared against the
  // just-published content, not the page's original load. `true` forces a
  // dirty state directly (kept for API-shape symmetry; not used today).
  const setDirty = useCallback((value: boolean) => {
    if (!value) {
      setState((s) => {
        savedRef.current = s.data;
        return s;
      });
    }
    setDirtyState(value);
  }, []);

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
