"use client";

import { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  interval?: number;
}

/** Swaps its text on a timer with a fade + rise transition. Deliberately
 *  avoids clipped/sliding-track techniques (sensitive to font metrics
 *  and line-height, and it broke) in favor of a single normal-flow text
 *  node whose content changes between fade-out and fade-in — nothing to
 *  misalign, so it can't render half off-screen. */
export default function RotatingWord({ words, interval = 2200 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
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
    <span className={`v2-rotating-word${visible ? " is-visible" : ""}`}>
      {words[index]}
    </span>
  );
}
