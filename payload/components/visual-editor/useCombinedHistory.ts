"use client";

import { useCallback, useRef } from "react";

export type HistorySlice = { canUndo: boolean; canRedo: boolean; undo: () => void; redo: () => void };

/**
 * Combines 2-3 independent useCloneState/useMobileOverrides history stacks
 * (a page's main content, its mobileOverrides, and — for Team/Questions —
 * its roster/FAQ list) into the one Ctrl/Cmd+Z the editor offers. Each
 * stack's `onMutate` should call `mark(key)` so this always knows which
 * stack the next Undo should hit.
 *
 * Known simplification: this tracks only the single most-recently-touched
 * stack, not a fully interleaved cross-stack timeline — repeated Undo after
 * alternating edits across stacks keeps unwinding the last-touched one
 * rather than perfectly time-ordering across all of them (falling back to
 * *any* stack with history once the last-touched one runs out, so Undo
 * never just silently stops working). Matches how these editors are
 * actually used — a burst of edits in one area, then a burst in another —
 * without needing a single unified snapshot log across differently-shaped
 * state slices.
 */
export function useLastTouchedHistory() {
  const lastTouched = useRef<string | null>(null);

  const mark = useCallback((key: string) => {
    lastTouched.current = key;
  }, []);

  const undo = useCallback((slices: Record<string, HistorySlice>) => {
    const key = lastTouched.current;
    if (key && slices[key]?.canUndo) {
      slices[key].undo();
      return;
    }
    const fallback = Object.entries(slices).find(([, s]) => s.canUndo);
    fallback?.[1].undo();
  }, []);

  const redo = useCallback((slices: Record<string, HistorySlice>) => {
    const key = lastTouched.current;
    if (key && slices[key]?.canRedo) {
      slices[key].redo();
      return;
    }
    const fallback = Object.entries(slices).find(([, s]) => s.canRedo);
    fallback?.[1].redo();
  }, []);

  return { mark, undo, redo };
}
