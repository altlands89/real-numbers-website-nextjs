"use client";

import { useEffect, useState } from "react";

const IMAGES = [
  "/img/masked/masked-1.png",
  "/img/masked/masked-4.png",
  "/img/masked/masked-5.png",
  "/img/masked/masked-8.png",
  "/img/masked/masked-10.png",
  "/img/masked/masked-12.png",
  "/img/masked/masked-14.png",
  "/img/masked/masked-15.png",
  "/img/masked/masked-16.png",
  "/img/masked/masked-17.png",
  "/img/masked/masked-18.png",
  "/img/masked/masked-19.png",
  "/img/masked/masked-20.png",
];

export default function HeroContextGallery() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % IMAGES.length);
    }, 3200);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="hero-context-visual">
      {IMAGES.map((src, i) => (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={src}
          src={src}
          alt=""
          className={`hero-context-gallery-img${i === index ? " is-active" : ""}`}
        />
      ))}
    </div>
  );
}
