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
}: CompositionDriftProps) {
  const [viewBox, setViewBox] = useState("0 0 1200 1200");
  const [aspect, setAspect] = useState(1);
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);
  const target = useRef(0);
  const current = useRef(0);
  const active = useRef(true);
  const rafId = useRef<number>();

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

    function tick() {
      if (active.current || reduce) {
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
          const sign = hash(i, 5) >= 0 ? 1 : -1;
          const speed = 0.5 + Math.abs(hash(i, 6)) * 0.7;
          const primary = p * distance * sign * speed;
          const secondary = p * distance * 0.2 * hash(i, 7);
          const tx = horizontal ? primary : secondary;
          const ty = horizontal ? secondary : primary;
          el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(
            1
          )}px)`;
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
  }, [paths, distance]);

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
