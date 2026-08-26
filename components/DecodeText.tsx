"use client";

import { useEffect, useRef, useState } from "react";

/** Leetspeak seed — also the line's static/no-JS state. Same length and
 *  space positions as FINAL, so each index maps 1:1 to its real letter. */
const SEED = "3mp0w3r!n9 574r7up5 4nd !nv3570r5 w!7h (0mpr3h3n5!v3 f!n4n(!41 m4n493m3n7 501u7!0n5";
const FINAL = "Empowering startups and investors with comprehensive financial management solutions";

const SCRAMBLE_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*";
const COLORS = ["var(--black)", "var(--blue)", "var(--red)"];
const SETTLED_COLOR = "var(--black)";
const HOLD_MS = 5000;

function randChar() {
  return SCRAMBLE_POOL[Math.floor(Math.random() * SCRAMBLE_POOL.length)];
}
function randColor() {
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
function seedChars() {
  return SEED.split("").map((c) => ({ char: c, color: SETTLED_COLOR }));
}

export default function DecodeText() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [chars, setChars] = useState(seedChars);
  const [fontSize, setFontSize] = useState<number | null>(null);

  // Auto-fit: scale font-size so the settled FINAL sentence exactly
  // spans the container width on one line, never wrapping.
  useEffect(() => {
    const wrap = wrapRef.current;
    const measure = measureRef.current;
    if (!wrap || !measure) return;

    function fit() {
      const containerWidth = wrap!.clientWidth;
      const REF = 100;
      measure!.style.fontSize = `${REF}px`;
      const naturalWidth = measure!.getBoundingClientRect().width;
      if (naturalWidth > 0) {
        setFontSize((containerWidth / naturalWidth) * REF);
      }
    }

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setChars(FINAL.split("").map((c) => ({ char: c, color: SETTLED_COLOR })));
      return;
    }

    let cancelled = false;
    const timeouts: number[] = [];
    const intervals: number[] = [];
    const clearAll = () => {
      timeouts.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };

    function runCycle() {
      if (cancelled) return;
      setChars(seedChars());

      let maxSettle = 0;
      FINAL.split("").forEach((finalChar, i) => {
        if (finalChar === " ") return;
        const settleAt = 500 + Math.random() * 1800;
        maxSettle = Math.max(maxSettle, settleAt);

        const intervalId = window.setInterval(() => {
          setChars((prev) => {
            const next = [...prev];
            next[i] = { char: randChar(), color: randColor() };
            return next;
          });
        }, 45 + Math.random() * 45);
        intervals.push(intervalId);

        const stopId = window.setTimeout(() => {
          clearInterval(intervalId);
          setChars((prev) => {
            const next = [...prev];
            next[i] = { char: finalChar, color: SETTLED_COLOR };
            return next;
          });
        }, settleAt);
        timeouts.push(stopId);
      });

      const loopId = window.setTimeout(runCycle, maxSettle + HOLD_MS);
      timeouts.push(loopId);
    }

    runCycle();
    return () => {
      cancelled = true;
      clearAll();
    };
  }, []);

  return (
    <div className="v2-decode-wrap" ref={wrapRef}>
      <span className="v2-decode-measure" ref={measureRef} aria-hidden="true">
        {FINAL}
      </span>
      <span
        className="v2-decode-text"
        ref={textRef}
        style={fontSize ? { fontSize } : undefined}
        aria-hidden="true"
      >
        {chars.map((c, i) => (
          <span key={i} style={{ color: c.color }}>
            {c.char}
          </span>
        ))}
      </span>
      <span className="sr-only">{FINAL}.</span>
    </div>
  );
}
