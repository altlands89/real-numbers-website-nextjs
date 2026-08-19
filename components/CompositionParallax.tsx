"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties } from "react";

interface CompositionParallaxProps {
  src: string;
  className?: string;
  style?: CSSProperties;
  /** Parallax intensity — higher drifts further while scrolling. */
  speed?: number;
}

export default function CompositionParallax({
  src,
  className,
  style,
  speed = 0.16,
}: CompositionParallaxProps) {
  const ref = useRef<HTMLImageElement>(null);
  const target = useRef(0);
  const current = useRef(0);
  const rafId = useRef<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    function measure() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const center = rect.top + rect.height / 2;
      // -1 when centered above viewport, +1 when centered below
      const progress = (center - vh / 2) / vh;
      target.current = progress * speed * 220;
    }

    function tick() {
      current.current += (target.current - current.current) * 0.07;
      const rotate = (current.current * 0.04).toFixed(2);
      el!.style.transform = `translate3d(0, ${current.current.toFixed(
        2
      )}px, 0) rotate(${rotate}deg)`;
      rafId.current = requestAnimationFrame(tick);
    }

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    rafId.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [speed]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      src={src}
      alt=""
      aria-hidden="true"
      className={`comp-parallax${className ? ` ${className}` : ""}`}
      style={style}
    />
  );
}
