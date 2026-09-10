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
 *  words and a reflow mid-rotation reads as the whole hero jumping.
 *
 *  A single `setInterval` just advances which word is showing — no
 *  nested `setTimeout` for the fade. An earlier version drove the fade
 *  out and fade in as two chained timers (hide, then — 350ms later —
 *  swap text and show again); iOS Safari throttles JS timers heavily
 *  during scroll and after the tab is backgrounded, and a delayed inner
 *  timeout stranded the word invisible mid-fade for however long the
 *  delay was, reading as the animation "getting stuck". The fade/rise-in
 *  itself is now a CSS `animation` (see .v2-rotating-word in
 *  globals.css) that auto-plays whenever this span remounts — forced via
 *  `key={index}` below — so a throttled or delayed tick just holds the
 *  current word up a little longer; it can never land the UI in a
 *  half-transitioned state. */
export default function RotatingWord({ words, interval = 3200 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
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

    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
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
      <span key={index} className="v2-rotating-word" style={minWidth ? { minWidth } : undefined}>
        {words[index]}
      </span>
    </>
  );
}
