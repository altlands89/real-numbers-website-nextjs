"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import NumberBadge from "./NumberBadge";

interface CounterBadgeProps {
  /** Target integer value to count up to. */
  value: number;
  /** Zero-pad the rendered string to this many digits (e.g. 2 -> "02"). */
  padLength?: number;
  duration?: number;
  className?: string;
  style?: CSSProperties;
  color?: "red" | "blue" | "jet" | "horizon";
}

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

export default function CounterBadge({
  value,
  padLength,
  duration = 1600,
  className,
  style,
  color,
}: CounterBadgeProps) {
  const [display, setDisplay] = useState(0);
  const [entered, setEntered] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setDisplay(value);
      setEntered(true);
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !started.current) {
          started.current = true;
          setEntered(true);
          const start = performance.now();
          function tick(now: number) {
            const t = Math.min(1, (now - start) / duration);
            setDisplay(Math.round(easeOutExpo(t) * value));
            if (t < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [value, duration]);

  const str = padLength ? String(display).padStart(padLength, "0") : String(display);

  return (
    <span ref={ref} className={`v2-counter${entered ? " is-entered" : ""}`}>
      <NumberBadge value={str} solid color={color} className={className} style={style} />
    </span>
  );
}
