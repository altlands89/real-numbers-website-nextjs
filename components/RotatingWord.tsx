"use client";

import { useEffect, useRef, useState } from "react";

interface RotatingWordProps {
  words: string[];
  interval?: number;
}

/** Swaps its text on a timer with a fade + rise transition. Deliberately
 *  avoids clipped/sliding-track techniques (sensitive to font metrics
 *  and line-height, and it broke) in favor of a single normal-flow text
 *  node whose content changes between fade-out and fade-in — nothing to
 *  misalign, so it can't render half off-screen.
 *
 *  Reserves the width of the widest word up front (measured once via a
 *  hidden sibling that inherits the same font) so swapping between
 *  words of different lengths never reflows the heading around it —
 *  most visible on mobile, where the headline wraps onto fewer, wider
 *  words and a reflow mid-rotation reads as the whole hero jumping. */
export default function RotatingWord({ words, interval = 2200 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [minWidth, setMinWidth] = useState<number | null>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const measurer = measureRef.current;
    if (!measurer) return;
    let widest = 0;
    for (const word of words) {
      measurer.textContent = word;
      widest = Math.max(widest, measurer.offsetWidth);
    }
    measurer.textContent = "";
    setMinWidth(widest);
  }, [words]);

  useEffect(() => {
    // Held frozen on the first word inside the visual editor's live-preview
    // iframe (set by EditorBridgeListener) — a heading that keeps changing
    // under the cursor makes the editing surface illegible.
    if (document.documentElement.dataset.rnEditorFrozen === "1") return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fade = reduce ? 0 : 350;

    const id = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % words.length);
        setVisible(true);
      }, fade);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <>
      <span
        ref={measureRef}
        aria-hidden="true"
        style={{ position: "absolute", visibility: "hidden", whiteSpace: "nowrap", pointerEvents: "none" }}
      />
      <span
        className={`v2-rotating-word${visible ? " is-visible" : ""}`}
        style={minWidth ? { minWidth } : undefined}
      >
        {words[index]}
      </span>
    </>
  );
}
