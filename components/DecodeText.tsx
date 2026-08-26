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
    const clearAll = () => timeouts.forEach(clearTimeout);

    // Each character spins through random glyphs like an odometer reel,
    // easing from a quick flicker into a slow, settling crawl rather than
    // ticking at a constant (and much more jittery) rate.
    function animateChar(i: number, finalChar: string, onSettled: () => void) {
      const duration = 1100 + Math.random() * 2600;
      const start = performance.now();

      function tick() {
        if (cancelled) return;
        const elapsed = performance.now() - start;
        if (elapsed >= duration) {
          onSettled();
          return;
        }
        setChars((prev) => {
          const next = [...prev];
          next[i] = { char: randChar(), color: randColor() };
          return next;
        });
        const progress = elapsed / duration;
        const delay = 60 + Math.pow(progress, 2) * 260;
        const id = window.setTimeout(tick, delay);
        timeouts.push(id);
      }
      tick();

      return duration;
    }

    function runCycle() {
      if (cancelled) return;
      setChars(seedChars());

      let maxSettle = 0;
      FINAL.split("").forEach((finalChar, i) => {
        if (finalChar === " ") return;
        const duration = animateChar(i, finalChar, () => {
          setChars((prev) => {
            const next = [...prev];
            next[i] = { char: finalChar, color: SETTLED_COLOR };
            return next;
          });
        });
        maxSettle = Math.max(maxSettle, duration);
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
