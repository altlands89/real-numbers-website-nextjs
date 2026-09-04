"use client";

import React, { useEffect, useRef, useState } from "react";
import { REFERENCE_VIEWPORT } from "./typeScale";

/**
 * Wraps a visual editor's canvas so it visually shrinks to fit the admin
 * panel's available width instead of rendering at the real desktop type
 * scale 1:1 — now that the canvas uses the real clamp()-derived sizes (see
 * typeScale.ts), a hero heading can be well over 100px tall, which easily
 * overflows a typical admin content column.
 *
 * This is a pure optical zoom: the canvas is laid out at a fixed virtual
 * width (REFERENCE_VIEWPORT, the same reference typeScale.ts's font sizes
 * are computed against) and then uniformly scaled down via CSS
 * `transform: scale()` to fit whatever width is actually available — the
 * text-to-layout ratio stays exactly what it would be on a real
 * REFERENCE_VIEWPORT-wide desktop screen, just shown smaller. It does not
 * change any font-size math, so what's on screen is still a faithful
 * (just optically smaller) rendering of the real desktop page.
 */
export function DeviceFrame({ children }: { children: React.ReactNode }) {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [naturalHeight, setNaturalHeight] = useState(0);

  useEffect(() => {
    const outer = outerRef.current;
    if (!outer) return;
    const ro = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width) setScale(Math.min(1, width / REFERENCE_VIEWPORT));
    });
    ro.observe(outer);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const inner = innerRef.current;
    if (!inner) return;
    // ResizeObserver reports the untransformed content-box size, so this
    // stays the true (unscaled) canvas height regardless of the transform
    // applied below — exactly what's needed to size the outer wrapper so
    // the rest of the admin page doesn't leave a gap or clip the canvas.
    const ro = new ResizeObserver((entries) => {
      const height = entries[0]?.contentRect.height;
      if (height) setNaturalHeight(height);
    });
    ro.observe(inner);
    return () => ro.disconnect();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 6,
          fontSize: 11,
          color: "var(--theme-elevation-500)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        Desktop preview · {Math.round(scale * 100)}% scale
      </div>
      <div
        ref={outerRef}
        style={{
          width: "100%",
          height: naturalHeight ? naturalHeight * scale : undefined,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          ref={innerRef}
          style={{
            width: REFERENCE_VIEWPORT,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
