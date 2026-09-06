import Image from "next/image";
import { getCMS } from "@/lib/payload";

const LINKS = [
  { href: "/about", label: "About" },
  { href: "/team", label: "Our Team" },
  { href: "/why-real-numbers", label: "Why Real Numbers" },
  { href: "/our-expertise", label: "Our Expertise" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/questions-founders-ask", label: "Q&A" },
  { href: "/contact", label: "Contact" },
];

export default async function FooterV2() {
  const payload = await getCMS();
  const branding = await payload.findGlobal({ slug: "branding" });
  const footerLogo = branding.footerLogo && typeof branding.footerLogo === "object" ? branding.footerLogo : null;

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
            {footerLogo?.url ? (
              <Image
                src={footerLogo.url}
                alt={footerLogo.alt || "Real Numbers"}
                width={120}
                height={17}
                style={{ height: 15, width: "auto" }}
              />
            ) : (
              <Image
                src="/img/logo-offwhite.svg"
                alt="Real Numbers"
                width={120}
                height={17}
                style={{ height: 15, width: "auto" }}
              />
            )}
          </a>
          <p>© {new Date().getFullYear()} {branding.footerCopyright || "Real Numbers. All rights reserved."}</p>
        </div>
      </div>
    </footer>
  );
}
