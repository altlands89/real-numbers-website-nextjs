"use client";

import { useCallback, useState } from "react";

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
 * Same bounded-history undo/redo shape as useCloneState — see that file's
 * comment for why whole-snapshot history is the right call here. `onMutate`
 * fires after set/undo/redo, same contract as useCloneState.
 */
export function useMobileOverrides(initial: MobileOverrides | null | undefined, onMutate?: () => void) {
  const [state, setState] = useState<{ data: MobileOverrides; past: MobileOverrides[]; future: MobileOverrides[] }>(
    () => ({ data: { ...(initial ?? {}) }, past: [], future: [] }),
  );
  const [dirty, setDirty] = useState(false);

  const setOverride = useCallback(
    (path: string, value: unknown) => {
      setState((s) => ({
        data: { ...s.data, [path]: value },
        past: [...s.past, s.data].slice(-MAX_HISTORY),
        future: [],
      }));
      setDirty(true);
      onMutate?.();
    },
    [onMutate],
  );

  const clearOverride = useCallback(
    (path: string) => {
      setState((s) => {
        if (!(path in s.data)) return s;
        const next = { ...s.data };
        delete next[path];
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
