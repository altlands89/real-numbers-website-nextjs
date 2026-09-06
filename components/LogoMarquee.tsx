"use client";

import { useEffect, useRef } from "react";

interface Logo {
  src: string;
  alt: string;
}

/** On desktop all logos already fit in one row (no-op). On mobile the row
 *  is a nowrap horizontal strip that auto-advances every 5s with a smooth
 *  scroll, looping seamlessly by scrolling through a duplicated second
 *  copy of the set and snapping back (instantly, no animation) once it's
 *  scrolled exactly one full set-width — since the two copies are
 *  identical, the snap is invisible. */
export default function LogoMarquee({ logos }: { logos: Logo[] }) {
  const rowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const row = rowRef.current;
    if (!row) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const id = window.setInterval(() => {
      if (row.scrollWidth <= row.clientWidth + 4) return;

      const setWidth = row.scrollWidth / 2;
      const target = row.scrollLeft + row.clientWidth * 0.6;

      if (target >= setWidth) {
        row.scrollTo({ left: target, behavior: "smooth" });
        window.setTimeout(() => {
          row.scrollLeft -= setWidth;
        }, 500);
      } else {
        row.scrollTo({ left: target, behavior: "smooth" });
      }
    }, 5000);

    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="v2-logos-row" ref={rowRef}>
      <div className="v2-logos-set">
        {logos.map((l) => (
          <div className="v2-logo-chip" key={l.alt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt={l.alt} />
          </div>
        ))}
      </div>
      <div className="v2-logos-set v2-logos-set--dup" aria-hidden="true">
        {logos.map((l) => (
          <div className="v2-logo-chip" key={`${l.alt}-dup`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={l.src} alt="" />
          </div>
        ))}
      </div>
    </div>
  );
}
