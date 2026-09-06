"use client";

import { useCallback, useRef, useState } from "react";
import { deepEqual } from "./deepEqual";

export type MobileOverrides = Record<string, unknown>;

const MAX_HISTORY = 50;

/**
 * Manages the single `mobileOverrides` JSON blob shared by every page
 * Global (see payload/fields/mobileOverridesField.ts) — a flat map from a
 * field's dot-path (e.g. "hero.heading") to its mobile-only replacement
 * value (string for text, a Media ID number for an image). A key's absence
 * means "same as desktop" — that's the default, untouched state for every
 * field until an editor explicitly opts one in via ResponsiveField /
 * ResponsivePhotoField, or clicks a field inside the mobile preview.
 *
 * Same bounded-history undo/redo shape as useCloneState, including the
 * same derived-dirty fix (compare against the last-published snapshot
 * rather than an imperative flag) — see that file's comment for the two
 * bugs that fixes. `onMutate` fires after set/undo/redo, same contract as
 * useCloneState.
 */
export function useMobileOverrides(initial: MobileOverrides | null | undefined, onMutate?: () => void) {
  const initialData = { ...(initial ?? {}) };
  const [state, setState] = useState<{ data: MobileOverrides; past: MobileOverrides[]; future: MobileOverrides[] }>(
    () => ({ data: initialData, past: [], future: [] }),
  );
  const savedRef = useRef(initialData);
  const [dirty, setDirtyState] = useState(false);

  const setOverride = useCallback(
    (path: string, value: unknown) => {
      let changed = false;
      setState((s) => {
        if (deepEqual(s.data[path], value)) return s;
        changed = true;
        const data = { ...s.data, [path]: value };
        setDirtyState(!deepEqual(data, savedRef.current));
        return { data, past: [...s.past, s.data].slice(-MAX_HISTORY), future: [] };
      });
      if (changed) onMutate?.();
    },
    [onMutate],
  );

  const clearOverride = useCallback(
    (path: string) => {
      let changed = false;
      setState((s) => {
        if (!(path in s.data)) return s;
        changed = true;
        const next = { ...s.data };
        delete next[path];
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
    overrides: state.data,
    setOverride,
    clearOverride,
    dirty,
    setDirty,
    undo,
    redo,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  } as const;
}
