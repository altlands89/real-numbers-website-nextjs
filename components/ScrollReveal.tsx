"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll("[data-reveal]"));
    if (!els.length) return;

    // Inside the visual editor's live-preview iframe (set by
    // EditorBridgeListener), reveal everything immediately instead of
    // waiting for a scroll trigger — an editor shouldn't have to scroll
    // just to see text that's about to be edited.
    if (document.documentElement.dataset.rnEditorFrozen === "1") {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
