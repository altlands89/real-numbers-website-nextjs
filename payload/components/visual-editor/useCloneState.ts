"use client";

import { useCallback, useState } from "react";

/**
 * Generic immutable state updater for a nested editor document, built on
 * structuredClone. Every visual editor's field-change handler needs this
 * exact shape — mutate a draft via a callback, get back a fresh clone —
 * so an individual field's onChange stays a one-liner instead of repeating
 * spread-merge boilerplate for every field on the page.
 *
 * `onMutate` fires after every change (each editor uses it to clear its
 * save-status banner, since a fresh edit invalidates whatever "saved"/
 * "failed" message was showing).
 */
export function useCloneState<T>(initial: T, onMutate?: () => void) {
  const [data, setData] = useState<T>(initial);
  const [dirty, setDirty] = useState(false);

  const set = useCallback(
    (updater: (draft: T) => void) => {
      setData((prev) => {
        const next = structuredClone(prev) as T;
        updater(next);
        return next;
      });
      setDirty(true);
      onMutate?.();
    },
    [onMutate],
  );

  return { data, set, dirty, setDirty } as const;
}
