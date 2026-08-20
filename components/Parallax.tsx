"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";

interface ParallaxProps {
  children: ReactNode;
  /** Max vertical travel in px as the element crosses the viewport. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
}

/**
 * A drop-in replacement for a plain <div> that adds a gentle vertical
 * float as it scrolls through the viewport — smoothed with the same
 * lerp/rAF pattern used by the composition drift pieces so it reads as
 * continuous, not stepped. Meant to wrap already-clipped, already-sized
 * elements (a photo card, an aspect-ratio box) so the whole card drifts
 * as one rigid piece rather than revealing gaps at its edges.
 */
export default function Parallax({
  children,
  strength = 28,
  className,
  style,
}: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef(0);
  const current = useRef(0);
  const active = useRef(true);
  const rafId = useRef<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const io = new IntersectionObserver(
      (entries) => {
        active.current = entries[0]?.isIntersecting ?? true;
      },
      { rootMargin: "40% 0px 40% 0px" }
    );
    io.observe(el);

    function measure() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      const dist = (center - vh / 2) / (vh / 2);
      target.current = Math.max(-1, Math.min(1, dist));
    }

    function tick() {
      if (active.current) {
        current.current += (target.current - current.current) * 0.08;
        const y = -current.current * strength;
        el!.style.transform = `translate3d(0, ${y.toFixed(1)}px, 0)`;
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
  }, [strength]);

  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}
