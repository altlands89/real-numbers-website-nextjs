"use client";

import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface ScrollDotsProps {
  railRef: RefObject<HTMLDivElement | null>;
  count: number;
  className?: string;
}

export default function ScrollDots({ railRef, count, className }: ScrollDotsProps) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    function update() {
      const children = Array.from(rail!.children) as HTMLElement[];
      if (!children.length) return;
      let closest = 0;
      let closestDist = Infinity;
      children.forEach((child, i) => {
        const dist = Math.abs(child.offsetLeft - rail!.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closest = i;
        }
      });
      setActive(closest);
    }

    update();
    rail.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      rail.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [railRef, count]);

  function goTo(i: number) {
    const rail = railRef.current;
    const child = rail?.children[i] as HTMLElement | undefined;
    if (rail && child) {
      rail.scrollTo({ left: child.offsetLeft, behavior: "smooth" });
    }
  }

  if (count <= 1) return null;

  return (
    <div className={`scroll-dots${className ? ` ${className}` : ""}`}>
      {Array.from({ length: count }).map((_, i) => (
        <button
          key={i}
          type="button"
          className={`scroll-dot${i === active ? " active" : ""}`}
          aria-label={`Go to item ${i + 1} of ${count}`}
          onClick={() => goTo(i)}
        />
      ))}
    </div>
  );
}
