"use client";

import { useEffect, useState } from "react";

interface PhotoSlideshowProps {
  images: string[];
  interval?: number;
}

/** Auto-rotating, crossfading full-bleed photo stack — no controls, no arrows. */
export default function PhotoSlideshow({ images, interval = 4200 }: PhotoSlideshowProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, interval);
    return () => clearInterval(id);
  }, [images.length, interval]);

  return (
    <div className="v2-slideshow">
      {images.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`v2-slideshow-img${i === index ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
