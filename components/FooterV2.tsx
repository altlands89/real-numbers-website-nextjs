import Image from "next/image";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/why-real-numbers", label: "Why Real Numbers" },
  { href: "/our-expertise", label: "Our Expertise" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/questions-founders-ask", label: "Q&A" },
  { href: "/contact", label: "Contact" },
];

export default function FooterV2() {
  return (
    <footer className="v2-footer">
      <div className="wrap">
        <div className="v2-footer-cta">
          <h2 data-reveal className="reveal-heading">
            Let&apos;s talk real numbers
          </h2>
          <a href="/contact" className="v2-pill-link v2-pill-link--solid">
            Let&apos;s Talk <span>→</span>
          </a>
        </div>

        <nav className="v2-footer-nav" aria-label="Footer">
          {LINKS.map((l) => (
            <a href={l.href} key={l.href}>{l.label}</a>
          ))}
        </nav>

        <div className="v2-footer-bottom">
          <a href="/" className="logo">
            <Image
              src="/img/logo-offwhite.svg"
              alt="Real Numbers"
              width={120}
              height={17}
              style={{ height: 15, width: "auto" }}
            />
          </a>
          <p>© {new Date().getFullYear()} Real Numbers. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
