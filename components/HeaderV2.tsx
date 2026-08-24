"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function HeaderV2() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={`v2-header${open ? " open" : ""}`}>
      <div className="v2-header-bar">
        <a href="/" className="logo" aria-label="Real Numbers home">
          <Image
            src="/img/logo-offwhite.svg"
            alt="Real Numbers"
            width={140}
            height={20}
            style={{ height: 16, width: "auto" }}
            priority
          />
        </a>
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
          <a href="/use-cases" onClick={() => setOpen(false)}>Use Cases</a>
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
