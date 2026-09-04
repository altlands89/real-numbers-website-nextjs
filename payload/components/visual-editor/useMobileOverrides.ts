"use client";

import { useCallback, useState } from "react";

export type MobileOverrides = Record<string, unknown>;

/**
 * Manages the single `mobileOverrides` JSON blob shared by every page
 * Global (see payload/fields/mobileOverridesField.ts) — a flat map from a
 * field's dot-path (e.g. "hero.heading") to its mobile-only replacement
 * value (string for text, a Media ID number for an image). A key's absence
 * means "same as desktop" — that's the default, untouched state for every
 * field until an editor explicitly opts one in via ResponsiveField /
 * ResponsivePhotoField.
 */
export function useMobileOverrides(initial: MobileOverrides | null | undefined) {
  const [overrides, setOverridesState] = useState<MobileOverrides>(() => ({ ...(initial ?? {}) }));
  const [dirty, setDirty] = useState(false);

  const setOverride = useCallback((path: string, value: unknown) => {
    setOverridesState((prev) => ({ ...prev, [path]: value }));
    setDirty(true);
  }, []);

  const clearOverride = useCallback((path: string) => {
    setOverridesState((prev) => {
      if (!(path in prev)) return prev;
      const next = { ...prev };
      delete next[path];
      return next;
    });
    setDirty(true);
  }, []);

  return { overrides, setOverride, clearOverride, dirty, setDirty };
}
