import Image from "next/image";
import CompositionDrift from "./CompositionDrift";

export default function FooterV2() {
  return (
    <footer className="v2-footer">
      <CompositionDrift
        src="/compositions/comp-16.svg"
        distance={140}
        seed={66}
        style={{ left: "-8%", bottom: "-20%", width: 560, opacity: 0.35, filter: "invert(1) brightness(1.9)" }}
      />
      <div className="wrap">
        <div className="v2-footer-top">
          <div>
            <a href="/" className="logo">
              <Image
                src="/img/logo-offwhite.svg"
                alt="Real Numbers"
                width={160}
                height={22}
                style={{ height: 22, width: "auto", marginBottom: 18 }}
              />
            </a>
            <h2 data-reveal className="reveal-heading">
              Let&apos;s talk
              <br />
              real numbers.
            </h2>
            <a href="/contact" className="v2-pill-link v2-pill-link--solid">
              Start the conversation <span>→</span>
            </a>
          </div>
          <div className="v2-footer-cols">
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li><a href="/about">About</a></li>
                <li><a href="/team">Our Team</a></li>
                <li><a href="/why-real-numbers">Why Real Numbers</a></li>
                <li><a href="/our-expertise">Our Expertise</a></li>
                <li><a href="/use-cases">Use Cases</a></li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Get in Touch</h4>
              <ul>
                <li><a href="/questions-founders-ask">Questions Founders Ask</a></li>
                <li><a href="/contact">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Real Numbers. All rights reserved.</p>
          <p className="footer-statement">
            Every important business decision begins with understanding the
            real story behind the numbers.
          </p>
        </div>
      </div>
    </footer>
  );
}
