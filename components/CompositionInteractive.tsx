"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";

interface PathInfo {
  d: string;
  stroke: string;
  strokeWidth: string;
}

interface CompositionInteractiveProps {
  src: string;
  style?: CSSProperties;
  className?: string;
  /** How far paths drift as the piece scrolls through the viewport (px) */
  scrollDistance?: number;
  /** How far paths shift in response to cursor position (px) */
  mouseDistance?: number;
  /** Offsets the per-path hash so this instance doesn't move in lockstep
   *  with other compositions built from the same math. */
  seed?: number;
}

function hash(i: number, salt: number) {
  const v = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return (v - Math.floor(v)) * 2 - 1;
}

/**
 * Renders an SVG composition as independent, per-path elements that drift
 * slowly with scroll position (like CompositionDrift) and additionally
 * shift with the cursor — each path at its own depth/direction, lerped
 * smoothly every frame so both inputs feel continuous, not stepped.
 */
export default function CompositionInteractive({
  src,
  style,
  className,
  scrollDistance = 70,
  mouseDistance = 46,
  seed = 0,
}: CompositionInteractiveProps) {
  const [viewBox, setViewBox] = useState("0 0 1200 1200");
  const [aspect, setAspect] = useState(1);
  const [paths, setPaths] = useState<PathInfo[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRefs = useRef<(SVGPathElement | null)[]>([]);

  const scrollTarget = useRef(0);
  const scrollCurrent = useRef(0);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const mouseCurrent = useRef({ x: 0, y: 0 });
  const active = useRef(true);
  const rafId = useRef<number>();

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
        if (parts.length === 4 && parts[3] > 0) setAspect(parts[2] / parts[3]);
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
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const io = new IntersectionObserver(
      (entries) => {
        active.current = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "120% 0px 120% 0px" }
    );
    io.observe(container);

    function measureScroll() {
      const rect = container!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / (vh / 2);
      scrollTarget.current = Math.max(-1, Math.min(1, dist));
    }

    function handlePointerMove(e: PointerEvent) {
      const vw = window.innerWidth || 1;
      const vh = window.innerHeight || 1;
      mouseTarget.current = {
        x: (e.clientX / vw) * 2 - 1,
        y: (e.clientY / vh) * 2 - 1,
      };
    }

    function tick() {
      if (active.current || reduce) {
        scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.045;
        mouseCurrent.current.x += (mouseTarget.current.x - mouseCurrent.current.x) * 0.055;
        mouseCurrent.current.y += (mouseTarget.current.y - mouseCurrent.current.y) * 0.055;

        const sp = reduce ? 0 : scrollCurrent.current;
        const mx = reduce ? 0 : mouseCurrent.current.x;
        const my = reduce ? 0 : mouseCurrent.current.y;

        pathRefs.current.forEach((el, i) => {
          if (!el) return;
          const horizontal = i % 2 === 0;
          const sSign = hash(i, 5 + seed) >= 0 ? 1 : -1;
          const sSpeed = 0.5 + Math.abs(hash(i, 6 + seed)) * 0.7;
          const scrollPrimary = sp * scrollDistance * sSign * sSpeed;
          const scrollSecondary = sp * scrollDistance * 0.2 * hash(i, 7 + seed);
          const scrollX = horizontal ? scrollPrimary : scrollSecondary;
          const scrollY = horizontal ? scrollSecondary : scrollPrimary;

          const depth = 0.35 + Math.abs(hash(i, 9 + seed)) * 0.85;
          const mouseX = mx * mouseDistance * depth * (hash(i, 11 + seed) >= 0 ? 1 : -1);
          const mouseY = my * mouseDistance * depth * (hash(i, 13 + seed) >= 0 ? 1 : -1);

          // Digits stay at their original angle — cursor proximity subtly
          // grows/shrinks each one instead of tilting it.
          const scaleDepth = 0.4 + Math.abs(hash(i, 15 + seed)) * 0.6;
          const scale = 1 + Math.abs(mx) * scaleDepth * 0.05;

          const tx = scrollX + mouseX;
          const ty = scrollY + mouseY;
          el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) scale(${scale.toFixed(3)})`;
        });
      }
      rafId.current = requestAnimationFrame(tick);
    }

    measureScroll();
    window.addEventListener("scroll", measureScroll, { passive: true });
    window.addEventListener("resize", measureScroll);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    rafId.current = requestAnimationFrame(tick);

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", measureScroll);
      window.removeEventListener("resize", measureScroll);
      window.removeEventListener("pointermove", handlePointerMove);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [paths, scrollDistance, mouseDistance, seed]);

  return (
    <div
      ref={containerRef}
      className={`comp-interactive${className ? ` ${className}` : ""}`}
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
