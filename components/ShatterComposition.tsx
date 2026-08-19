"use client";

import { useEffect, useRef, useMemo } from "react";
import type { CSSProperties } from "react";

interface ShatterCompositionProps {
  src: string;
  /** Native SVG width/height, used to keep tiles undistorted. Defaults to a 1:1 square. */
  aspect?: number;
  /** Grid density — gridxgrid tiles. */
  grid?: number;
  /** Max travel distance for the furthest-flung tile, in px. */
  distance?: number;
  className?: string;
  style?: CSSProperties;
}

// Deterministic pseudo-random in [-1, 1], stable across renders.
function hash(i: number, salt: number) {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

export default function ShatterComposition({
  src,
  aspect = 1,
  grid = 4,
  distance = 130,
  className,
  style,
}: ShatterCompositionProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLDivElement | null)[]>([]);
  const targetDispersion = useRef(0);
  const currentDispersion = useRef(0);
  const active = useRef(true);
  const rafId = useRef<number>();

  const tiles = useMemo(() => {
    const cells = [];
    for (let row = 0; row < grid; row++) {
      for (let col = 0; col < grid; col++) {
        const i = row * grid + col;
        cells.push({
          i,
          row,
          col,
          dx: hash(i, 1),
          dy: hash(i, 2),
          rot: hash(i, 3) * 55,
          delay: (Math.abs(hash(i, 4)) * 0.12).toFixed(3),
        });
      }
    }
    return cells;
  }, [grid]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

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
      const dist = Math.abs(center - vh / 2) / (vh / 2);
      targetDispersion.current = Math.min(1, dist);
    }

    function tick() {
      if (active.current || reduce) {
        currentDispersion.current +=
          (targetDispersion.current - currentDispersion.current) * 0.065;
        const d = reduce ? 0 : currentDispersion.current;
        tileRefs.current.forEach((el, i) => {
          if (!el) return;
          const t = tiles[i];
          const eased = d * d; // ease-in — subtle near center, dramatic at the edges
          const tx = t.dx * distance * eased;
          const ty = t.dy * distance * eased;
          const rot = t.rot * eased;
          const scale = 1 - eased * 0.22;
          const opacity = 1 - eased * 0.6;
          el.style.transform = `translate3d(${tx.toFixed(1)}px, ${ty.toFixed(
            1
          )}px, 0) rotate(${rot.toFixed(1)}deg) scale(${scale.toFixed(3)})`;
          el.style.opacity = opacity.toFixed(3);
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
  }, [tiles, distance]);

  return (
    <div
      ref={containerRef}
      className={`comp-shatter${className ? ` ${className}` : ""}`}
      style={{ ...style, aspectRatio: String(aspect) }}
      aria-hidden="true"
    >
      {tiles.map((t) => (
        <div
          key={t.i}
          ref={(el) => {
            tileRefs.current[t.i] = el;
          }}
          className="comp-shatter-tile"
          style={{
            left: `${(t.col * 100) / grid}%`,
            top: `${(t.row * 100) / grid}%`,
            width: `${100 / grid}%`,
            height: `${100 / grid}%`,
            backgroundImage: `url(${src})`,
            backgroundSize: `${grid * 100}% ${grid * 100}%`,
            backgroundPosition: `${(t.col * 100) / (grid - 1)}% ${
              (t.row * 100) / (grid - 1)
            }%`,
          }}
        />
      ))}
    </div>
  );
}
