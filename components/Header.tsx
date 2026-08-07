"use client";

import { useState } from "react";
import Image from "next/image";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className={`site-header${open ? " open" : ""}`} id="siteHeader">
      <div className="wrap">
        <a href="#top" className="logo" aria-label="Real Numbers home">
          <Image
            src="/img/logo-offwhite.svg"
            alt="Real Numbers"
            width={140}
            height={20}
            style={{ height: 20, width: "auto" }}
            priority
          />
        </a>
        <nav className="nav-links" aria-label="Primary">
          <a href="#about" onClick={() => setOpen(false)}>
            About
          </a>
          <a href="#expertise" onClick={() => setOpen(false)}>
            Our Expertise
          </a>
          <a href="#use-cases" onClick={() => setOpen(false)}>
            Use Cases
          </a>
          <a href="#faq" onClick={() => setOpen(false)}>
            Q&amp;A
          </a>
          <a href="#contact" onClick={() => setOpen(false)}>
            Contact
          </a>
        </nav>
        <div className="nav-cta">
          <a href="#contact" className="btn btn-primary">
            Let&apos;s Talk
          </a>
          <button
            className="nav-toggle"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  );
}
