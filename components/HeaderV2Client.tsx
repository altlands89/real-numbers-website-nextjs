"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

type Props = {
  logoSrc: string;
  logoAlt: string;
};

export default function HeaderV2Client({ logoSrc, logoAlt }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Tightens the floating header bar once the page leaves the hero, so it
  // reads as a compact toolbar rather than staying hero-sized all the way
  // down. rAF-throttled: scroll fires far more often than we need to react.
  useEffect(() => {
    let ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 40);
        ticking = false;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`v2-header${open ? " open" : ""}${scrolled ? " is-scrolled" : ""}`}
    >
      <div className="v2-header-bar">
        <a href="/" className="logo" aria-label="Real Numbers home">
          <Image
            src={logoSrc}
            alt={logoAlt}
            width={140}
            height={20}
            priority
          />
        </a>
        {/* Desktop-only: every destination visible up front, not just after
            opening the hamburger — the hamburger below stays the only way
            in on narrower screens, where there's no room for this. */}
        <nav className="v2-header-nav-inline" aria-label="Primary">
          <a href="/about">About</a>
          <a href="/team">Our Team</a>
          <a href="/why-real-numbers">Why Real Numbers</a>
          <a href="/our-expertise">Our Expertise</a>
          <a href="/use-cases">Use Cases</a>
          <a href="/questions-founders-ask">Q&amp;A</a>
          <a href="/contact">Contact</a>
          <a href="/contact" className="btn btn-primary v2-header-nav-inline-cta">
            Let&apos;s Talk
          </a>
        </nav>
        <button
          className="v2-nav-toggle"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span>
          <span></span>
        </button>
      </div>
      <div className="v2-header-menu">
        <nav aria-label="Primary">
          <a href="/about" onClick={() => setOpen(false)}>About</a>
          <a href="/team" onClick={() => setOpen(false)}>Our Team</a>
          <a href="/why-real-numbers" onClick={() => setOpen(false)}>Why Real Numbers</a>
          <a href="/our-expertise" onClick={() => setOpen(false)}>Our Expertise</a>
          <a href="/how-we-work" onClick={() => setOpen(false)}>How We Work</a>
          <a href="/use-cases" onClick={() => setOpen(false)}>Use Cases</a>
          <a href="/case-studies" onClick={() => setOpen(false)}>Case Studies</a>
          <a href="/questions-founders-ask" onClick={() => setOpen(false)}>Q&amp;A</a>
          <a href="/contact" onClick={() => setOpen(false)}>Contact</a>
        </nav>
        <a href="/contact" className="btn btn-primary" onClick={() => setOpen(false)}>
          Let&apos;s Talk
        </a>
      </div>
    </header>
  );
}
