"use client";

import { useEffect, useState } from "react";

interface RotatingWordProps {
  words: string[];
  interval?: number;
}

/** Odometer-style word rotator — a fixed-height window slides its inner
 *  track up one word at a time, looping continuously. */
export default function RotatingWord({ words, interval = 2200 }: RotatingWordProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    // Always keep cycling the word — a prefers-reduced-motion visitor still
    // needs to see it change, just without the sliding transition (handled
    // in CSS by turning off .v2-rotating-word-track's transition instead of
    // freezing the content here on the first word forever).
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % words.length);
    }, interval);
    return () => clearInterval(id);
  }, [words.length, interval]);

  return (
    <span className="v2-rotating-word">
      <span
        className="v2-rotating-word-track"
        style={{ transform: `translateY(-${index * 100}%)` }}
      >
        {words.map((w) => (
          <span className="v2-rotating-word-item" key={w}>
            {w}
          </span>
        ))}
      </span>
    </span>
  );
}
