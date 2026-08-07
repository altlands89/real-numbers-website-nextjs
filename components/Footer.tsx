import Image from "next/image";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap">
        <div className="footer-top">
          <div className="footer-brand">
            <a href="#top" className="logo">
              <Image
                src="/img/logo-offwhite.svg"
                alt="Real Numbers"
                width={140}
                height={20}
                style={{ height: 20, width: "auto", marginBottom: 18 }}
              />
            </a>
            <p>
              Real Numbers. Built on trust. Driven by clarity. Focused on
              growth. Leadership deserves more than financial reporting.
            </p>
          </div>
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#why">Why Real Numbers</a>
              </li>
              <li>
                <a href="#expertise">Our Expertise</a>
              </li>
              <li>
                <a href="#use-cases">Use Cases</a>
              </li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Get in Touch</h4>
            <ul>
              <li>
                <a href="#faq">Questions Founders Ask</a>
              </li>
              <li>
                <a href="#contact">Contact</a>
              </li>
              <li>
                <a href="#contact">Let&apos;s Talk</a>
              </li>
            </ul>
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
