"use client";

import { useRef, useState } from "react";

/**
 * Native HTML5 drag-and-drop reordering for a list rendered in a visual
 * editor's canvas — same technique proven on Home's section cards
 * (HomeVisualEditorClient.tsx), factored out so every other array (Team's
 * roster, a FAQ list, a card grid, …) gets it as a one-line addition
 * instead of a copy-pasted set of drag handlers per page.
 *
 * Usage: spread `dragHandlers(i)` onto the `i`-th draggable row/card, and
 * use `dragOverIndex === i` to highlight the row currently being dragged
 * over (optional — purely visual feedback).
 */
export function useDragReorder(reorder: (from: number, to: number) => void) {
  const dragIndexRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const dragHandlers = (index: number) => ({
    draggable: true,
    onDragStart: () => {
      dragIndexRef.current = index;
    },
    onDragOver: (e: React.DragEvent) => {
      e.preventDefault();
      if (dragOverIndex !== index) setDragOverIndex(index);
    },
    onDragLeave: () => setDragOverIndex((cur) => (cur === index ? null : cur)),
    onDrop: (e: React.DragEvent) => {
      e.preventDefault();
      const from = dragIndexRef.current;
      dragIndexRef.current = null;
      setDragOverIndex(null);
      if (from !== null) reorder(from, index);
    },
    onDragEnd: () => {
      dragIndexRef.current = null;
      setDragOverIndex(null);
    },
  });

  return { dragHandlers, dragOverIndex } as const;
}
