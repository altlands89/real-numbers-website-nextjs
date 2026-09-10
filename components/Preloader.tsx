"use client";

import { useEffect, useState } from "react";

const MIN_VISIBLE_MS = 900;
const FADE_MS = 500;
const MAX_WAIT_MS = 2600;

export default function Preloader() {
  const [reduceMotion, setReduceMotion] = useState(false);
  const [hiding, setHiding] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Wastes time on every reload inside the visual editor's live-preview
    // iframe (set by EditorBridgeListener) — skip it there entirely.
    if (document.documentElement.dataset.rnEditorFrozen === "1") {
      setMounted(false);
      return;
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setReduceMotion(true);
      setMounted(false);
      return;
    }

    const start = performance.now();
    let settled = false;

    function reveal() {
      if (settled) return;
      settled = true;
      const elapsed = performance.now() - start;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);
      window.setTimeout(() => setHiding(true), wait);
    }

    if (document.readyState === "complete") {
      reveal();
    } else {
      window.addEventListener("load", reveal, { once: true });
    }
    const fallback = window.setTimeout(reveal, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("load", reveal);
      window.clearTimeout(fallback);
    };
  }, []);

  useEffect(() => {
    if (!hiding) return;
    const t = window.setTimeout(() => setMounted(false), FADE_MS);
    return () => window.clearTimeout(t);
  }, [hiding]);

  if (reduceMotion || !mounted) return null;

  return (
    <div
      className={`preloader${hiding ? " preloader-hidden" : ""}`}
      role="status"
      aria-label="Loading Real Numbers"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/img/logo-counter-animation.svg"
        alt=""
        aria-hidden="true"
        className="preloader-mark"
      />
    </div>
  );
}
