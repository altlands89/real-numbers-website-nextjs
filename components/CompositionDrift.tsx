"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface PathInfo {
  d: string;
  stroke: string;
  strokeWidth: string;
}

interface CompositionDriftProps {
  src: string;
  style?: CSSProperties;
  className?: string;
  /** Max drift distance for the fastest-moving digit, in px. Kept gentle by design. */
  distance?: number;
  /** Offsets the per-path hash so different instances of the same
   *  composition (or different comps with the same path count) don't
   *  all drift/sway in lockstep — each section gets its own motion feel. */
  seed?: number;
  /** Multiplier on the idle ambient sway (amplitude + speed). Default 1
   *  keeps the usual gentle feel; raise it for sections that want the
   *  background motion to read as more noticeable. */
  swayScale?: number;
}

// Deterministic pseudo-random in [-1, 1], stable across renders.
function hash(i: number, salt: number) {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

export default function CompositionDrift({
  src,
  style,
  className,
  distance = 90,
  seed = 0,
  swayScale = 1,
}: CompositionDriftProps) {
  const [viewBox, setViewBox] = useState("0 0 1200 1200");
  const [aspect, setAspect] = useState(1);
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const active = useRef(true);
  const rafId = useRef<number | undefined>(undefined);
  const startTime = useRef<number | null>(null);

  // Fetch and parse the composition once — each path becomes an independently
  // driftable digit instead of an arbitrary grid tile.
  useEffect(() => {
    let cancelled = false;
    fetch(src)
      .then((res) => res.text())
      .then((text) => {
        if (cancelled) return;
        const doc = new DOMParser().parseFromString(text, "image/svg+xml");
        const svgEl = doc.querySelector("svg");
        const vb = svgEl?.getAttribute("viewBox") || "0 0 1200 1200";
        setViewBox(vb);
        const parts = vb.split(/\s+/).map(Number);
        if (parts.length === 4 && parts[3] > 0) {
          setAspect(parts[2] / parts[3]);
        }
        const found = Array.from(doc.querySelectorAll("path")).map((p) => ({
          d: p.getAttribute("d") || "",
          stroke: p.getAttribute("stroke") || "#353E5B",
          strokeWidth:
            p.getAttribute("stroke-width") || p.getAttribute("strokeWidth") || "3",
        }));
        setPaths(found);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [src]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || paths.length === 0) return;

    // Purely decorative background motion — skip it entirely inside the
    // visual editor's live-preview iframe (set by EditorBridgeListener) so
    // it can't make a click target drift out from under the cursor.
    if (document.documentElement.dataset.rnEditorFrozen === "1") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const io = new IntersectionObserver(
      (entries) => {
        active.current = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "120% 0px 120% 0px" }
    );
    io.observe(container);

    function measure() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / (vh / 2);
      target.current = Math.max(-1, Math.min(1, dist));
    }

    function tick(now: number) {
      if (active.current || reduce) {
        if (startTime.current === null) startTime.current = now;
        const elapsed = (now - startTime.current) / 1000;

        // Slow, heavily-damped easing toward the scroll target — deliberately gentle.
        current.current += (target.current - current.current) * 0.045;
        const p = reduce ? 0 : current.current;
        pathRefs.current.forEach((el, i) => {
          if (!el) return;
          // Each digit keeps its own axis: even index drifts mostly
          // horizontally, odd index mostly vertically, each at its own
          // speed and direction, so the composition drifts apart unevenly
          // and re-settles into its original form near the center.
          const horizontal = i % 2 === 0;
          const sign = hash(i, 5 + seed) >= 0 ? 1 : -1;
          const speed = 0.5 + Math.abs(hash(i, 6 + seed)) * 0.7;
          const primary = p * distance * sign * speed;
          const secondary = p * distance * 0.2 * hash(i, 7 + seed);
          const scrollX = horizontal ? primary : secondary;
          const scrollY = horizontal ? secondary : primary;

          // Gentle continuous ambient sway — a slow, per-digit lissajous
          // drift so the piece feels alive even at rest, not just while
          // scrolling. Small amplitude, long period, never in sync across digits.
          let swayX = 0;
          let swayY = 0;
          let scale = 1;
          if (!reduce) {
            const ampX = (6 + Math.abs(hash(i, 20 + seed)) * 10) * swayScale;
            const ampY = (6 + Math.abs(hash(i, 21 + seed)) * 10) * swayScale;
            const freqX = (0.035 + Math.abs(hash(i, 22 + seed)) * 0.045) * Math.sqrt(swayScale);
            const freqY = (0.03 + Math.abs(hash(i, 24 + seed)) * 0.045) * Math.sqrt(swayScale);
            const phase = hash(i, 23 + seed) * Math.PI * 2;
            swayX = Math.sin(elapsed * freqX * Math.PI * 2 + phase) * ampX;
            swayY = Math.cos(elapsed * freqY * Math.PI * 2 + phase * 1.3) * ampY;

            // Digits stay at their original angle (rotating a numeral can
            // read as a different digit) — vary size instead, a slow
            // per-path breathing scale so the piece still feels alive.
            const scaleAmp = (0.02 + Math.abs(hash(i, 30 + seed)) * 0.035) * swayScale;
            const scaleFreq = 0.02 + Math.abs(hash(i, 31 + seed)) * 0.03;
            const scalePhase = hash(i, 32 + seed) * Math.PI * 2;
            scale = 1 + Math.sin(elapsed * scaleFreq * Math.PI * 2 + scalePhase) * scaleAmp;
          }

          const tx = scrollX + swayX;
          const ty = scrollY + swayY;
          el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(
            1
          )}px) scale(${scale.toFixed(3)})`;
        });
      }
      rafId.current = requestAnimationFrame(tick);
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [paths, distance, seed, swayScale]);

  return (
    <div
      ref={containerRef}
      className={`comp-drift${className ? ` ${className}` : ""}`}
      style={{ ...style, aspectRatio: String(aspect) }}
      aria-hidden="true"
    >
      <svg viewBox={viewBox} width="100%" height="100%" fill="none">
        {paths.map((p, i) => (
          <path
            key={i}
            ref={(el) => {
              pathRefs.current[i] = el;
            }}
            d={p.d}
            stroke={p.stroke}
            strokeWidth={p.strokeWidth}
          />
        ))}
      </svg>
    </div>
  );
}
